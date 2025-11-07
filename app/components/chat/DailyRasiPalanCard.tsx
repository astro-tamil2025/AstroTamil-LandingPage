"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type ZodiacSign = "ARIES" | "TAURUS" | "GEMINI" | "CANCER" | "LEO" | "VIRGO" | "LIBRA" | "SCORPIO" | "SAGITTARIUS" | "CAPRICORN" | "AQUARIUS" | "PISCES";

const ZODIAC_SIGNS: { name: ZodiacSign; icon: string; label: { en: string; ta: string } }[] = [
  { name: "ARIES", icon: "/assets/zodiac-sign-icons/aries.svg", label: { en: "ARIES", ta: "மேஷம்" } },
  { name: "TAURUS", icon: "/assets/zodiac-sign-icons/taurus.svg", label: { en: "TAURUS", ta: "ரிஷபம்" } },
  { name: "GEMINI", icon: "/assets/zodiac-sign-icons/gemini.svg", label: { en: "GEMINI", ta: "மிதுனம்" } },
  { name: "CANCER", icon: "/assets/zodiac-sign-icons/cancer.svg", label: { en: "CANCER", ta: "கடகம்" } },
  { name: "LEO", icon: "/assets/zodiac-sign-icons/leo.svg", label: { en: "LEO", ta: "சிம்மம்" } },
  { name: "VIRGO", icon: "/assets/zodiac-sign-icons/virgo.svg", label: { en: "VIRGO", ta: "கன்னி" } },
  { name: "LIBRA", icon: "/assets/zodiac-sign-icons/libra.svg", label: { en: "LIBRA", ta: "துலாம்" } },
  { name: "SCORPIO", icon: "/assets/zodiac-sign-icons/scorpio.svg", label: { en: "SCORPIO", ta: "விருச்சிகம்" } },
  { name: "SAGITTARIUS", icon: "/assets/zodiac-sign-icons/sagittarius.svg", label: { en: "SAGITTARIUS", ta: "தனுசு" } },
  { name: "CAPRICORN", icon: "/assets/zodiac-sign-icons/capricorn.svg", label: { en: "CAPRICORN", ta: "மகரம்" } },
  { name: "AQUARIUS", icon: "/assets/zodiac-sign-icons/aquarius.svg", label: { en: "AQUARIUS", ta: "கும்பம்" } },
  { name: "PISCES", icon: "/assets/zodiac-sign-icons/pisces.svg", label: { en: "PISCES", ta: "மீனம்" } },
];

type Props = {
  onSubmit: (sign: ZodiacSign) => void;
  lang: "ta" | "en";
  loading?: boolean;
  result?: string | null;
  error?: string | null;
  sign?: string; // The sign that was used for the result
};

const translations = {
  en: {
    title: "DAILY HOROSCOPE",
    selectSign: "SELECT YOUR ZODIAC SIGN",
    getHoroscope: "GET HOROSCOPE",
    selectSignPrompt: "Select your sign and tap Get Horoscope.",
    loading: "Loading...",
    noPrediction: "No prediction available.",
  },
  ta: {
    title: "தினசரி ராசி பலன்",
    selectSign: "உங்கள் ராசி அடையாளத்தைத் தேர்ந்தெடுக்கவும்",
    getHoroscope: "ராசி பலனைப் பெறுங்கள்",
    selectSignPrompt: "உங்கள் அடையாளத்தைத் தேர்ந்தெடுத்து ராசி பலனைப் பெறுங்கள் என்பதைத் தட்டவும்.",
    loading: "ஏற்றுகிறது...",
    noPrediction: "முன்னறிவிப்பு கிடைக்கவில்லை.",
  },
};

export default function DailyRasiPalanCard({ onSubmit, lang, loading, result, error, sign: propSign }: Props) {
  const t = translations[lang];
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>("LEO");
  const [todayLabel, setTodayLabel] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  // Use propSign if available (from result), otherwise use selectedSign
  const displaySign = propSign ? (propSign.toUpperCase() as ZodiacSign) : selectedSign;

  useEffect(() => {
    setIsMounted(true);
    const locale = lang === "ta" ? "ta-IN" : "en-US";
    const label = new Date().toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setTodayLabel(label);
  }, [lang]);

  // If we have a result or error, show the forecast panel; otherwise show the selection interface
  const showResult = result || error;
  // Show forecast panel when loading, result exists, or error exists
  const showForecast = loading || showResult;

  return (
    <div className="w-full max-w-[32rem] space-y-4">
      {/* Zodiac Selection Grid - shown when not loading and no result */}
      {!showForecast && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-[16px] sm:text-[18px] font-bold text-[#555555] mb-4">{t.selectSign}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {ZODIAC_SIGNS.map((sign) => {
              const selected = selectedSign === sign.name;
              return (
                <button
                  key={sign.name}
                  onClick={() => setSelectedSign(sign.name)}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border transition-all px-3 py-3 sm:py-4 ${
                    selected
                      ? "bg-[#f0df20] border-black shadow-md"
                      : "bg-[#f2f6f9] border-transparent hover:bg-[#f3f6f9]"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/70 flex items-center justify-center bg-white">
                    <Image
                      src={sign.icon}
                      alt={sign.name}
                      width={32}
                      height={32}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>
                  <span className={`text-[12px] sm:text-[13px] ${selected ? "font-bold text-black" : "text-black"}`}>
                    {lang === "ta" ? sign.label.ta : sign.label.en}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-[#f0df20] text-black font-normal text-[13px] py-2 px-4 rounded-[20px] hover:bg-[#f0df20]/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              onClick={() => onSubmit(selectedSign)}
            >
              {loading ? t.loading : t.getHoroscope}
            </button>
          </div>
        </div>
      )}

      {/* Forecast Panel - shown when loading, result exists, or error exists */}
      {showForecast && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
          {/* Header row with selected sign */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center bg-white">
                <Image
                  src={ZODIAC_SIGNS.find(s => s.name === displaySign)?.icon || "/assets/zodiac-sign-icons/leo.svg"}
                  alt={displaySign}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-[16px] font-bold text-black">
                {lang === "ta" 
                  ? ZODIAC_SIGNS.find(s => s.name === displaySign)?.label.ta 
                  : ZODIAC_SIGNS.find(s => s.name === displaySign)?.label.en
                }
              </span>
            </div>
          </div>

          {/* Date separator */}
          {isMounted && todayLabel && (
            <div className="mb-6 relative">
              <div className="flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="h-[1px] flex-1 bg-[#555555]/10"></div>
                </div>
                <p className="relative text-[14px] sm:text-[16px] text-[#555555] whitespace-nowrap px-4 bg-white/80">
                  {todayLabel.toUpperCase()}
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="horoscope-scrollbar max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-2">
            {loading && (
              <p className="text-[13px] sm:text-[14px] leading-[17px] text-black font-normal">{t.loading}</p>
            )}
            {error && (
              <p className="text-[13px] sm:text-[14px] leading-[17px] text-red-600 font-normal">{error}</p>
            )}
            {result && !loading && (
              <p className="text-[13px] sm:text-[14px] leading-[17px] text-black font-normal whitespace-pre-line">
                {result || t.noPrediction}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
