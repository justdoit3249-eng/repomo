"use client";

import { useSession, signOut } from "next-auth/react";
import GenerateForm from "@/components/GenerateForm";

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  STARTER: 30,
  PRO: 100,
  BUSINESS: 9999,
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const plan = session?.user?.plan ?? "FREE";
  const used = session?.user?.usageCountMonth ?? 0;
  const limit = PLAN_LIMITS[plan];
  const remaining = Math.max(0, limit - used);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Repomo
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {plan} プラン（残り {remaining} 回）
            </span>
            {plan === "FREE" && (
              <a
                href="/pricing"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
              >
                アップグレード
              </a>
            )}
            {session?.user && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            コンテンツを変換する
          </h2>
          <p className="mt-2 text-gray-600">
            YouTube URLまたはテキストを入力して、各SNS向けの投稿を自動生成します。
          </p>
        </div>
        <GenerateForm />
      </main>
    </div>
  );
}
