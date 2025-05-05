"use client";

interface InboxMessage {
  id: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export default function InboxPanel() {
  // サンプルインボックスメッセージ
  const sampleMessages: InboxMessage[] = [
    {
      id: "1",
      username: "BUMP.WIN System",
      avatar: "🏆",
      message: "Round 42 has finished. Your PEPE coin has won!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
    },
    {
      id: "2",
      username: "Wallet Alert",
      avatar: "💰",
      message: "Deposit confirmed. 500 SUI has been added to your wallet.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      isRead: true,
    },
    {
      id: "3",
      username: "Team DOGE",
      avatar: "🐕",
      message: "Welcome to Team DOGE! Next round starts in 1 hour.",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
    },
    {
      id: "4",
      username: "BUMP.WIN System",
      avatar: "🏆",
      message: "Round 41 has finished. Unfortunately, your coin has lost.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
    },
    {
      id: "5",
      username: "Tournament Alert",
      avatar: "🔔",
      message: "New tournament announced! Registration is now open.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      isRead: true,
    },
  ];

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return `${diffDays}d ago`;
  };

  return (
    <>
      {/* Inbox header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <h2 className="font-bold text-white text-lg">Inbox</h2>
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {sampleMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 py-2 px-3 rounded-md ${
              !msg.isRead ? "bg-gray-800/50" : ""
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-800">
              <span className="text-lg">{msg.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-300">
                  {msg.username}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(msg.timestamp)}
                </span>
              </div>
              <p className="text-sm text-white break-words mt-1">
                {msg.message}
              </p>
            </div>
            {!msg.isRead && (
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
