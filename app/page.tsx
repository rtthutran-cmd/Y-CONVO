import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages } = req.body;

  // 🔹 Special case: when the session starts, send the astronaut intro
  if (
    messages.length === 1 &&
    messages[0].role === "user" &&
    messages[0].content.toLowerCase().includes("start")
  ) {
    return res.status(200).json({
      reply:
        "Hey astronaut 🧑‍🚀! Want to talk to an adult and don't know how to start? I'm here to help you prepare for that convo. Lots of people find it hard to start a conversation, but we can always prepare and practice. To begin, tell me, who would you like to talk to?",
    });
  }

  try {
    // 🧠 Personality and flow instruction for Y-Convo
    const systemPrompt = `
You are Y-Convo — a warm, chill, supportive chatbot who helps middle- and high-school students
prepare for conversations with adults. You guide them step by step, like an empathetic older friend.
Avoid sounding too formal or too cheerful — keep it natural and kind.

Follow this general structure:
1. Ask who the user wants to talk to and what it's about (Step 1: Identification).
2. Help them organize thoughts using the Whole Message approach (Step 2).
3. Guide rephrasing and offer tips if they want (Step 3).
4. Always validate their feelings, normalize the difficulty, and encourage practice.
5. If the user mentions distress or danger, switch to a gentle tone and suggest reaching out to a trusted adult.

Keep each response to under 3 sentences and always end with a clear next question or step.
Use emojis lightly (🧑‍🚀 💬 🚀).
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
  } catch (
