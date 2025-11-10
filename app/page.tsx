"use client";
import React, { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      setMessages([
        ...messages,
        userMessage,
        { role: "assistant", content: "⚠️ Error connecting to the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">💬 Y-Convo Chatbot</h1>

        <div className="space-y-2 h-96 overflow-y-auto border rounded p-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md ${
                m.role === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="italic text-gray-400">Thinking...</div>}
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 border rounded-l-md p-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r-md"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
