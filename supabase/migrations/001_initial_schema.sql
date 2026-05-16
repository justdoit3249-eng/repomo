-- Repomo Initial Schema
-- Run this in Supabase SQL Editor after project creation

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE plan_type AS ENUM ('FREE', 'STARTER', 'PRO', 'BUSINESS');
CREATE TYPE input_type AS ENUM ('YOUTUBE', 'TEXT', 'AUDIO');
CREATE TYPE platform_type AS ENUM ('X', 'INSTAGRAM', 'NOTE', 'BLOG');
CREATE TYPE tone_type AS ENUM ('CASUAL', 'BUSINESS', 'EDUCATIONAL');

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE "User" (
  id                     TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email                  TEXT UNIQUE NOT NULL,
  name                   TEXT,
  image                  TEXT,
  plan                   plan_type NOT NULL DEFAULT 'FREE',
  "stripeCustomerId"     TEXT UNIQUE,
  "stripeSubscriptionId" TEXT UNIQUE,
  "usageCountMonth"      INTEGER NOT NULL DEFAULT 0,
  "usageResetDate"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- CONTENTS TABLE
-- ============================================================
CREATE TABLE "Content" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"    TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "inputType" input_type NOT NULL,
  "inputData" TEXT NOT NULL,
  transcript  TEXT,
  title       TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_user ON "Content"("userId");

-- ============================================================
-- GENERATIONS TABLE
-- ============================================================
CREATE TABLE "Generation" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "contentId" TEXT NOT NULL REFERENCES "Content"(id) ON DELETE CASCADE,
  platform    platform_type NOT NULL,
  tone        tone_type NOT NULL,
  "outputText" TEXT NOT NULL,
  "isFavorite" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_generation_content ON "Generation"("contentId");

-- ============================================================
-- AUTO-UPDATE updatedAt TRIGGER (User table only)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_updated_at
  BEFORE UPDATE ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
