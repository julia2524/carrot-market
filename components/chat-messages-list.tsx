"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SUPABASE_PUBLIC_KEY = "sb_publishable_gzLuNdgCttf97zc8U0W7cA_Odg67KQU";
const SUPABASE_URL = "https://aeiakcjhtrmcxnkifkkj.supabase.co";
interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
  productId: number;
  productPhoto: string;
}
export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsg) => [
      ...prevMsg,
      {
        isSystem: false,
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "undefined",
          avatar: "undefined",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, [messages]);
  return (
    <div className="flex flex-col h-full absolute inset-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col gap-5 p-5 pt-32 pb-24"
      >
        {messages.map((message) =>
          message.isSystem ? (
            <div
              key={message.id}
              className="flex flex-row gap-3 border-2 border-neutral-600 py-2 px-3 rounded-md"
            >
              <div
                className={`flex gap-2 items-start ${
                  message.userId === userId ? "justify-end" : ""
                }`}
              >
                {message.payload}
              </div>
              <Link
                href={`/chats/${chatRoomId}/review`}
                className="underline font-bold"
              >
                후기보내기{" "}
              </Link>
            </div>
          ) : (
            <div
              key={message.id}
              className={`flex gap-2 items-start ${
                message.userId === userId ? "justify-end" : ""
              }`}
            >
              {message.userId === userId ? null : message.user.avatar !==
                null ? (
                <Image
                  width={28}
                  height={28}
                  alt={message.user.username}
                  src={message.user.avatar}
                  className="size-7 rounded-full"
                  unoptimized
                />
              ) : (
                <UserIcon className="size-7 rounded-full" />
              )}
              <div
                className={`flex gap-2  ${
                  message.userId === userId ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`${
                    message.userId === userId
                      ? "bg-orange-500"
                      : "bg-neutral-500"
                  } p-2.5 rounded-2xl`}
                >
                  {message.payload}
                </span>
                <span className={`text-xs p-1 flex items-end`}>
                  {formatToTimeAgo(message.created_at.toString())}
                </span>
              </div>
            </div>
          )
        )}
      </div>
      <form
        className="fixed bottom-0 py-5  px-5 inset-x-0 mx-auto max-w-screen-sm mt-5 bg-neutral-900 z-50"
        onSubmit={onSubmit}
      >
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-5">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300 " />
        </button>
      </form>
    </div>
  );
}
