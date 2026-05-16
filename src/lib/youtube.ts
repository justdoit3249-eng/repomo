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

export async function getYouTubeTranscript(videoId: string): Promise<{ title: string; transcript: string }> {
  const response = await fetch(
    `https://www.youtube.com/watch?v=${videoId}`
  );
  const html = await response.text();

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch
    ? titleMatch[1].replace(" - YouTube", "").trim()
    : "Untitled";

  const captionTracksMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
  if (!captionTracksMatch) {
    throw new Error("字幕が見つかりませんでした。Whisper APIで音声解析を試みてください。");
  }

  const captionTracks = JSON.parse(captionTracksMatch[1]);
  const jaTrack = captionTracks.find(
    (track: { languageCode: string }) =>
      track.languageCode === "ja" || track.languageCode === "ja-JP"
  ) || captionTracks[0];

  if (!jaTrack?.baseUrl) {
    throw new Error("字幕トラックのURLが取得できませんでした。");
  }

  const captionResponse = await fetch(jaTrack.baseUrl);
  const captionXml = await captionResponse.text();

  const textSegments = captionXml.match(/<text[^>]*>(.*?)<\/text>/g) || [];
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
