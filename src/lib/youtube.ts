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

  // 1. YouTube Data API v3 で動画タイトルを取得
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
  const title = videoData.items[0].snippet.title;

  // 2. timedtext API で字幕トラック一覧を取得
  const listUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
  const listRes = await fetch(listUrl);
  if (!listRes.ok) {
    throw new Error("字幕トラック一覧の取得に失敗しました。");
  }
  const listXml = await listRes.text();

  // 字幕トラックから言語コードを抽出
  const trackMatches = [...listXml.matchAll(/lang_code="([^"]+)"/g)];
  const availableLangs = trackMatches.map((m) => m[1]);

  if (availableLangs.length === 0) {
    throw new Error("この動画には字幕がありません。Whisper APIで音声解析を試みてください。");
  }

  // 日本語優先、なければ英語
  let targetLang: string | undefined;
  if (availableLangs.includes("ja")) {
    targetLang = "ja";
  } else if (availableLangs.includes("ja-JP")) {
    targetLang = "ja-JP";
  } else if (availableLangs.includes("en")) {
    targetLang = "en";
  } else {
    // どれにも該当しなければ最初のトラックを使用
    targetLang = availableLangs[0];
  }

  // 3. 字幕テキストを取得
  const captionUrl = `https://www.youtube.com/api/timedtext?lang=${targetLang}&v=${videoId}`;
  const captionRes = await fetch(captionUrl);
  if (!captionRes.ok) {
    throw new Error("字幕テキストの取得に失敗しました。");
  }
  const captionXml = await captionRes.text();

  // XMLからテキストを抽出
  const textSegments = captionXml.match(/<text[^>]*>(.*?)<\/text>/g) || [];
  if (textSegments.length === 0) {
    throw new Error("字幕テキストが空です。Whisper APIで音声解析を試みてください。");
  }

  const transcript = textSegments
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

  return { title, transcript };
}
