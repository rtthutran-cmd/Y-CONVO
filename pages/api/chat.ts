import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { messages } = req.body;

  // 🔎 Diagnostic check
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OPENAI_API_KEY environment variable");
    return res.status(500).json({ error: "Missing OPENAI_API_KEY environment variable" });
  }

  try {
    if (
      messages.length === 1 &&
      messages[0].role === "user" &&
      messages[0].content.toLowerCase().includes("start")
    ) {
      return res.status(200).json({
        reply: [
          "Hey astronaut 🧑‍🚀! Want to talk to an adult and don't know how to start?",
          "I'm here to help you prepare for that convo. Lots of people find it hard to start a conversation, but we can always prepare and practice.",
          "To begin, tell me, who would you like to talk to?",
        ],
      });
    }

    // ✅ Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Y-Convo, a warm and chill chatbot helping teens prepare for conversations with adults. Be brief, supportive, and natural.",
        },
        ...messages,
      ],
    });

    const reply = completion.choices[0].message?.content?.trim() || "(no reply)";
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error("❌ OpenAI API Error:", err);
    return res.status(500).json({ error: err.message || JSON.stringify(err) });
  }
}
