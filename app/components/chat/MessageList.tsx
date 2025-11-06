"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import BirthDetailsCard from "./BirthDetailsCard";
import TypingIndicator from "./TypingIndicator";
import ChartPrompt from "./ChartPrompt";
import ChartDisplay from "./ChartDisplay";
import DailyRasiPalanCard from "./DailyRasiPalanCard";
import RasiChartCard from "./RasiChartCard";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
  ts?: number;
  ui?: "birthCard" | "chartPrompt" | "chart" | "dailyRasiPalan" | "rasiChartCard";
  chartSvg?: string;
  birthData?: { datetime: string; coordinates: string; ayanamsa: 1 | 3 | 5; la?: "en" | "ta" | "ml" | "hi" };
  dailyRasiData?: { sign: string; result?: string; error?: string; loading?: boolean };
};

export default function MessageList({ 
  messages, 
  onBirthSubmit, 
  onChartYes,
  onChartNo,
  onDailyRasiSubmit,
  onRasiChartSubmit,
  lang 
}: { 
  messages: Message[]; 
  onBirthSubmit?: (args: { datetime: string; coordinates: string; ayanamsa: 1 | 3 | 5; la?: "en" | "ta" | "ml" | "hi"; messageId: string; }) => void; 
  onChartYes?: (messageId: string) => void;
  onChartNo?: (messageId: string) => void;
  onDailyRasiSubmit?: (args: { sign: string; messageId: string }) => void;
  onRasiChartSubmit?: (args: { datetime: string; coordinates: string; ayanamsa: 1 | 3 | 5; la?: "en" | "ta" | "ml" | "hi"; messageId: string; }) => void;
  lang: "ta" | "en" 
}) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {messages.map((m) => (
          <div key={m.id}>
            {m.typing ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#f0df20]/60 bg-[#fff8d5] px-3 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
                  <TypingIndicator />
                </div>
              </div>
            ) : m.ui === "birthCard" ? (
              <div className="flex justify-start">
                <BirthDetailsCard
                  onSubmit={(v) => onBirthSubmit?.({ ...v, messageId: m.id })}
                  lang={lang}
                />
              </div>
            ) : m.ui === "chartPrompt" ? (
              <div className="flex justify-start">
                <ChartPrompt
                  onYes={() => onChartYes?.(m.id)}
                  onNo={() => onChartNo?.(m.id)}
                  lang={lang}
                />
              </div>
            ) : m.ui === "chart" && m.chartSvg ? (
              <div className="flex justify-start">
                <ChartDisplay svg={m.chartSvg} />
              </div>
            ) : m.ui === "dailyRasiPalan" ? (
              <div className="flex justify-start">
                <DailyRasiPalanCard
                  onSubmit={(sign) => onDailyRasiSubmit?.({ sign, messageId: m.id })}
                  lang={lang}
                  loading={m.dailyRasiData?.loading}
                  result={m.dailyRasiData?.result || null}
                  error={m.dailyRasiData?.error || null}
                />
              </div>
            ) : m.ui === "rasiChartCard" ? (
              <div className="flex justify-start">
                <RasiChartCard
                  onSubmit={(v) => onRasiChartSubmit?.({ ...v, messageId: m.id })}
                  lang={lang}
                />
              </div>
            ) : (
              <MessageBubble role={m.role} content={m.content} ts={m.ts} />
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}


