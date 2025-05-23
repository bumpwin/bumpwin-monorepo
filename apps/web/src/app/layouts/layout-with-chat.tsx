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


    // In

    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 bg-green-300 overflow-auto">
          {children}
        </main>
        <aside className="w-96 bg-green-500 flex-shrink-0 flex flex-col">
          {/* <ChatPanel /> */}
        </aside>
      </div>
    </div>
  );
}
