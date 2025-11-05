"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type ZodiacSign = "ARIES" | "TAURUS" | "GEMINI" | "CANCER" | "LEO" | "VIRGO" | "LIBRA" | "SCORPIO" | "SAGITTARIUS" | "CAPRICORN" | "AQUARIUS" | "PISCES";
type ApiStatus = "idle" | "loading" | "success" | "error";

const ZODIAC_SIGNS: { name: ZodiacSign; icon: string }[] = [
    { name: "ARIES", icon: "/assets/zodiac-sign-icons/aries.svg" },
    { name: "TAURUS", icon: "/assets/zodiac-sign-icons/taurus.svg" },
    { name: "GEMINI", icon: "/assets/zodiac-sign-icons/gemini.svg" },
    { name: "CANCER", icon: "/assets/zodiac-sign-icons/cancer.svg" },
    { name: "LEO", icon: "/assets/zodiac-sign-icons/leo.svg" },
    { name: "VIRGO", icon: "/assets/zodiac-sign-icons/virgo.svg" },
    { name: "LIBRA", icon: "/assets/zodiac-sign-icons/libra.svg" },
    { name: "SCORPIO", icon: "/assets/zodiac-sign-icons/scorpio.svg" },
    { name: "SAGITTARIUS", icon: "/assets/zodiac-sign-icons/sagittarius.svg" },
    { name: "CAPRICORN", icon: "/assets/zodiac-sign-icons/capricorn.svg" },
    { name: "AQUARIUS", icon: "/assets/zodiac-sign-icons/aquarius.svg" },
    { name: "PISCES", icon: "/assets/zodiac-sign-icons/pisces.svg" },
];

type DailyApiResponse = {
    status: string;
    data?: {
        daily_prediction?: {
            prediction?: string;
        };
    };
    error?: string;
};

export default function DailyHoroscope() {
    const [selectedSign, setSelectedSign] = useState<ZodiacSign>("LEO");
    const [status, setStatus] = useState<ApiStatus>("idle");
    const [result, setResult] = useState<DailyApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [todayLabel, setTodayLabel] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
        const label = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        setTodayLabel(label);
    }, []);

    async function fetchHoroscope() {
        try {
            setStatus("loading");
            setError(null);
            setResult(null);
            const iso = new Date().toISOString(); // UTC with Z
            const params = new URLSearchParams({
                sign: selectedSign.toLowerCase(),
                datetime: iso,
            });
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const resp = await fetch(`/api/horoscope/daily?${params.toString()}`, {
                method: "GET",
                cache: "no-store",
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!resp.ok) {
                const errorData = await resp.json().catch(() => ({} as any));
                throw new Error((errorData as any)?.error || `Failed to fetch horoscope (${resp.status})`);
            }
            const data: DailyApiResponse = await resp.json();
            setResult(data);
            setStatus("success");
        } catch (e: any) {
            setError(e?.message || "Something went wrong");
            setStatus("error");
        }
    }

    return (
        <section className="relative min-h-[600px] sm:min-h-[700px] overflow-hidden">
            {/* Background: custom color for this section */}
            <div className="absolute inset-0 -z-10">
                {/* Mobile: Simple gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7E9A8] via-[#F7E9A8] to-[#FDFDF5] lg:hidden" />
                {/* Desktop: Solid yellow background (semicircle will overlay) */}
                <div className="absolute inset-0 bg-[#F7E9A8] hidden lg:block" />
            </div>

            {/* White semicircle divider - creates light area at bottom (desktop only) */}
            <div className="hidden lg:block absolute inset-0 -z-10 overflow-hidden">
                <svg
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-full"
                    viewBox="0 0 1728 800"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0,800 A720,650 0 0,1 1728,800 L1728,800 L0,800 Z"
                        fill="#FDFDF5"
                    />
                </svg>
            </div>

            {/* Decorative stars and ellipses at the top (same as hero section) */}
            <img src="/assets/hero-icons/Star 1.svg" alt="" className="pointer-events-none select-none absolute top-6 left-2 w-3 opacity-80 sm:top-6 sm:left-6 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Star 2.svg" alt="" className="pointer-events-none select-none absolute top-10 left-12 w-3 opacity-80 sm:top-14 sm:left-20 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Ellipse 2.svg" alt="" className="pointer-events-none select-none absolute top-14 left-4 w-4 opacity-80 sm:top-10 sm:left-10 sm:w-6 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 5.svg" alt="" className="pointer-events-none select-none absolute top-20 left-3 w-3 opacity-80 sm:top-20 sm:left-8 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 6.svg" alt="" className="pointer-events-none select-none absolute top-12 left-24 w-3 opacity-80 sm:top-7 sm:left-28 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />

            <img src="/assets/hero-icons/Star 3.svg" alt="" className="pointer-events-none select-none absolute top-6 right-2 w-3 opacity-80 sm:top-8 sm:right-10 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Star 4.svg" alt="" className="pointer-events-none select-none absolute top-14 right-6 w-3 opacity-80 sm:top-16 sm:right-24 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Star 5.svg" alt="" className="pointer-events-none select-none absolute top-10 right-16 w-3 opacity-80 sm:top-10 sm:right-32 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Ellipse 10.svg" alt="" className="pointer-events-none select-none absolute top-20 right-6 w-3 opacity-80 sm:top-12 sm:right-12 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 11.svg" alt="" className="pointer-events-none select-none absolute top-24 right-16 w-3 opacity-80 sm:top-24 sm:right-20 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 12.svg" alt="" className="pointer-events-none select-none absolute top-14 right-28 w-3 opacity-80 sm:top-16 sm:right-36 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />

            {/* Left decorative column will be inside the grid below so cards remain untouched */}

            {/* Content area */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-12 sm:pt-16 pb-16">
                {/* Header */}
                <div className="mb-8 sm:mb-12 text-center">
                    <h2 className="text-[28px] sm:text-[35px] font-bold text-[#555555] mb-2">DAILY HOROSCOPE</h2>
                    <p className="text-lg sm:text-[22px] text-[#555555]">Unlock Your Cosmic Forecast</p>
                </div>

                {/* Two-column layout: left images (decorative), right split top/bottom for cards */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
                    {/* LEFT: Decorative column (no absolute positioning to avoid overlap) */}
                    <div className="hidden lg:block">
                        <div className="lg:sticky top-24 h-[460px] xl:h-[500px] flex flex-col justify-between items-start">
                            <Image
                                src="/assets/daily-horoscope-icons/AquariusSign.svg"
                                alt="Aquarius"
                                width={130}
                                height={130}
                                className="w-[110px] xl:w-[120px] h-auto object-contain"
                            />
                            <Image
                                src="/assets/daily-horoscope-icons/TaurusSign.svg"
                                alt="Taurus"
                                width={160}
                                height={160}
                                className="w-[140px] xl:w-[150px] h-auto object-contain"
                            />
                            <Image
                                src="/assets/daily-horoscope-icons/PiscesSign.svg"
                                alt="Pisces"
                                width={130}
                                height={130}
                                className="w-[110px] xl:w-[120px] h-auto object-contain"
                            />
                            <Image
                                src="/assets/daily-horoscope-icons/LeoSign.svg"
                                alt="Leo"
                                width={140}
                                height={140}
                                className="w-[120px] xl:w-[130px] h-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* RIGHT: top (zodiac grid) + bottom (forecast) */}
                    <div className="flex flex-col gap-6 lg:gap-8">
                        {/* TOP: Zodiac grid (two rows) */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg">
                            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#555555] mb-4">SELECT YOUR ZODIAC SIGN</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {ZODIAC_SIGNS.map((sign) => {
                                    const selected = selectedSign === sign.name;
                                    return (
                                        <button
                                            key={sign.name}
                                            onClick={() => setSelectedSign(sign.name)}
                                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border transition-all px-3 py-3 sm:py-4 ${
                                                selected
                                                    ? "bg-[#f0df20] border-black shadow-md"
                                                    : "bg-[#f2f6f9] border-transparent hover:bg-[#f3f6f9]"
                                            }`}
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
                                                {sign.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* BOTTOM: Forecast panel */}
                        <div className="bg-white lg:bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg">
                            {/* Header row with selected sign and action */}
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center">
                                        <Image
                                            src={ZODIAC_SIGNS.find(s => s.name === selectedSign)?.icon || "/assets/zodiac-sign-icons/leo.svg"}
                                            alt={selectedSign}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 object-contain"
                                        />
                                    </div>
                                    <span className="text-[16px] font-bold text-black">{selectedSign}</span>
                                </div>
                                <button onClick={fetchHoroscope} className="bg-[#f0df20] text-black font-normal text-[13px] py-2 px-4 rounded-[20px] hover:bg-[#f0df20]/90 transition-colors shadow-md">
                                    GET HOROSCOPE
                                </button>
                            </div>

                            {/* Date separator */}
                            <div className="mb-6 relative">
                                <div className="flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="h-[1px] flex-1 bg-[#555555]/10"></div>
                                    </div>
                                    <p className="relative text-[14px] sm:text-[16px] text-[#555555] whitespace-nowrap px-4 bg-white/80">
                                        {isMounted && todayLabel ? todayLabel.toUpperCase() : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="horoscope-scrollbar max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-2">
                                {status === "idle" && (
                                    <p className="text-[13px] sm:text-[14px] leading-[17px] text-black font-normal">Select your sign and tap Get Horoscope.</p>
                                )}
                                {status === "loading" && (
                                    <p className="text-[13px] sm:text-[14px] leading-[17px] text-black font-normal">Loading...</p>
                                )}
                                {status === "error" && (
                                    <p className="text-[13px] sm:text-[14px] leading-[17px] text-red-600 font-normal">{error}</p>
                                )}
                                {status === "success" && (
                                    <p className="text-[13px] sm:text-[14px] leading-[17px] text-black font-normal whitespace-pre-line">
                                        {result?.data?.daily_prediction?.prediction || "No prediction available."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
