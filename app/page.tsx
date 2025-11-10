"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Start session automatically on page load
  useEffect(() => {
    const startSession = async () => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "start session" }],
        }),
      });
      const data = await response.json();
      if (Array.isArray(data.reply)) {
        // multiple welcome messages
        for (const msg of data.reply) {
          addMessage("assistant", msg);
        }
      } else {
        addMessage("assistant", data.reply);
      }
    };
    startSession();
  }, []);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user" as const, content: input };
    addMessage("user", input);
    setInput("");
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, newMessage] }),
    });
    const data = await response.json();
    setLoading(false);

    if (Array.isArray(data.reply)) {
      for (const msg of data.reply) {
        addMessage("assistant", msg);
      }
    } else {
      addMessage("assistant", data.reply);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4 flex flex-col">
        <h1 className="text-xl font-bold text-center mb-4">
          💬 Y-Convo Chatbot
        </h1>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-100 self-end text-right ml-auto"
                  : "bg-gray-100 text-left"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 text-sm">Thinking...</div>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg p-2"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
