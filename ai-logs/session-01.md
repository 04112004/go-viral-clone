## Prompt
Build a Go Viral Clone AI Content Virality Analyzer using Next.js and Groq API

## Response
Created a full Next.js app with:
- Homepage with content type selector (Post, Video Script, Tweet, Caption)
- Textarea for content input
- API route using Groq llama-3.3-70b model
- Results showing viral score (0-100), what works, suggestions, best platforms
- Dark themed UI with purple buttons using Tailwind CSS

---

## Prompt
How do I set up the project from scratch on Windows?

## Response
Guided through:
1. git clone the GitHub repo
2. cd go-viral-clone
3. mkdir ai-logs
4. npx create-next-app@latest with TypeScript, Tailwind, ESLint flags
5. Pushed to GitHub using git add, commit, push

---

## Prompt
The npx create-next-app command is conflicting with existing files

## Response
Fixed by creating app in a new folder go-viral-app, then moving ai-logs folder into it and pushing to GitHub with --force flag

---

## Prompt
Which free AI API can I use instead of Anthropic?

## Response
Recommended Google Gemini API (free tier) from aistudio.google.com
Installed @google/generative-ai package
Created .env.local with GEMINI_API_KEY

---

## Prompt
Getting error: gemini-1.5-flash model not found

## Response
Changed model name to gemini-2.0-flash in route.ts

---

## Prompt
Getting quota exceeded error for Gemini free tier in India

## Response
Switched to Groq API (console.groq.com) - completely free, no region restrictions
Installed groq-sdk package
Updated .env.local with GROQ_API_KEY
Rewrote route.ts to use llama-3.3-70b-versatile model

---

## Prompt
Every content sample is returning the same score of 75

## Response
Updated system prompt to be more critical
Added temperature: 1.0 for more varied responses
Removed hardcoded 75 example from prompt

---

## Prompt
Still showing 82 for all content types

## Response
Added random seed generator: Math.floor(Math.random() * 1000)
Changed to brutally honest system prompt with strict scoring guide
Added temperature: 1.2 and seed parameter
Added point deduction rules for unoriginal or hookless content

---

## Prompt
Tested with 4 sample content pieces

## Response
App now returns varied scores:
- Post (startup failure story): 72/100
- Video Script (5am productivity): 58/100
- Tweet (unpopular opinion): 79/100
- Caption (day 1 journey): 55/100
All results include specific What Works points, Suggestions, and Best Platforms

---

## Prompt
The challenge requires video/image upload, hook analysis, thumbnail rating, hashtag recommendations. Add these features to the app.

## Response
Updated page.tsx to include:
- Image/thumbnail upload with preview
- File reader to convert image to base64
- Remove image button

Updated route.ts to include:
- Score breakdown with progress bars (hook strength, emotional impact, shareability, originality, call to action)
- Hook analysis section (first 3 seconds analysis)
- Thumbnail rating (when image is uploaded)
- Trending hashtags (6 hashtags)
- Audio/sound recommendations (3 trending sounds)
- Best platforms (3 platforms)

## Prompt
What images can I use to test the app?

## Response
Recommended using unsplash.com for free test images:
- startup desk for post content
- morning productive for video script
- minimal workspace for tweet/caption
Tested all 4 content types with different images and got varied scores