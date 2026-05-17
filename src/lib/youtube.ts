export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * YouTube Data API v3 + timedtext API で動画タイトルと字幕を取得
 * 日本語字幕を優先、なければ英語、なければエラー
 */
export async function getYouTubeTranscript(videoId: string): Promise<{ title: string; transcript: string }> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY が設定されていません。");
  }

  const videoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
  );
  if (!videoRes.ok) {
    throw new Error(`YouTube API エラー: ${videoRes.status} ${videoRes.statusText}`);
  }
  const videoData = await videoRes.json();
  if (!videoData.items || videoData.items.length === 0) {
    throw new Error("動画が見つかりませんでした。URLを確認してください。");
  }

  const snippet = videoData.items[0].snippet;
  const title = snippet.title;
  const description = snippet.description ?? "";
  const tags = (snippet.tags ?? []) as string[];

  const transcript = await fetchCaptions(videoId);

  if (transcript) {
    return { title, transcript };
  }

  const fallbackText = buildFallbackText(title, description, tags);
  if (fallbackText.length >= 50) {
    return { title, transcript: fallbackText };
  }

  throw new Error(
    "この動画には字幕も説明文もありません。テキスト入力から直接テキストを貼り付けてお試しください。"
  );
}

async function fetchCaptions(videoId: string): Promise<string | null> {
  try {
    const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    const listRes = await fetch(listUrl);
    if (!listRes.ok) return null;
    const listXml = await listRes.text();

    const trackMatches = [...listXml.matchAll(/lang_code="([^"]+)"/g)];
    const availableLangs = trackMatches.map((m) => m[1]);
    if (availableLangs.length === 0) return null;

    let targetLang: string;
    if (availableLangs.includes("ja")) {
      targetLang = "ja";
    } else if (availableLangs.includes("ja-JP")) {
      targetLang = "ja-JP";
    } else if (availableLangs.includes("en")) {
      targetLang = "en";
    } else {
      targetLang = availableLangs[0];
    }

    const captionUrl = `https://www.youtube.com/api/timedtext?lang=${targetLang}&v=${videoId}`;
    const captionRes = await fetch(captionUrl);
    if (!captionRes.ok) return null;
    const captionXml = await captionRes.text();

    const textSegments = captionXml.match(/<text[^>]*>(.*?)<\/text>/g) || [];
    if (textSegments.length === 0) return null;

    return textSegments
      .map((segment) =>
        segment
          .replace(/<[^>]*>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
      )
      .join(" ");
  } catch {
    return null;
  }
}

function buildFallbackText(title: string, description: string, tags: string[]): string {
  const parts: string[] = [`タイトル: ${title}`];
  if (description.trim()) {
    parts.push(`説明: ${description}`);
  }
  if (tags.length > 0) {
    parts.push(`タグ: ${tags.join(", ")}`);
  }
  return parts.join("\n\n");
}
