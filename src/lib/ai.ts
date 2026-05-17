export type Platform = "x" | "instagram" | "note" | "blog";
export type Tone = "casual" | "business" | "educational";

interface GenerateRequest {
  transcript: string;
  platform: Platform;
  tone: Tone;
  title?: string;
}

const PLATFORM_PROMPTS: Record<Platform, string> = {
  x: `あなたはX（Twitter）投稿の専門家です。
以下のコンテンツから、バズりやすいX投稿を5〜10本生成してください。

ルール：
- 1投稿は140文字以内
- 各投稿は独立して価値がある内容にする
- 最初の1文でスクロールを止める力のある書き出し
- 適切な改行を入れる
- ハッシュタグは各投稿に1〜2個
- スレッド形式の場合は「🧵」で始める
- 数字やデータがあれば積極的に使う`,

  instagram: `あなたはInstagram投稿の専門家です。
以下のコンテンツから、Instagramのキャプションを1本生成してください。

ルール：
- 最初の1行でインパクトを出す（ここが「もっと見る」前に表示される）
- 本文は読みやすく改行を多用
- 絵文字を適度に使用
- 最後にCTA（行動喚起）を入れる
- ハッシュタグは10〜15個提案（関連性の高いもの）
- 2,200文字以内`,

  note: `あなたはnote記事の専門家です。
以下のコンテンツから、note向けの記事を1本生成してください。

ルール：
- タイトルはクリックしたくなるものにする
- 2,000〜3,000文字程度
- 見出し（##）で構造化する
- 導入で読者の悩み/関心に触れる
- 具体例やエピソードを交える
- 最後にまとめと次のアクションを提示
- 読みやすい日本語で、専門用語には簡単な説明を添える`,

  blog: `あなたはSEOブログ記事の専門家です。
以下のコンテンツから、SEO最適化されたブログ記事を1本生成してください。

ルール：
- SEOを意識したタイトル（32文字以内）
- メタディスクリプション（120文字以内）を別途提示
- H2、H3で構造化
- 3,000〜5,000文字
- 導入→本論→まとめの構成
- 関連キーワードを自然に含める
- 読者が検索しそうなクエリに答える内容にする`,
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  casual: "フレンドリーで親しみやすいトーンで書いてください。「〜だよね」「〜しよう！」のような口調。",
  business: "プロフェッショナルで信頼感のあるトーンで書いてください。丁寧語を使い、データや根拠を重視。",
  educational: "わかりやすく教える先生のようなトーンで書いてください。段階的な説明、具体例を多用。",
};

export async function generateContent({ transcript, platform, tone, title }: GenerateRequest): Promise<string> {
  const systemPrompt = PLATFORM_PROMPTS[platform];
  const toneInstruction = TONE_INSTRUCTIONS[tone];

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません");
  }

  const userMessage = `以下のコンテンツを変換してください。\n\n${title ? `タイトル: ${title}\n\n` : ""}内容:\n${transcript}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: `${systemPrompt}\n\nトーン指示: ${toneInstruction}` }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI生成に失敗しました: ${error}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("AIからの応答が空でした。もう一度お試しください。");
  }

  return text;
}
