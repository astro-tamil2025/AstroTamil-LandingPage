type QuickActionsProps = {
  onPick: (text: string) => void;
  lang: "ta" | "en";
};

export default function QuickActions({ onPick, lang }: QuickActionsProps) {
  const items = lang === "ta"
    ? [
        "இன்றைய ராசி பலன்",
        "பிறந்த விவரங்கள்",
        "ராசி விளக்கப்படம்",
      ]
    : [
        "Daily Rasi Palan",
        "Birth details",
        "Rasi Chart",
      ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-2.5">
      {items.map((label) => (
        <button
          key={label}
          onClick={() => onPick(label)}
          className="whitespace-nowrap rounded-full border border-[#f0df20]/60 bg-[#fff8d5] px-3 py-1.5 text-[13px] sm:text-[12px] font-medium text-black hover:shadow-[0_6px_20px_rgba(240,223,32,0.15)] active:scale-95 transition-transform"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
