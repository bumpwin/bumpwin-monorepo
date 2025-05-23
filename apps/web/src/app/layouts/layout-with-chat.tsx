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

    <div className="flex h-[calc(100vh-64px)]">
      <main className="flex-1 bg-green-300 overflow-auto">{children}</main>
      <aside className="w-96 bg-green-500 flex flex-col">
        <ChatPanel />
      </aside>
    </div>
  );
}
