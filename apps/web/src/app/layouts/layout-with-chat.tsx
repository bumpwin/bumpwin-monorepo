"use client";

import CommunicationPanel from "@/components/CommunicationPanel";

export default function LayoutWithChat({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-gradient-to-br from-gray-900 to-gray-800">
      {/* メインコンテンツ - 子要素をそのまま配置 */}
      {children}

      {/* チャットパネル - 固定幅で右側に配置 */}
      <aside className="w-96 flex-shrink-0 border-l border-gray-700 bg-gray-900/50 min-h-full overflow-hidden">
        <CommunicationPanel />
      </aside>
    </div>
  );
}
