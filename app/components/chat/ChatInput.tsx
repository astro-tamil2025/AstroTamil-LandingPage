"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function ChatInput({ onSend, disabled, lang }: { onSend: (text: string) => void; disabled?: boolean; lang: "ta" | "en"; }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autosize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(144, el.scrollHeight) + "px";
  }, []);

  useEffect(() => {
    autosize();
  }, [value, autosize]);

  const handleSend = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }, [value, onSend, disabled]);

  return (
    <div className="flex items-end gap-2">
      <label className="sr-only" htmlFor="chat-input">{lang === "ta" ? "கேள்வி" : "Message"}</label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        className="min-h-[44px] max-h-[144px] flex-1 resize-none rounded-2xl border-2 border-[#f0df20] bg-white px-3 py-2 text-[15px] sm:text-[14px] text-black placeholder:text-black/60 focus:outline-none"
        placeholder={lang === "ta" ? "உங்கள் கேள்வியை எழுதுங்கள்..." : "Type your question..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows={1}
      />
      <button
        type="button"
        aria-label={lang === "ta" ? "கேளுங்கள்" : "Ask"}
        onClick={handleSend}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold text-black shadow-[0_10px_22px_rgba(240,223,32,0.35)] sm:px-5 ${disabled ? "bg-[#f0df20]/60 cursor-not-allowed" : "bg-[#f0df20]"}`}
      >
        {lang === "ta" ? "கேளுங்கள்" : "Ask"}
      </button>
    </div>
  );
}


