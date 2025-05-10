"use client";

import { Input } from "@workspace/shadcn/components/input";
import { useEffect, useState } from "react";
import { chatApi } from "@/lib/api/chat";
import type { ChatHistory } from "@workspace/supabase/src/domain";
import { Loader2 } from "lucide-react";
import React from "react";
import { subscribeToChatMessages, unsubscribeFromChatMessages } from "@workspace/supabase/src/realtime";
import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { sendChatMessage } from "@workspace/sui/src/movecall";
import { toast } from "sonner";
import { getSuiScanTxUrl } from "@workspace/sui/src/utils";

interface ChatMessage {
  id: string;
  username: string;
  userId: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

// Helper function to generate avatar emoji based on address
function generateAvatar(address: string | undefined | null): string {
  if (!address || address.length === 0) return "🌟"; // Default emoji

  // Using a default index (0) if we can't get a valid character code
  const lastChar = address.slice(-1).charCodeAt(0) || 0;
  const index = Math.abs(lastChar % 10);
  const emojis = ["🎁", "🔴", "🎭", "💎", "🏍️", "🔵", "🌟", "🚀", "🎮", "🎯"];
  return emojis[index] || "🌟"; // Fallback emoji if index is somehow invalid
}

// Helper function to shorten address for display
function shortenAddress(address: string | undefined | null): string {
  if (!address || address.length < 10) return "unknown";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Convert ChatHistory to ChatMessage
function convertToMessage(chat: ChatHistory): ChatMessage {
  // Ensure conversion from bigint to string
  const sequence = typeof chat.eventSequence === 'bigint'
    ? chat.eventSequence.toString()
    : String(chat.eventSequence);

  return {
    id: `${chat.txDigest}-${sequence}`,
    username: shortenAddress(chat.senderAddress),
    userId: chat.senderAddress,
    avatar: generateAvatar(chat.senderAddress),
    message: chat.messageText,
    timestamp: new Date(chat.createdAt),
  };
}

export default function ChatPanel() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Sui関連のフック
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // Reference to the message container for auto-scrolling
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to show the latest messages whenever new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && chatMessages.length > 0) {
      const container = messagesContainerRef.current;
      // Scroll to the bottom of the container where the latest messages are
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages]);

  // Fetch messages on component mount
  useEffect(() => {
    let subscriptionId: string | null = null;

    async function fetchMessages() {
      try {
        setLoading(true);
        setError(null);
        const messages = await chatApi.fetchLatest(20); // Get latest 20 messages

        // Convert to ChatMessage format and sort by timestamp (oldest first)
        const convertedMessages = messages
          .map(msg => convertToMessage(msg as ChatHistory))
          .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        setChatMessages(convertedMessages);
      } catch (err) {
        console.error("Failed to fetch chat messages:", err);
        setError("Failed to load chat messages. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    // Load initial messages
    fetchMessages();

    // Setup real-time subscription for new messages
    try {
      subscriptionId = subscribeToChatMessages((newMessage) => {
        // Add the new message to our state
        const newChatMessage = convertToMessage(newMessage);
        setChatMessages((prevMessages) => {
          // Check if we already have this message (avoid duplicates)
          if (prevMessages.some(msg => msg.id === newChatMessage.id)) {
            return prevMessages;
          }

          // Add new message and ensure correct sort order
          return [...prevMessages, newChatMessage]
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        });
      });

      console.log("Set up real-time chat subscription:", subscriptionId);
    } catch (err) {
      console.error("Failed to subscribe to real-time updates:", err);
      // Fallback to polling if real-time fails
      const intervalId = setInterval(() => {
        fetchMessages();
      }, 30000);

      return () => clearInterval(intervalId);
    }

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (subscriptionId) {
        console.log("Cleaning up chat subscription:", subscriptionId);
        unsubscribeFromChatMessages(subscriptionId);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && !isSending && account) {
      try {
        setIsSending(true);

        const signCallback = async (tx: Uint8Array) => {
          const base64Tx = Buffer.from(tx).toString("base64");
          return new Promise<string>((resolve, reject) => {
            signAndExecuteTransaction(
              {
                transaction: base64Tx,
              },
              {
                onSuccess: (result: { digest: string }) => {
                  resolve(JSON.stringify({ digest: result.digest }));
                },
                onError: (error: Error) => {
                  reject(error);
                },
              },
            );
          });
        };

        // メッセージ送信
        const result = await sendChatMessage(
          client,
          account.address,
          message.trim(),
          "testnet",
          signCallback
        );

        // 成功トーストを表示
        toast.success(
          <div>
            Message sent successfully!
            <div className="mt-2">
              <a
                href={getSuiScanTxUrl(result.digest)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View transaction on Suiscan
              </a>
            </div>
          </div>,
          { duration: 3000 }
        );

        // 入力フィールドをクリア
        setMessage("");
      } catch (err) {
        console.error("Failed to send message:", err);

        // Check for InsufficientCoinBalance error
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('InsufficientCoinBalance')) {
          toast.error(
            <div>
              Insufficient SUI balance
              <div className="mt-1 text-sm text-gray-300">
                You need more SUI to pay for transaction fees
              </div>
            </div>
          );
        } else {
          toast.error("Failed to send message");
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-100px)]">
      {/* Chat header */}
      <div className="flex-shrink-0 justify-between items-center px-4 py-2 border-b border-gray-800">
        <h2 className="font-bold text-white text-lg">Chat</h2>
      </div>

      {/* Message list - scrollable area - add ref here */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-1 space-y-2"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">No messages yet</p>
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 py-1">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center">
                  <span className="text-lg">{msg.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm text-gray-300">
                      {msg.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({msg.userId.slice(0, 10)}...)
                    </span>
                  </div>
                  <p className="text-sm text-white break-words">{msg.message}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Chat input area - fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-800 p-1 bg-black">
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !account
                ? "Please connect wallet"
                : message.trim() === ""
                  ? "Pay 0.000001SUI to send a message"
                  : "Send a message"
            }
            className="bg-gray-800 border-gray-700 pl-3 pr-12 py-1 w-full text-white rounded-md"
            disabled={loading || isSending || !account} // アカウントがない場合も無効化
          />
          <button
            type="button"
            onClick={handleSendMessage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white disabled:opacity-50"
            disabled={loading || isSending || message.trim() === "" || !account} // 送信中・アカウントなしの場合も無効化
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
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
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
