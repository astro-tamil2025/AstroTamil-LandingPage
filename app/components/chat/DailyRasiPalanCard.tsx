"use client";

import Image from "next/image";
import { useState } from "react";

type ZodiacSign = "ARIES" | "TAURUS" | "GEMINI" | "CANCER" | "LEO" | "VIRGO" | "LIBRA" | "SCORPIO" | "SAGITTARIUS" | "CAPRICORN" | "AQUARIUS" | "PISCES";

const ZODIAC_SIGNS: { name: ZodiacSign; icon: string; label: { en: string; ta: string } }[] = [
  { name: "ARIES", icon: "/assets/zodiac-sign-icons/aries.svg", label: { en: "Aries", ta: "மேஷம்" } },
  { name: "TAURUS", icon: "/assets/zodiac-sign-icons/taurus.svg", label: { en: "Taurus", ta: "ரிஷபம்" } },
  { name: "GEMINI", icon: "/assets/zodiac-sign-icons/gemini.svg", label: { en: "Gemini", ta: "மிதுனம்" } },
  { name: "CANCER", icon: "/assets/zodiac-sign-icons/cancer.svg", label: { en: "Cancer", ta: "கடகம்" } },
  { name: "LEO", icon: "/assets/zodiac-sign-icons/leo.svg", label: { en: "Leo", ta: "சிம்மம்" } },
  { name: "VIRGO", icon: "/assets/zodiac-sign-icons/virgo.svg", label: { en: "Virgo", ta: "கன்னி" } },
  { name: "LIBRA", icon: "/assets/zodiac-sign-icons/libra.svg", label: { en: "Libra", ta: "துலாம்" } },
  { name: "SCORPIO", icon: "/assets/zodiac-sign-icons/scorpio.svg", label: { en: "Scorpio", ta: "விருச்சிகம்" } },
  { name: "SAGITTARIUS", icon: "/assets/zodiac-sign-icons/sagittarius.svg", label: { en: "Sagittarius", ta: "தனுசு" } },
  { name: "CAPRICORN", icon: "/assets/zodiac-sign-icons/capricorn.svg", label: { en: "Capricorn", ta: "மகரம்" } },
  { name: "AQUARIUS", icon: "/assets/zodiac-sign-icons/aquarius.svg", label: { en: "Aquarius", ta: "கும்பம்" } },
  { name: "PISCES", icon: "/assets/zodiac-sign-icons/pisces.svg", label: { en: "Pisces", ta: "மீனம்" } },
];

type Props = {
  onSubmit: (sign: ZodiacSign) => void;
  lang: "ta" | "en";
  loading?: boolean;
  result?: string | null;
  error?: string | null;
};

export default function DailyRasiPalanCard({ onSubmit, lang, loading, result, error }: Props) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>("LEO");

  return (
    <div className="rounded-xl border-2 border-[#f0df20] bg-gradient-to-br from-[#fff3a6] to-[#fff8d5] p-4 shadow-[0_8px_24px_rgba(240,223,32,0.2)] w-[min(100%,28rem)] text-black">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-bold text-base">{lang === "ta" ? "இன்றைய ராசி பலன்" : "Daily Rasi Palan"}</div>
      </div>

      {!result ? (
        <>
          <div className="mb-4">
            <div className="text-[12px] opacity-80 mb-3">
              {lang === "ta" ? "உங்கள் ராசியைத் தேர்ந்தெடுக்கவும்" : "Select your zodiac sign"}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ZODIAC_SIGNS.map((sign) => {
                const selected = selectedSign === sign.name;
                return (
                  <button
                    key={sign.name}
                    onClick={() => setSelectedSign(sign.name)}
                    className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 transition-all p-2 ${
                      selected
                        ? "bg-[#f0df20] border-black shadow-md scale-105"
                        : "bg-white/80 border-transparent hover:bg-[#fff8d5] hover:border-[#f0df20]/50"
                    }`}
                    disabled={loading}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-black/70 flex items-center justify-center bg-white shadow-sm">
                      <Image
                        src={sign.icon}
                        alt={sign.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-semibold">{lang === "ta" ? sign.label.ta : sign.label.en}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pt-1">
            <button
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 w-full shadow-md hover:shadow-lg transition-shadow"
              disabled={loading}
              onClick={() => onSubmit(selectedSign)}
            >
              {loading 
                ? (lang === "ta" ? "பெறுகிறது..." : "Loading...")
                : (lang === "ta" ? "பலனைப் பெறு" : "Get Horoscope")
              }
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-black/10">
            <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-sm">
              <Image
                src={ZODIAC_SIGNS.find(s => s.name === selectedSign)?.icon || "/assets/zodiac-sign-icons/leo.svg"}
                alt={selectedSign}
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="text-sm font-bold">
              {lang === "ta" 
                ? ZODIAC_SIGNS.find(s => s.name === selectedSign)?.label.ta 
                : ZODIAC_SIGNS.find(s => s.name === selectedSign)?.label.en
              }
            </span>
          </div>
          {error ? (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{error}</div>
          ) : (
            <div className="text-xs leading-relaxed whitespace-pre-line max-h-[300px] overflow-y-auto bg-white/50 p-3 rounded-lg">
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

