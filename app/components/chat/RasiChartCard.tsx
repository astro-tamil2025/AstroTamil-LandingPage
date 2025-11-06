"use client";

import { useState } from "react";

type Props = {
  onSubmit: (v: { datetime: string; coordinates: string; ayanamsa: 1 | 3 | 5; la?: "en" | "ta" | "ml" | "hi" }) => void;
  lang: "ta" | "en";
};

type Step = 1 | 2 | 3;

export default function RasiChartCard({ onSubmit, lang }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [city, setCity] = useState<string>("");
  const [dateOnly, setDateOnly] = useState<string>("");
  const [timeOnly, setTimeOnly] = useState<string>("");
  const [hasTime, setHasTime] = useState<boolean | null>(null);
  const [coordinates, setCoordinates] = useState<string>("");
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string>("");
  // Always Lahiri (1), hidden from UI per requirement
  const ayanamsa: 1 = 1;
  // Use language from header
  const la: "en" | "ta" = lang;

  function toIsoWithTZ(dateStr: string, timeStr?: string) {
    // If only date provided, use default time 12:00:00
    const time = timeStr || "12:00:00";
    const datetimeLocal = `${dateStr}T${time}`;
    
    const d = new Date(datetimeLocal);
    if (isNaN(d.getTime())) return "";
    
    const tzOffsetMin = -d.getTimezoneOffset();
    const sign = tzOffsetMin >= 0 ? "+" : "-";
    const pad = (n: number) => String(Math.trunc(Math.abs(n))).padStart(2, "0");
    const hh = pad(Math.trunc(tzOffsetMin / 60));
    const mm = pad(tzOffsetMin % 60);
    
    // Ensure time has seconds (HH:MM:SS) as required by Prokerala API
    const timePart = time.length === 5 ? `${time}:00` : time;
    return `${dateStr}T${timePart}${sign}${hh}:${mm}`;
  }

  function handleDateNext() {
    if (!dateOnly) return;
    setStep(2);
  }

  function handleTimeChoice(choice: boolean) {
    setHasTime(choice);
    if (!choice) {
      // Skip time, proceed to city
      setStep(3);
    }
  }

  function handleTimeNext() {
    if (!timeOnly) return;
    setStep(3);
  }

  async function handleCityNext() {
    const trimmed = city.trim();
    if (!trimmed) return;
    
    setGeocoding(true);
    setGeocodeError("");
    
    try {
      const params = new URLSearchParams({ city: trimmed });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const resp = await fetch(`/api/utils/geocode?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({} as any));
        throw new Error((errData as any)?.error || `Geocode failed (${resp.status})`);
      }
      
      const data = await resp.json() as { lat: string; lon: string; display_name?: string };
      if (!data?.lat || !data?.lon) {
        throw new Error(lang === "ta" ? "ஆயத்தொலைவுகள் கிடைக்கவில்லை" : "Coordinates not found");
      }
      
      setCoordinates(`${data.lat},${data.lon}`);
      setGeocoding(false);
      handleFinalSubmit();
    } catch (e: any) {
      const msg = e?.name === "AbortError" 
        ? (lang === "ta" ? "நேரம் முடிந்தது" : "Timeout")
        : e?.message || (lang === "ta" ? "பிழை" : "Error");
      setGeocodeError(msg);
      setGeocoding(false);
    }
  }

  function handleFinalSubmit() {
    if (!dateOnly || !coordinates) return;
    const datetime = toIsoWithTZ(dateOnly, hasTime ? timeOnly : undefined);
    onSubmit({ datetime, coordinates, ayanamsa, la });
  }

  const step1Disabled = geocoding || !dateOnly;
  const step2Disabled = geocoding || (hasTime === true && !timeOnly);
  const step3Disabled = geocoding || !city.trim();

  return (
    <div className="rounded-xl border-2 border-[#f0df20] bg-gradient-to-br from-[#fff3a6] to-[#fff8d5] p-4 shadow-[0_8px_24px_rgba(240,223,32,0.2)] w-[min(100%,28rem)] text-black">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-bold text-base">{lang === "ta" ? "ராசி விளக்கப்படம்" : "RASI Chart"}</div>
        <div className="flex gap-1 text-xs opacity-70 bg-white/60 px-2 py-1 rounded-full">
          <span className={step === 1 ? "font-bold text-[#f0df20]" : ""}>1</span>
          <span>/</span>
          <span className={step === 2 ? "font-bold text-[#f0df20]" : ""}>2</span>
          <span>/</span>
          <span className={step === 3 ? "font-bold text-[#f0df20]" : ""}>3</span>
        </div>
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm">
            <span className="block text-[12px] opacity-80">
              {lang === "ta" ? "பிறந்த தேதி" : "Birth Date"}
            </span>
            <input
              type="date"
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
              value={dateOnly}
              onChange={(e) => setDateOnly(e.target.value)}
              disabled={geocoding}
            />
          </label>
          <div className="pt-1">
            <button
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
              disabled={step1Disabled}
              onClick={handleDateNext}
            >
              {lang === "ta" ? "அடுத்து" : "Next"}
            </button>
          </div>
        </div>
      ) : step === 2 ? (
        <div className="grid grid-cols-1 gap-2">
          {hasTime === null ? (
            <>
              <div className="text-sm">
                <span className="block text-[12px] opacity-80 mb-2">
                  {lang === "ta" ? "நீங்கள் சரியான நேரத்தை அறிவீர்களா?" : "Do you know the exact time?"}
                </span>
                <div className="flex gap-2">
                  <button
                    className="flex-1 rounded-md border border-black px-3 py-1.5 text-sm text-black disabled:opacity-50"
                    disabled={geocoding}
                    onClick={() => handleTimeChoice(false)}
                  >
                    {lang === "ta" ? "இல்லை" : "No"}
                  </button>
                  <button
                    className="flex-1 rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
                    disabled={geocoding}
                    onClick={() => handleTimeChoice(true)}
                  >
                    {lang === "ta" ? "ஆம்" : "Yes"}
                  </button>
                </div>
              </div>
              <div className="pt-1">
                <button
                  className="rounded-md border border-black px-3 py-1.5 text-sm text-black disabled:opacity-50"
                  disabled={geocoding}
                  onClick={() => {
                    setStep(1);
                    setHasTime(null);
                    setTimeOnly("");
                  }}
                >
                  {lang === "ta" ? "பின்" : "Back"}
                </button>
              </div>
            </>
          ) : hasTime ? (
            <>
              <label className="text-sm">
                <span className="block text-[12px] opacity-80">
                  {lang === "ta" ? "பிறந்த நேரம்" : "Birth Time"}
                </span>
                <input
                  type="time"
                  className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
                  value={timeOnly}
                  onChange={(e) => setTimeOnly(e.target.value)}
                  disabled={geocoding}
                />
              </label>
              <div className="pt-1 flex gap-2">
                <button
                  className="rounded-md border border-black px-3 py-1.5 text-sm text-black disabled:opacity-50"
                  disabled={geocoding}
                  onClick={() => {
                    setHasTime(null);
                    setTimeOnly("");
                  }}
                >
                  {lang === "ta" ? "பின்" : "Back"}
                </button>
                <button
                  className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
                  disabled={step2Disabled}
                  onClick={handleTimeNext}
                >
                  {lang === "ta" ? "அடுத்து" : "Next"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <label className="text-sm">
            <span className="block text-[12px] opacity-80">
              {lang === "ta" ? "நகரம்" : "City"}
            </span>
            <input
              type="text"
              placeholder={lang === "ta" ? "எ.கா: சென்னை" : "e.g., Chennai"}
              className="mt-1 w-full rounded-md border px-2 py-1 text-sm"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setGeocodeError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !step3Disabled) {
                  void handleCityNext();
                }
              }}
              disabled={geocoding}
            />
          </label>
          {geocodeError && (
            <div className="text-xs text-red-600">{geocodeError}</div>
          )}
          <div className="pt-1 flex gap-2">
            <button
              className="rounded-md border border-black px-3 py-1.5 text-sm text-black disabled:opacity-50"
              disabled={geocoding}
              onClick={() => {
                setStep(2);
                setCity("");
                setGeocodeError("");
              }}
            >
              {lang === "ta" ? "பின்" : "Back"}
            </button>
            <button
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
              disabled={step3Disabled}
              onClick={handleCityNext}
            >
              {geocoding 
                ? (lang === "ta" ? "தேடுகிறது..." : "Searching...")
                : (lang === "ta" ? "விளக்கப்படத்தைப் பெறு" : "Get Chart")
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

