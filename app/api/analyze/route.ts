import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const groq = new Groq({ apiKey });
    const { content, type } = await request.json();

    // Add randomness seed to force different responses
    const seed = Math.floor(Math.random() * 1000);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a brutally honest viral content critic. You score content very differently based on quality. Weak content gets 20-40, average gets 41-65, good gets 66-80, exceptional gets 81-100. You NEVER give the same score twice in a row. Session: ${seed}`
        },
        {
          role: "user",
          content: `Rate this ${type} (${content.length} characters long):

"${content}"

Be CRITICAL. Ask yourself:
1. Would YOU personally share this? (yes/no)
2. Have you seen 100 posts like this before? (if yes, score drops 20 points)
3. Does it have a strong hook in the FIRST sentence? (if no, score drops 15 points)
4. Does it trigger strong emotion? (if weak emotion, score drops 10 points)

After your critical analysis, return ONLY this JSON:
{"score":<integer between 15 and 95>,"verdict":"<brutally honest one sentence>","whatWorks":["<specific thing 1>","<specific thing 2>","<specific thing 3>"],"suggestions":["<very specific fix 1>","<very specific fix 2>","<very specific fix 3>"],"bestPlatforms":["<best platform>","<second platform>"]}`
        }
      ],
      temperature: 1.2,
      seed: seed,
    });

    const text = completion.choices[0].message.content || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    // Ensure score variety - if somehow same, adjust slightly
    data.score = Math.min(95, Math.max(15, data.score));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}