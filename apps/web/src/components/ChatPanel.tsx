"use client";

import { chatApi } from "@/lib/api/chat";
import type { ChatMessage } from "@/types/chat";
import { convertToMessage } from "@/utils/convert";
import { formatTime } from "@/utils/format";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Input } from "@workspace/shadcn/components/input";
import { sendChatMessage } from "@workspace/sui/src/movecall";
import { getSuiScanTxUrl } from "@workspace/sui/src/utils";
import type { ChatHistory } from "@workspace/supabase/src/domain";
import {
  subscribeToChatMessages,
  unsubscribeFromChatMessages,
} from "@workspace/supabase/src/realtime";
import {
  Clock,
  ExternalLink,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";

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

    async function fetchMessages() {
      try {
        setLoading(true);
        setError(null);
        const messages = await chatApi.fetchLatest(20); // Get latest 20 messages

        // Convert to ChatMessage format and sort by timestamp (oldest first)
        const convertedMessages = messages
          .map((msg) => convertToMessage(msg as ChatHistory))
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
          signCallback,
          "testnet",
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
              <div className="mt-1 text-sm text-gray-300">
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

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-80px)] bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden fixed right-0 top-20 w-96 z-40">
      {/* Chat header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-900 to-purple-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-300" />
          <h2 className="font-bold text-white text-lg">Sui Chat</h2>
        </div>
      </div>

      <>
        {/* Message list - scrollable area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gradient-to-b from-gray-900 to-gray-950 scroll-smooth"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-400 text-sm">Loading messages...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-4 rounded-lg bg-red-900/20 border border-red-800">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 px-3 py-1 text-xs bg-red-800 hover:bg-red-700 text-white rounded-md"
              >
                Reload
              </button>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="p-5 rounded-full bg-blue-900/20 mb-3">
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-gray-300 text-sm font-medium">
                No messages yet
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Send the first message!
              </p>
            </div>
          ) : (
            <>
              <div className="py-2 text-center">
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                  <Clock className="inline-block h-3 w-3 mr-1" />
                  Chat History
                </span>
              </div>
              {chatMessages.map((msg, index) => {
                const prevMsg = index > 0 ? chatMessages[index - 1] : null;
                const showTimeHeader =
                  index === 0 ||
                  (prevMsg &&
                    new Date(prevMsg.timestamp).getDate() !==
                      new Date(msg.timestamp).getDate());

                return (
                  <React.Fragment key={msg.id}>
                    {showTimeHeader && (
                      <div className="flex justify-center my-2">
                        <div className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-400">
                          {msg.timestamp.toLocaleDateString([], {
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 py-1 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-900/30">
                        <span className="text-lg">{msg.avatar}</span>
                      </div>
                      <div className="flex-1 max-w-[80%] text-left">
                        <div className="flex items-center gap-1 mb-1 justify-start">
                          <span className="font-semibold text-xs text-gray-300">
                            {msg.username}
                          </span>
                          {/*
                          <a
                            href={`https://suiscan.xyz/testnet/account/${msg.userId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink className="inline h-3 w-3 ml-1" />
                          </a>
                          */}
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className="relative px-3 py-2 rounded-lg shadow-sm text-left bg-gray-800/80 text-gray-100 rounded-tl-none mr-auto">
                          <p className="text-sm break-words">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div className="h-2" />
            </>
          )}
        </div>

        {/* Chat input area - fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-800 p-3 bg-gray-900">
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                !account
                  ? "Please connect your wallet"
                  : message.trim() === ""
                    ? "Pay 0.000001SUI to send a message"
                    : "Type your message"
              }
              className="bg-gray-800 border border-gray-700 hover:border-blue-700 focus:border-blue-600 pl-4 pr-14 py-3 w-full text-white rounded-lg shadow-inner transition-colors"
              disabled={loading || isSending || !account}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1.5
                  ${
                    !loading && !isSending && message.trim() !== "" && account
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "bg-gray-700 text-gray-400"
                  } transition-colors disabled:opacity-50`}
              disabled={
                loading || isSending || message.trim() === "" || !account
              }
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
              <span className="text-xs text-amber-400">
                Connect your wallet to send messages
              </span>
            </div>
          )}
        </div>
      </>
    </div>
  );
}
