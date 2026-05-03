"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type: contentType }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "border-green-400";
    if (score >= 40) return "border-yellow-400";
    return "border-red-400";
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">🚀 Go Viral</h1>
          <p className="text-gray-400">AI-powered content virality analyzer</p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <div className="flex gap-3 mb-4">
            {["post", "video script", "tweet", "caption"].map((t) => (
              <button
                key={t}
                onClick={() => setContentType(t)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  contentType === t
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            className="w-full bg-gray-800 rounded-xl p-4 text-white placeholder-gray-500 resize-none outline-none border border-gray-700 focus:border-purple-500"
            rows={6}
            placeholder={`Paste your ${contentType} here...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={analyze}
            disabled={loading || !content.trim()}
            className="w-full mt-4 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "⏳ Analyzing..." : "⚡ Analyze Viral Potential"}
          </button>

          {error && <p className="text-red-400 text-center mt-3">{error}</p>}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
            {/* Score */}
            <div className="flex items-center justify-center">
              <div className={`border-4 ${getScoreBg(result.score)} rounded-full w-32 h-32 flex flex-col items-center justify-center`}>
                <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </span>
                <span className="text-gray-400 text-sm">/ 100</span>
              </div>
            </div>

            <p className="text-center text-lg font-medium">{result.verdict}</p>

            {/* What Works */}
            <div>
              <h3 className="text-green-400 font-semibold mb-3">✅ What Works</h3>
              <ul className="space-y-2">
                {result.whatWorks.map((item: string, i: number) => (
                  <li key={i} className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div>
              <h3 className="text-yellow-400 font-semibold mb-3">💡 Suggestions to Go Viral</h3>
              <ul className="space-y-2">
                {result.suggestions.map((item: string, i: number) => (
                  <li key={i} className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300">
                    {i + 1}. {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Platforms */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-3">📱 Best Platforms</h3>
              <div className="flex gap-2">
                {result.bestPlatforms.map((p: string, i: number) => (
                  <span key={i} className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Try Again */}
            <button
              onClick={() => { setResult(null); setContent(""); }}
              className="w-full py-3 rounded-xl font-semibold bg-gray-800 hover:bg-gray-700 transition"
            >
              🔄 Try Another
            </button>
          </div>
        )}
      </div>
    </main>
  );
}