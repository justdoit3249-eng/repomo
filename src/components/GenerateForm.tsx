"use client";

import { useState } from "react";

type Platform = "x" | "instagram" | "note" | "blog";
type Tone = "casual" | "business" | "educational";

const PLATFORM_LABELS: Record<Platform, string> = {
  x: "X（Twitter）",
  instagram: "Instagram",
  note: "note",
  blog: "ブログ",
};

const TONE_LABELS: Record<Tone, string> = {
  casual: "カジュアル",
  business: "ビジネス",
  educational: "教育的",
};

export default function GenerateForm() {
  const [inputType, setInputType] = useState<"youtube" | "text">("youtube");
  const [inputData, setInputData] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["x"]);
  const [tone, setTone] = useState<Tone>("casual");
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputData.trim() || platforms.length === 0) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputType, inputData, platforms, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, platform: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            入力タイプ
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setInputType("youtube")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                inputType === "youtube"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              YouTube URL
            </button>
            <button
              type="button"
              onClick={() => setInputType("text")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                inputType === "text"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              テキスト入力
            </button>
          </div>
        </div>

        {/* Input Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {inputType === "youtube" ? "YouTube URL" : "テキスト"}
          </label>
          {inputType === "youtube" ? (
            <input
              type="url"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
            />
          ) : (
            <textarea
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="変換したいコンテンツのテキストを貼り付けてください..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 resize-y"
            />
          )}
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            出力先プラットフォーム
          </label>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(PLATFORM_LABELS) as [Platform, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => togglePlatform(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    platforms.includes(key)
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            トーン
          </label>
          <div className="flex gap-3">
            {(Object.entries(TONE_LABELS) as [Tone, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTone(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    tone === key
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !inputData.trim() || platforms.length === 0}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
        >
          {loading ? "生成中..." : "コンテンツを生成する"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">生成結果</h2>
          {Object.entries(results).map(([platform, text]) => (
            <div
              key={platform}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {PLATFORM_LABELS[platform as Platform]}
                </h3>
                <button
                  onClick={() => copyToClipboard(text, platform)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  {copiedPlatform === platform ? "コピー済み!" : "コピー"}
                </button>
              </div>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
