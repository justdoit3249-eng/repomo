import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateContent, Platform, Tone } from "@/lib/ai";
import { extractVideoId, getYouTubeTranscript } from "@/lib/youtube";
import { createServerSupabase } from "@/lib/supabase";
import { getUsageLimit } from "@/lib/usage";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  const supabase = createServerSupabase();
  const { data: user } = await supabase
    .from("User")
    .select("id, plan, usageCountMonth, usageResetDate")
    .eq("email", session.user.email)
    .single();

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  const now = new Date();
  const resetDate = new Date(user.usageResetDate);
  let currentUsage = user.usageCountMonth;

  if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
    currentUsage = 0;
    await supabase
      .from("User")
      .update({ usageCountMonth: 0, usageResetDate: now.toISOString() })
      .eq("id", user.id);
  }

  const limit = getUsageLimit(user.plan);
  if (currentUsage >= limit) {
    return NextResponse.json(
      { error: `今月の利用上限（${limit}回）に達しました。プランをアップグレードしてください。` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { inputType, inputData, platforms, tone } = body as {
      inputType: "youtube" | "text";
      inputData: string;
      platforms: Platform[];
      tone: Tone;
    };

    let transcript: string;
    let title: string | undefined;

    if (inputType === "youtube") {
      const videoId = extractVideoId(inputData);
      if (!videoId) {
        return NextResponse.json(
          { error: "無効なYouTube URLです" },
          { status: 400 }
        );
      }
      const result = await getYouTubeTranscript(videoId);
      transcript = result.transcript;
      title = result.title;
    } else {
      transcript = inputData;
    }

    if (!transcript || transcript.trim().length < 50) {
      return NextResponse.json(
        { error: "コンテンツが短すぎます。50文字以上のテキストを入力してください。" },
        { status: 400 }
      );
    }

    const results: Record<string, string> = {};

    await Promise.all(
      platforms.map(async (platform) => {
        const output = await generateContent({ transcript, platform, tone, title });
        results[platform] = output;
      })
    );

    await supabase
      .from("User")
      .update({ usageCountMonth: currentUsage + 1 })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      title,
      results,
      remainingUsage: limit - (currentUsage + 1),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "生成中にエラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
