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
    <div className="-mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 no-scrollbar">
      {items.map((label) => (
        <button
          key={label}
          onClick={() => onPick(label)}
          className="whitespace-nowrap rounded-full border border-[#f0df20]/60 bg-[#fff8d5] px-3 py-1 text-[12px] text-black hover:shadow-[0_6px_20px_rgba(240,223,32,0.15)]"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
