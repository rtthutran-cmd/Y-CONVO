import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  const systemPrompt = `
You are a warm, empathetic conversation coach helping middle and high school students prepare to talk to trusted adults.
Your tone is like a supportive older sibling — chill, kind, and encouraging.
Use short, friendly sentences (2–4). Ask one question at a time. Never be judgmental.
Guide users through the Whole Message Approach:
1. Identify who they want to talk to and what about.
2. Go through the four parts (what happened, what they think, how they feel, what they want).
3. Help them rephrase into a short script.
4. Offer short “before” and “during” tips.
5. Explain common adult responses and how to handle them.
End with encouragement like: “Got it. You’re ready for that convo! 🚀”
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "OpenAI API Error");

    res.status(200).json(data);
  } catch (error: any) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
