"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type: contentType, image }),
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

  const getScoreBorder = (score: number) => {
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

          {/* Content Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
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

          {/* Text Input */}
          <textarea
            className="w-full bg-gray-800 rounded-xl p-4 text-white placeholder-gray-500 resize-none outline-none border border-gray-700 focus:border-purple-500"
            rows={5}
            placeholder={`Paste your ${contentType} here...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* Image Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="mt-4 border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-purple-500 transition"
          >
            {image ? (
              <div>
                <img src={image} alt="preview" className="max-h-40 mx-auto rounded-lg mb-2" />
                <p className="text-sm text-gray-400">{imageName}</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl mb-1">🖼️</p>
                <p className="text-gray-400 text-sm">Upload image or thumbnail (optional)</p>
                <p className="text-gray-600 text-xs mt-1">JPG, PNG supported</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {image && (
            <button
              onClick={() => { setImage(null); setImageName(""); }}
              className="mt-2 text-xs text-red-400 hover:text-red-300"
            >
              ✕ Remove image
            </button>
          )}

          <button
            onClick={analyze}
            disabled={loading || (!content.trim() && !image)}
            className="w-full mt-4 py-3 rounded-xl font-semibold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "⏳ Analyzing..." : "⚡ Analyze Viral Potential"}
          </button>

          {error && <p className="text-red-400 text-center mt-3">{error}</p>}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-900 rounded-2xl p-6 space-y-6">

            {/* Overall Score */}
            <div className="flex items-center justify-center">
              <div className={`border-4 ${getScoreBorder(result.score)} rounded-full w-32 h-32 flex flex-col items-center justify-center`}>
                <span className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}
                </span>
                <span className="text-gray-400 text-sm">/ 100</span>
              </div>
            </div>

            <p className="text-center text-lg font-medium">{result.verdict}</p>

            {/* Score Breakdown */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-3">📊 Score Breakdown</h3>
              <div className="grid grid-cols-2 gap-3">
                {result.breakdown && Object.entries(result.breakdown).map(([key, val]: any) => (
                  <div key={key} className="bg-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 text-xs capitalize mb-1">{key.replace(/_/g, " ")}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                      <span className="text-white text-xs font-bold">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hook Analysis */}
            <div>
              <h3 className="text-blue-400 font-semibold mb-3">🎣 Hook Analysis</h3>
              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-sm text-gray-300">{result.hookAnalysis}</p>
              </div>
            </div>

            {/* Thumbnail Rating */}
            {result.thumbnailRating && (
              <div>
                <h3 className="text-yellow-400 font-semibold mb-3">🖼️ Thumbnail Rating</h3>
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-300">{result.thumbnailRating}</p>
                </div>
              </div>
            )}

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
              <h3 className="text-orange-400 font-semibold mb-3">💡 Suggestions to Go Viral</h3>
              <ul className="space-y-2">
                {result.suggestions.map((item: string, i: number) => (
                  <li key={i} className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300">
                    {i + 1}. {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending Hashtags */}
            <div>
              <h3 className="text-pink-400 font-semibold mb-3">🔥 Trending Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag: string, i: number) => (
                  <span key={i} className="bg-pink-900 text-pink-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Audio Recommendations */}
            <div>
              <h3 className="text-cyan-400 font-semibold mb-3">🎵 Trending Audio/Sounds</h3>
              <ul className="space-y-2">
                {result.audioRecommendations.map((item: string, i: number) => (
                  <li key={i} className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300">
                    🎵 {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Platforms */}
            <div>
              <h3 className="text-purple-400 font-semibold mb-3">📱 Best Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {result.bestPlatforms.map((p: string, i: number) => (
                  <span key={i} className="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Try Again */}
            <button
              onClick={() => { setResult(null); setContent(""); setImage(null); }}
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