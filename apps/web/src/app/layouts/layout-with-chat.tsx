"use client";

import ChatPanel from "@/components/ChatPanel";

export default function LayoutWithChat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 to-gray-800">
      <main className="flex-1 overflow-y-auto">{children}</main>

      <aside className="w-96 flex flex-col">
        <ChatPanel />
      </aside>
    </div>
  );
}
