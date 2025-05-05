"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";
import InboxPanel from "./InboxPanel";

type PanelType = "chat" | "inbox";

interface CommunicationPanelProps {
  initialPanelType?: PanelType;
}

// グローバルインターフェース
interface CommunicationPanelGlobal {
  switchToChat: () => void;
  switchToInbox: () => void;
  getActivePanelType: () => PanelType;
  setActivePanelType: (type: PanelType) => void;
}

// declare global {
//   interface Window {
//     __COMMUNICATION_PANEL__: CommunicationPanelGlobal;
//   }
// }

export default function CommunicationPanel({
  initialPanelType = "chat",
}: CommunicationPanelProps) {
  const [activePanelType, setActivePanelType] =
    useState<PanelType>(initialPanelType);

  // 公開メソッド
  const switchToChat = () => setActivePanelType("chat");
  const switchToInbox = () => setActivePanelType("inbox");

  // コンポーネントをグローバルに登録
  if (typeof window !== "undefined") {
    const globalPanel: CommunicationPanelGlobal = {
      switchToChat,
      switchToInbox,
      getActivePanelType: () => activePanelType,
      setActivePanelType,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__COMMUNICATION_PANEL__ = globalPanel;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] border-l border-gray-800 bg-gray-900 w-96">
      <div className="flex-1 overflow-hidden">
        {activePanelType === "chat" ? <ChatPanel /> : <InboxPanel />}
      </div>
    </div>
  );
}
