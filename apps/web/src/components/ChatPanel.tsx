"use client";

import { Input } from "@workspace/shadcn/components/input";
import { useState } from "react";

interface ChatMessage {
  id: string;
  username: string;
  userId: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

export default function ChatPanel() {
  const [message, setMessage] = useState("");

  // Sample messages with more content to demonstrate vertical space
  const sampleMessages: ChatMessage[] = [
    {
      id: "1",
      username: "miyazaki_ac8",
      userId: "miyazaki_ac8",
      avatar: "🎁",
      message: "Thanks for sending the gift!",
      timestamp: new Date(),
    },
    {
      id: "2",
      username: "akanbe6",
      userId: "4kanbe6",
      avatar: "🔴",
      message: "All's well that ends well",
      timestamp: new Date(),
    },
    {
      id: "3",
      username: "mieLand_mye1",
      userId: "mieLand_mye1",
      avatar: "🎭",
      message:
        "The status vs status collision is so intense, upgrades are essential",
      timestamp: new Date(),
    },
    {
      id: "4",
      username: "miyazaki_ac8",
      userId: "miyazaki_ac8",
      avatar: "🎁",
      message: "💰",
      timestamp: new Date(),
    },
    {
      id: "5",
      username: "urien0202",
      userId: "urien0202",
      avatar: "🔴",
      message:
        "Depending on the burst rotation rate, it might be worth mounting?",
      timestamp: new Date(),
    },
    {
      id: "6",
      username: "akanbe6",
      userId: "4kanbe6",
      avatar: "🔴",
      message: "Captured but unharmed",
      timestamp: new Date(),
    },
    {
      id: "7",
      username: "nerima009",
      userId: "rainman_009",
      avatar: "🏍️",
      message: "Dash is slow",
      timestamp: new Date(),
    },
    {
      id: "8",
      username: "pokotan69",
      userId: "pokotan69",
      avatar: "🔵",
      message: "Deep sea treasure hunting in the NFT ocean",
      timestamp: new Date(),
    },
    {
      id: "9",
      username: "akanbe6",
      userId: "4kanbe6",
      avatar: "🔴",
      message: "Futures are looking bright for this project",
      timestamp: new Date(),
    },
    {
      id: "10",
      username: "miyazaki_ac8",
      userId: "miyazaki_ac8",
      avatar: "🎁",
      message: "Team is delivering consistently, bullish!",
      timestamp: new Date(),
    },
    {
      id: "11",
      username: "urien0202",
      userId: "urien0202",
      avatar: "🔴",
      message: "Chart is forming a nice pattern right now",
      timestamp: new Date(),
    },
    {
      id: "12",
      username: "mieLand_mye1",
      userId: "mieLand_mye1",
      avatar: "🎭",
      message: "Don't sleep on this one, fundamentals are strong",
      timestamp: new Date(),
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Message sending implementation would go here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <h2 className="font-bold text-white text-lg">Chat</h2>
        <div className="flex space-x-3">
          <button type="button" className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button type="button" className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 18h6" />
              <path d="M12 6h6" />
              <path d="M12 12h6" />
              <path d="M6 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path d="M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message list - full height to utilize vertical space */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {sampleMessages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 py-1.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center">
              <span className="text-lg">{msg.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-gray-300">
                  {msg.username}
                </span>
                <span className="text-xs text-gray-500">({msg.userId})</span>
              </div>
              <p className="text-sm text-white break-words">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat input area */}
      <div className="border-t border-gray-800 p-3 mt-auto">
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message"
            className="bg-gray-800 border-gray-700 pl-3 pr-12 py-3 w-full text-white rounded-md"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>💎 0</span>
            <span>💝 38.7K</span>
          </div>
          <button type="button" className="text-gray-400 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
