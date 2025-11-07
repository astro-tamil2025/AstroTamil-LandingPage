"use client";

type Props = {
  onYes: () => void;
  onNo: () => void;
  lang: "ta" | "en";
  loading?: boolean;
};

export default function ChartPrompt({ onYes, onNo, lang, loading }: Props) {
  return (
    <div className="rounded-xl border border-[#f0df20] bg-[#fff3a6] p-3 sm:p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)] w-full max-w-[28rem] text-black">
      <div className="text-sm mb-3">
        <span className="block text-[12px] sm:text-[13px] opacity-80 mb-2.5">
          {lang === "ta" ? "உங்கள் ராசி விளக்கப்படத்தைப் பெற விரும்புகிறீர்களா?" : "Would you like to get your RASI chart?"}
        </span>
        <div className="flex gap-2">
          <button
            className="flex-1 rounded-md border border-black px-3 py-2 sm:py-1.5 text-sm text-black disabled:opacity-50 active:scale-95 transition-transform"
            disabled={loading}
            onClick={onNo}
          >
            {lang === "ta" ? "இல்லை" : "No"}
          </button>
          <button
            className="flex-1 rounded-md bg-black px-3 py-2 sm:py-1.5 text-sm text-white disabled:opacity-50 active:scale-95 transition-transform"
            disabled={loading}
            onClick={onYes}
          >
            {loading 
              ? (lang === "ta" ? "பெறுகிறது..." : "Loading...")
              : (lang === "ta" ? "ஆம்" : "Yes")
            }
          </button>
        </div>
      </div>
    </div>
  );
}

