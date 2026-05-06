import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    const { content, type, image } = await request.json();
    const seed = Math.floor(Math.random() * 1000);

    const imageContext = image
      ? "An image/thumbnail was also uploaded with this content."
      : "No image was uploaded.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a brutally honest viral content analyst with expertise in TikTok, Instagram, Twitter, and YouTube. You give varied, honest scores. Never default to the same score. Always respond with valid JSON only, no markdown, no backticks. Session: ${seed}`,
        },
        {
          role: "user",
          content: `Analyze this ${type} content for viral potential:

Content: "${content}"
Image context: ${imageContext}

Be CRITICAL and HONEST. Score based on:
- Hook strength (first 3 seconds/words)
- Emotional trigger
- Shareability
- Originality
- Call to action

Return ONLY this JSON (no markdown):
{
  "score": <integer 15-95>,
  "verdict": "<one honest sentence>",
  "breakdown": {
    "hook_strength": <0-100>,
    "emotional_impact": <0-100>,
    "shareability": <0-100>,
    "originality": <0-100>,
    "call_to_action": <0-100>
  },
  "hookAnalysis": "<specific analysis of the opening hook and first 3 seconds>",
  "thumbnailRating": "${image ? "<rate the thumbnail: composition, colors, text, click-through potential>" : "No thumbnail uploaded. Recommend uploading a thumbnail for better analysis."}",
  "whatWorks": ["<specific point 1>", "<specific point 2>", "<specific point 3>"],
  "suggestions": ["<actionable fix 1>", "<actionable fix 2>", "<actionable fix 3>"],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6"],
  "audioRecommendations": ["<trending sound 1>", "<trending sound 2>", "<trending sound 3>"],
  "bestPlatforms": ["<platform 1>", "<platform 2>", "<platform 3>"]
}`,
        },
      ],
      temperature: 1.2,
      seed: seed,
    });

    const text = completion.choices[0].message.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}