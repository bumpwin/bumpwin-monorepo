"use client";

import ChatPanel from "./ChatPanel";

export default function CommunicationPanel() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] border-l border-gray-800 bg-gray-900 w-96">
      <div className="flex-1 overflow-hidden">
        <ChatPanel />
      </div>
    </div>
  );
}
