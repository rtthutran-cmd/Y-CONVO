"use client";
import React, { useState, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 👋 Automatically start the session by calling the backend when the page loads
  useEffect(() => {
    const start = async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "start session" }],
          }),
        });
        const data = await res.json();
        setMessages([{ role: "assistant", content: data.reply }]);
      } catch (error) {
        console.error("Error starting chat:", error);
        setMessages([
          {
            role: "assistant",
            content:
              "⚠️ Oops, I couldn’t start the chat. Try refreshing the page or checking your connection.",
          },
        ]);
      }
    };
    start();
  }, []);

  // ✉️ Handle user sending message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "⚠️ Sorry, I couldn’t send that message. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          💬 Y-Convo Chatbot
        </h1>
        <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-2 p-2 rounded-lg ${
                msg.role === "assistant"
                  ? "bg-indigo-100 text-gray-800 self-start"
                  : "bg-blue-100 text-gray-800 self-end text-right"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <p className="text-gray-400 text-sm">Y-Convo is typing...</p>}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
