"use client";

import { useEffect, useMemo, useState } from "react";

type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
  ts?: number;
};

export default function MessageBubble({ role, content, ts }: MessageBubbleProps) {
  const isUser = role === "user";
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const localTime = useMemo(() => {
    if (!ts) return "";
    try {
      const normalized = ts < 1_000_000_000_000 ? ts * 1000 : ts; // convert seconds -> ms if needed
      const s = new Date(normalized).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return s;
    } catch {
      return "";
    }
  }, [ts]);
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isUser ? "items-end" : "items-start"} flex gap-2`}>
        {!isUser && (
          <div className="mt-1 flex-none overflow-hidden rounded-full border-2 border-[#f0df20]/50 bg-white [aspect-ratio:1/1] h-8 w-8 sm:h-9 sm:w-9 shrink-0">
            <img src="/images/astrologer/guruji-krishnan.png" alt="Guruji Krishnan" className="block h-full w-full rounded-full object-cover" />
          </div>
        )}
        <div
          className={`${
            isUser
              ? "bg-white border border-[#f0df20]/50"
              : "bg-[#fff8d5] border border-[#f0df20]/60"
          } rounded-2xl px-3 py-2.5 sm:px-4 sm:py-2.5 text-[15px] sm:text-[14px] leading-[22px] sm:leading-[20px] text-black shadow-[0_4px_14px_rgba(0,0,0,0.06)] break-words`}
        >
          <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{content}</p>
          {ts ? (
            <span className="mt-1.5 block text-right text-[11px] sm:text-[10px] text-zinc-500" suppressHydrationWarning>
              {mounted ? localTime : ""}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}


