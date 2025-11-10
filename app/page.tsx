"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, RotateCcw } from "lucide-react";

export default function YConvo() {
  const [messages, setMessages] = useState<{ type: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { type: "bot", text }]);
  };
  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { type: "user", text }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    addUserMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((m) =>
        m.type === "user"
          ? { role: "user", content: m.text }
          : { role: "assistant", content: m.text }
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...conversationHistory, { role: "user", content: userMessage }],
        }),
      });

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
      addBotMessage(botResponse);
    } catch (error) {
      addBotMessage("Sorry, I’m having trouble connecting right now. Try again?");
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    addBotMessage("Hey astronaut 🧑‍🚀! I’m Y-Convo — here to help you prepare for a real talk with an adult.");
  };

  useEffect(() => resetConversation(), []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Y-Convo 💬</h1>
          <p className="text-sm text-gray-500">Your Conversation Coach</p>
        </div>
        <button
          onClick={resetConversation}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
          Start Over
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
