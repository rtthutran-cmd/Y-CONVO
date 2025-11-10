import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages } = req.body;

  try {
    // System prompt: defines Y-Convo's identity and behavior
    const systemPrompt = `
You are Y-Convo — a warm, chill, supportive chatbot who helps middle- and high-school students
prepare for conversations with adults. You guide them step by step, like an empathetic older friend.
Avoid sounding too formal or too cheerful — keep it natural and kind.

Follow this general structure:
1. Welcome the user and ask who they want to talk to (Step 1: Identification)
2. Once user identifies adult + topic, move to Step 2 (Whole Message)
3. Help them write or rephrase what to say (Step 3)
4. Offer optional tips and adult response advice if user asks.
5. If user mentions distress or danger, use a gentler tone and suggest reaching out to a trusted adult.

Only ask one clear question at a time. Use emojis lightly, like 🧑‍🚀 or 💬. Keep messages under 2-3 short sentences.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message?.content?.trim() || "";
    res.status(200).json({ reply });
  } catch (err: any) {
    console.error("OpenAI API Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
