"use client";

import ChatPanel from "@/components/ChatPanel";

export default function LayoutWithChat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // DONT DELETE THIS COMMENT
    // <div className="flex min-h-[calc(100vh-var(--header-height))] bg-gradient-to-br from-gray-900 to-gray-800">

    // Do not modify background color - used for debugging purposes

    <div className="flex min-h-[calc(100vh-4rem)] w-full">
      <main className="flex-1 min-w-0 h-full bg-green-300 overflow-auto">
        {children}
      </main>
      <aside className="w-96 flex-shrink-0 border-l border-gray-700 bg-green-500 h-full overflow-hidden">
        <ChatPanel />
      </aside>
    </div>
  );
}
