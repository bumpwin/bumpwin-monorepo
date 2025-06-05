"use client";

import { chatApi } from "@/lib/api/chat";
import type { ChatMessage } from "@/types/chat";
import { convertToMessage } from "@/utils/convert";
import { formatTime } from "@/utils/format";
import { supabase } from "@/utils/supabaseClient";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Input } from "@workspace/shadcn/components/input";
import { sendChatMessage } from "@workspace/sui/src/movecall";
import { getSuiScanTxUrl } from "@workspace/sui/src/utils";
import {
  subscribeToChatMessages,
  unsubscribeFromChatMessages,
} from "@workspace/supabase/src/realtime";
import { Effect } from "effect";
import { Clock, Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { match } from "ts-pattern";

// Effect Error types for chat message sending
type ChatSendError = {
  readonly _tag: "ChatSendError";
  readonly cause: unknown;
};

type InsufficientBalanceError = {
  readonly _tag: "InsufficientBalanceError";
  readonly message: string;
};

type WalletNotConnectedError = {
  readonly _tag: "WalletNotConnectedError";
};

// Union type for all chat errors
type ChatErrorUnion = ChatSendError | InsufficientBalanceError | WalletNotConnectedError;

// Error factory functions
const ChatErrors = {
  sendError: (cause: unknown): ChatSendError => ({
    _tag: "ChatSendError",
    cause,
  }),

  insufficientBalance: (message: string): InsufficientBalanceError => ({
    _tag: "InsufficientBalanceError",
    message,
  }),

  walletNotConnected: (): WalletNotConnectedError => ({
    _tag: "WalletNotConnectedError",
  }),
} as const;

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

  // Effect-based message sending
  const sendMessageEffect = (messageText: string, userAccount: { address: string }) =>
    Effect.gen(function* () {
      const signCallback = (tx: Uint8Array) =>
        Effect.async<string, ChatSendError>((resume) => {
          const base64Tx = Buffer.from(tx).toString("base64");
          signAndExecuteTransaction(
            {
              transaction: base64Tx,
            },
            {
              onSuccess: (result: { digest: string }) => {
                resume(Effect.succeed(JSON.stringify({ digest: result.digest })));
              },
              onError: (error: Error) => {
                resume(Effect.fail(ChatErrors.sendError(error)));
              },
            },
          );
        });

      // Send chat message with Effect-wrapped callback
      const txResult = yield* Effect.tryPromise({
        try: () =>
          sendChatMessage(
            client,
            userAccount.address,
            messageText,
            (tx: Uint8Array) => Effect.runPromise(signCallback(tx)),
            "testnet",
          ),
        catch: (error) => ChatErrors.sendError(error),
      });

      return txResult;
    });

  const handleSendMessage = async () => {
    if (message.trim() && !isSending && account) {
      setIsSending(true);

      const program = sendMessageEffect(message.trim(), account).pipe(
        Effect.tap((result) =>
          Effect.sync(() => {
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
          }),
        ),
        Effect.catchAll((error) =>
          Effect.sync(() => {
            console.error("Failed to send message:", error);

            // Handle error types using ts-pattern
            match(error as ChatErrorUnion | unknown)
              .with({ _tag: "ChatSendError" }, (err: ChatSendError) => {
                const errorMessage =
                  err.cause instanceof Error ? err.cause.message : String(err.cause);

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
              })
              .with({ _tag: "InsufficientBalanceError" }, (err: InsufficientBalanceError) => {
                toast.error(
                  <div>
                    {err.message || "Insufficient balance"}
                    <div className="mt-1 text-gray-300 text-sm">
                      You need more SUI to pay for transaction fees
                    </div>
                  </div>,
                );
              })
              .with({ _tag: "WalletNotConnectedError" }, () => {
                toast.error("Please connect your wallet to send messages");
              })
              .otherwise(() => {
                toast.error("Failed to send message");
              });
          }),
        ),
        Effect.tap(() =>
          Effect.sync(() => {
            setIsSending(false);
          }),
        ),
      );

      await Effect.runPromise(program);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-lg">
      {/* Chat header */}
      <div className="flex flex-shrink-0 items-center justify-between border-gray-700 border-b bg-gradient-to-r from-blue-900 to-purple-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-300" />
          <h2 className="font-bold text-lg text-white">Sui Chat</h2>
        </div>
      </div>

      <>
        {/* Message list - scrollable area */}
        <div
          ref={messagesContainerRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto scroll-smooth bg-gradient-to-b from-gray-900 to-gray-950 px-4 py-3"
        >
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-gray-400 text-sm">Loading messages...</p>
            </div>
          ) : error ? (
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
          ) : chatMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-3 rounded-full bg-blue-900/20 p-5">
                <MessageSquare className="h-8 w-8 text-blue-400" />
              </div>
              <p className="font-medium text-gray-300 text-sm">No messages yet</p>
              <p className="mt-1 text-gray-500 text-xs">Send the first message!</p>
            </div>
          ) : (
            <>
              <div className="py-2 text-center">
                <span className="rounded-full bg-gray-800 px-2 py-1 text-gray-400 text-xs">
                  <Clock className="mr-1 inline-block h-3 w-3" />
                  Chat History
                </span>
              </div>
              {chatMessages.map((msg, index) => {
                const prevMsg = index > 0 ? chatMessages[index - 1] : null;
                const showTimeHeader =
                  index === 0 ||
                  (prevMsg &&
                    new Date(prevMsg.timestamp).getDate() !== new Date(msg.timestamp).getDate());

                return (
                  <React.Fragment key={msg.id}>
                    {showTimeHeader && (
                      <div className="my-2 flex justify-center">
                        <div className="rounded-md bg-gray-800/50 px-2 py-1 text-gray-400 text-xs">
                          {msg.timestamp.toLocaleDateString([], {
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                    <div className="group flex items-start gap-3 py-1">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-900/30">
                        <span className="text-lg">{msg.avatar}</span>
                      </div>
                      <div className="max-w-[80%] flex-1 text-left">
                        <div className="mb-1 flex items-center justify-start gap-1">
                          <span className="font-semibold text-gray-300 text-xs">
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
                          <span className="ml-2 text-gray-500 text-xs">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className="relative mr-auto rounded-lg rounded-tl-none bg-gray-800/80 px-3 py-2 text-left text-gray-100 shadow-sm">
                          <p className="break-words text-sm">{msg.message}</p>
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
        <div className="flex-shrink-0 border-gray-800 border-t bg-gray-900 p-3">
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
              className="w-full rounded-lg border border-gray-700 bg-gray-800 py-3 pr-14 pl-4 text-white shadow-inner transition-colors hover:border-blue-700 focus:border-blue-600"
              disabled={loading || isSending || !account}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className={`-translate-y-1/2 absolute top-1/2 right-3 transform rounded-full p-1.5 ${
                !loading && !isSending && message.trim() !== "" && account
                  ? "bg-blue-600 text-white hover:bg-blue-500"
                  : "bg-gray-700 text-gray-400"
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
              <span className="text-amber-400 text-xs">Connect your wallet to send messages</span>
            </div>
          )}
        </div>
      </>
    </div>
  );
}
