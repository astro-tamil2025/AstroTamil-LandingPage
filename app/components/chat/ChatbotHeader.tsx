"use client";

import ChatTimer from "./ChatTimer";

type ChatbotHeaderProps = {
  timerSeconds: number | null;
};

export default function ChatbotHeader({ timerSeconds }: ChatbotHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0df20]/40 bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3">
      <h2 className="text-[16px] sm:text-[18px] font-bold text-black">Astrobot</h2>
      {timerSeconds !== null && timerSeconds > 0 && (
        <ChatTimer seconds={timerSeconds} />
      )}
    </div>
  );
}

