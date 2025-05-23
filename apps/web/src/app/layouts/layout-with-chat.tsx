"use client";

import CommunicationPanel from "@/components/CommunicationPanel";

export default function LayoutWithChat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // DONT DELETE THIS COMMENT
    // <div className="flex min-h-[calc(100vh-var(--header-height))] bg-gradient-to-br from-gray-900 to-gray-800">

    <div className="flex h-full w-full">
      <main className="flex-1 min-w-0 h-full bg-green-300 overflow-auto">{children}</main>
      <aside className="w-96 flex-shrink-0 border-l border-gray-700 bg-green-500 h-full overflow-hidden">
        <CommunicationPanel />
      </aside>
    </div>
  );
}
