"use client";

import { emojiList } from "@/constants/emojiList";
import { chatApi } from "@/lib/api/chat";
import type { ChatMessage } from "@/types/chat";
import { convertToMessage } from "@/utils/convert";
import { supabase } from "@/utils/supabaseClient";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { formatAddress } from "@mysten/sui/utils";
import { Input } from "@workspace/shadcn/components/input";
import { sendChatMessage } from "@workspace/sui/src/movecall";
import { getSuiScanTxUrl } from "@workspace/sui/src/utils";
import {
  subscribeToChatMessages,
  unsubscribeFromChatMessages,
} from "@workspace/supabase/src/realtime";
import { Clock, Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { match } from "ts-pattern";

const getColorFromUserId = (userId: string): string => {
  // 0xプレフィックスを除去
  const cleanId = userId.replace("0x", "");
  let hash = 0;
  for (let i = 0; i < cleanId.length; i++) {
    hash = cleanId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const getEmojiFromUserId = (userId: string): string => {
  // 0xプレフィックスを除去
  const cleanId = userId.replace("0x", "");
  let hash = 0;
  for (let i = 0; i < cleanId.length; i++) {
    hash = cleanId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % emojiList.length;
  return emojiList[idx] ?? "";
};

export default function TwitchStyleChatPanel() {
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
      const lastMessage = container.lastElementChild;

      if (lastMessage) {
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: "smooth",
          block: "end",
        };
        lastMessage.scrollIntoView(scrollOptions);
      }
    }
  }, [chatMessages]);

  // Fetch messages on component mount
  useEffect(() => {
    let subscriptionId: string | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      await chatApi.fetchLatest(40).match(
        (messages) => {
          // Convert to ChatMessage format and sort by timestamp (oldest first)
          const convertedMessages = messages
            .map((msg) => convertToMessage(msg))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          setChatMessages(convertedMessages);
        },
        (err) => {
          console.error("Failed to fetch chat messages:", err);
          if (err.message.includes("Supabase environment variables are not configured")) {
            setError("Chat service is not properly configured. Please contact the administrator.");
          } else {
            setError("Failed to load chat messages. Please try again later.");
          }
        },
      );

      setLoading(false);
    };

    // Load initial messages
    fetchMessages();

    // Setup real-time subscription for new messages
    if (supabase) {
      try {
        subscriptionId = subscribeToChatMessages(supabase, (newMessage) => {
          // Add the new message to our state
          const newChatMessage = convertToMessage(newMessage);
          setChatMessages((prevMessages) => {
            // Check if we already have this message (avoid duplicates)
            if (prevMessages.some((msg) => msg.id === newChatMessage.id)) {
              return prevMessages;
            }

            // Add new message and ensure correct sort order
            return [...prevMessages, newChatMessage].sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
            );
          });
        });

        console.log("Set up real-time chat subscription:", subscriptionId);
      } catch (err) {
        console.error("Failed to subscribe to real-time updates:", err);
        // Fallback to polling if real-time fails
        intervalId = setInterval(fetchMessages, 30000);
      }
    } else {
      // If supabase is not available, use polling
      intervalId = setInterval(fetchMessages, 30000);
    }

    // Cleanup: unsubscribe when component unmounts
    return () => {
      if (subscriptionId) {
        console.log("Cleaning up chat subscription:", subscriptionId);
        unsubscribeFromChatMessages(subscriptionId);
      }
      if (intervalId) {
        clearInterval(intervalId);
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
        const txResult = await sendChatMessage(
          client,
          account.address,
          message.trim(),
          signCallback,
          "testnet",
        );

        // 成功トーストを表示
        toast.success(
          <div>
            Message sent successfully!
            <div className="mt-2">
              <a
                href={getSuiScanTxUrl(txResult.digest)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View transaction on Suiscan
              </a>
            </div>
          </div>,
          { duration: 3000 },
        );

        // 入力フィールドをクリア
        setMessage("");
      } catch (err) {
        console.error("Failed to send message:", err);

        // Check for InsufficientCoinBalance error
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes("InsufficientCoinBalance")) {
          toast.error(
            <div>
              Insufficient SUI balance
              <div className="mt-1 text-gray-300 text-sm">
                You need more SUI to pay for transaction fees
              </div>
            </div>,
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

  // Function to render emoji in messages
  const renderWithEmoji = (text: string) => {
    // Simple emoji rendering for 🔥 emojis seen in the screenshot
    return text.split(/(\u{1F525}+)/gu).map((part, index) => {
      if (part.match(/^\u{1F525}+$/u)) {
        return (
          <span
            key={`emoji-${index}-${part.length}`}
            className="inline-block animate-pulse text-xl"
          >
            {part}
          </span>
        );
      }
      return <span key={`text-${index}-${part.length}`}>{part}</span>;
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-[#0e0e10]">
      {/* Chat header */}
      <div className="flex flex-shrink-0 items-center justify-between border-[#2a2a2d] border-b bg-[#18181b] px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-white" />
          <h2 className="font-bold text-lg text-white">Chat Room</h2>
        </div>
      </div>

      <>
        {/* Message list - scrollable area */}
        <div
          ref={messagesContainerRef}
          className="min-h-0 flex-1 space-y-1 overflow-y-auto scroll-smooth bg-[#0e0e10] px-2 py-1"
        >
          {match({ loading, error, isEmpty: chatMessages.length === 0 })
            .with({ loading: true }, () => (
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-[#9147ff]" />
                <p className="text-gray-400 text-sm">Loading messages...</p>
              </div>
            ))
            .with({ error: true }, () => (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-red-800 bg-red-900/20 p-4">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-2 rounded-md bg-red-800 px-3 py-1 text-white text-xs hover:bg-red-700"
                >
                  Reload
                </button>
              </div>
            ))
            .with({ isEmpty: true }, () => (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-3 rounded-full bg-[#9147ff]/20 p-5">
                  <MessageSquare className="h-8 w-8 text-[#9147ff]" />
                </div>
                <p className="font-medium text-gray-300 text-sm">No messages yet</p>
                <p className="mt-1 text-gray-500 text-xs">Send the first message!</p>
              </div>
            ))
            .otherwise(() => (
              <>
                <div className="py-2 text-center">
                  <span className="rounded-full bg-[#18181b] px-2 py-1 text-gray-400 text-xs">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    Chat History
                  </span>
                </div>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="group rounded px-1 py-1 hover:bg-[#18181b]/30">
                    <div className="break-words text-sm">
                      <span className="break-words">
                        <span>{getEmojiFromUserId(msg.userId)} </span>
                        <span
                          className="font-bold"
                          style={{
                            color: getColorFromUserId(msg.userId),
                          }}
                        >
                          {formatAddress(msg.userId)}
                        </span>
                        <span className="text-gray-200">: {renderWithEmoji(msg.message)}</span>
                      </span>
                    </div>
                  </div>
                ))}
                <div className="h-2" />
              </>
            ))}
        </div>

        {/* Chat input area - fixed at bottom */}
        <div className="flex-shrink-0 border-[#2a2a2d] border-t bg-[#18181b] p-3">
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                !account
                  ? "Please connect your wallet"
                  : message.trim() === ""
                    ? "Send a message for 0.000001 SUI"
                    : "Type your message"
              }
              className="w-full rounded-md border border-[#2a2a2d] bg-[#0e0e10] py-3 pr-14 pl-4 text-white shadow-inner transition-colors hover:border-[#9147ff] focus:border-[#9147ff]"
              disabled={loading || isSending || !account}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className={`-translate-y-1/2 absolute top-1/2 right-3 transform rounded-full p-1.5 ${
                !loading && !isSending && message.trim() !== "" && account
                  ? "bg-[#9147ff] text-white hover:bg-[#772ce8]"
                  : "bg-[#3a3a3d] text-gray-400"
              } transition-colors disabled:opacity-50`}
              disabled={loading || isSending || message.trim() === "" || !account}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          {!account && (
            <div className="mt-2 text-center">
              <span className="text-[#efeff1] text-xs">Connect your wallet to chat</span>
            </div>
          )}
        </div>
      </>
    </div>
  );
}
