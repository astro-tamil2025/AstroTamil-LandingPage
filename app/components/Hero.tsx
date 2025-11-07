"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../hooks/useLanguage";
import { getHeroTranslations } from "../i18n/hero";

type CoinCardProps = {
    label: string;
    imgSrc: string;
};

function CoinCard({ label, imgSrc }: CoinCardProps) {
    return (
        <div className="flex items-center gap-2 sm:gap-3 w-full">
            {/* Coin */}
            <div
                className="relative size-10 sm:size-12 md:size-14 rounded-full shrink-0"
                style={{
                    background:
                        "radial-gradient(60% 60% at 50% 40%, #FFF8D5 0%, #F6E37E 55%, #F0DF20 100%)",
                    boxShadow:
                        "inset 0 0 0 3px rgba(255,255,255,0.8), 0 8px 18px rgba(240, 223, 32, 0.35)",
                }}
            >
                <Image
                    src={imgSrc}
                    alt=""
                    width={64}
                    height={64}
                    className="absolute inset-0 m-auto size-7 sm:size-9 md:size-10 object-contain z-10"
                />
            </div>
            <p className="flex-1 min-w-0 text-[11px] sm:text-[13px] md:text-sm lg:text-base text-black leading-tight line-clamp-2 md:line-clamp-none md:overflow-visible md:whitespace-normal md:text-clip">{label}</p>
        </div>
    );
}

function Hero() {
    const router = useRouter();
    const lang = useLanguage();
    const t = getHeroTranslations(lang);
    
    return (
        <section id="home" className="relative min-h-[600px] sm:min-h-[700px] overflow-hidden scroll-mt-16">
            {/* Background: gradient fallback */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,#E5E7EB_0%,#F6E095_100%)]" />
            </div>

            {/* Decorative stars and ellipses per Figma clusters (top-left / top-right) */}
            <img src="/assets/hero-icons/Star 1.svg" alt="" className="pointer-events-none select-none absolute top-24 left-2 w-3 opacity-80 sm:top-6 sm:left-6 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Star 2.svg" alt="" className="pointer-events-none select-none absolute top-28 left-12 w-3 opacity-80 sm:top-14 sm:left-20 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Ellipse 2.svg" alt="" className="pointer-events-none select-none absolute top-32 left-4 w-4 opacity-80 sm:top-10 sm:left-10 sm:w-6 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 5.svg" alt="" className="pointer-events-none select-none absolute top-36 left-3 w-3 opacity-80 sm:top-20 sm:left-8 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 6.svg" alt="" className="pointer-events-none select-none absolute top-20 left-24 w-3 opacity-80 sm:top-7 sm:left-28 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />

            <img src="/assets/hero-icons/Star 3.svg" alt="" className="pointer-events-none select-none absolute top-24 right-2 w-3 opacity-80 sm:top-8 sm:right-10 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Star 4.svg" alt="" className="pointer-events-none select-none absolute top-32 right-6 w-3 opacity-80 sm:top-16 sm:right-24 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Star 5.svg" alt="" className="pointer-events-none select-none absolute top-28 right-16 w-3 opacity-80 sm:top-10 sm:right-32 sm:w-6 sm:opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]" />
            <img src="/assets/hero-icons/Ellipse 10.svg" alt="" className="pointer-events-none select-none absolute top-36 right-6 w-3 opacity-80 sm:top-12 sm:right-12 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 11.svg" alt="" className="pointer-events-none select-none absolute top-40 right-16 w-3 opacity-80 sm:top-24 sm:right-20 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />
            <img src="/assets/hero-icons/Ellipse 12.svg" alt="" className="pointer-events-none select-none absolute top-32 right-28 w-3 opacity-80 sm:top-16 sm:right-36 sm:w-4 sm:opacity-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.6)]" />

            {/* Content grid */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 pt-10 sm:pt-14 md:pt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 items-start md:items-center gap-6 md:gap-10">
                    {/* Left copy (headline + subtext + chatbot) */}
                    <div className="order-[0] md:order-[0] md:col-start-1 md:row-start-1">
                        <h1 className={`text-[#46443f] font-semibold leading-tight tracking-tight ${
                            lang === "ta" 
                                ? "text-[clamp(1.5rem,3.5vw,2.5rem)]" 
                                : "text-[clamp(2rem,4.5vw,3.5rem)]"
                        }`}>
                            <span className={`block ${lang === "ta" ? "" : "whitespace-nowrap"}`}>{t.headline1}</span>
                            <span className={`block ${lang === "ta" ? "" : "whitespace-nowrap"}`}>{t.headline2}</span>
                        </h1>
                        <p className="mt-3 text-[#555] text-base sm:text-lg">{t.subtext}</p>

                        {/* Chatbot card - desktop/tablet placement (hidden on mobile) */}
                        <div className="hidden md:block mt-4 w-full max-w-sm rounded-2xl border border-[#f0df20]/60 bg-[#fff8d5] p-4 shadow-[0_6px_20px_rgba(240,223,32,0.15)]">
                            <div className="flex items-start gap-3">
                                <div className="w-12 flex-none">
                                    <div className="h-12 w-12 rounded-full overflow-hidden">
                                        <Image src="/images/astrologer/guruji-krishnan.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-snug text-black">{t.chatbotGreeting}</p>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <button onClick={() => router.push(`/birth-chart?lang=${lang}`)} aria-label={t.birthChartAriaLabel} className="rounded-full bg-[#f0df20] px-3 py-1 text-xs text-black">{t.birthChart}</button>
                                        <button onClick={() => router.push(`/kundli?lang=${lang}`)} aria-label={t.kundliAriaLabel} className="rounded-full bg-[#f0df20] px-3 py-1 text-xs text-black">{t.kundli}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center deity image */}
                    <div className="flex flex-col items-center order-1 md:order-[0]">
                        <Image
                            src="/images/hero-images/vinayagar.png"
                            alt=""
                            width={320}
                            height={320}
                            className="w-[220px] sm:w-[280px] md:w-[320px] h-auto"
                            priority
                        />
                        <button onClick={() => router.push(`/chat?lang=${lang}`)} aria-label={t.startChatAriaLabel} className="mt-5 inline-flex items-center justify-center rounded-full bg-[#f0df20] px-6 py-2.5 text-sm sm:text-base font-semibold text-black shadow-[0_10px_22px_rgba(240,223,32,0.35)]">
                            {t.chatNow}
                        </button>
                        {/* Chatbot card - mobile placement (below button) */}
                        <div className="md:hidden mt-4 w-full max-w-sm rounded-2xl border border-[#f0df20]/60 bg-[#fff8d5] p-4 shadow-[0_6px_20px_rgba(240,223,32,0.15)]">
                            <div className="flex items-start gap-3">
                                <div className="w-12 flex-none">
                                    <div className="h-12 w-12 rounded-full overflow-hidden">
                                        <Image src="/images/astrologer/guruji-krishnan.png" alt="" width={48} height={48} className="h-full w-full object-cover" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-snug text-black">{t.chatbotGreeting}</p>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <button onClick={() => router.push(`/birth-chart?lang=${lang}`)} aria-label={t.birthChartAriaLabel} className="rounded-full bg-[#f0df20] px-3 py-1 text-xs text-black">{t.birthChart}</button>
                                        <button onClick={() => router.push(`/kundli?lang=${lang}`)} aria-label={t.kundliAriaLabel} className="rounded-full bg-[#f0df20] px-3 py-1 text-xs text-black">{t.kundli}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right illustration (desktop only) */}
                    <div className="hidden md:flex justify-end md:pr-4 lg:pr-8">
                        <Image
                            src="/images/hero-images/illustration.png"
                            alt=""
                            width={580}
                            height={420}
                            className="w-[420px] lg:w-[540px] xl:w-[580px] h-auto"
                        />
                    </div>
                </div>

                {/* Bottom coin cards */}
                <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl md:max-w-6xl pb-[max(1.5rem,calc(1.5rem+env(safe-area-inset-bottom)))] md:pb-0 pl-[max(1.25rem,calc(1.25rem+env(safe-area-inset-left)))] pr-[max(1.25rem,calc(1.25rem+env(safe-area-inset-right)))] md:pl-0 md:pr-0">
                    <div className="w-full rounded-[48px] border-2 border-[#f0df20] bg-white/90 px-4 py-2 sm:px-5 sm:py-2.5 min-w-0 justify-self-stretch md:px-5">
                        <CoinCard label={t.coin1} imgSrc="/images/hero-images/chat-with-astrologers.png" />
                    </div>
                    <div className="w-full rounded-[48px] border-2 border-[#f0df20] bg-white/90 px-4 py-2 sm:px-5 sm:py-2.5 min-w-0 justify-self-stretch md:px-5">
                        <CoinCard label={t.coin2} imgSrc="/images/hero-images/talk-to-astrologers.png" />
                    </div>
                    <div className="w-full rounded-[48px] border-2 border-[#f0df20] bg-white/90 px-4 py-2 sm:px-5 sm:py-2.5 min-w-0 justify-self-stretch md:px-5">
                        <CoinCard label={t.coin3} imgSrc="/images/hero-images/live-sessions.png" />
                    </div>
                    <div className="w-full rounded-[48px] border-2 border-[#f0df20] bg-white/90 px-4 py-2 sm:px-5 sm:py-2.5 min-w-0 justify-self-stretch md:px-5">
                        <CoinCard label={t.coin4} imgSrc="/images/hero-images/book-a-pooja.png" />
                    </div>
                </div>
            </div>

            {/* mid soft rings */}
            <img src="/assets/hero-icons/Ellipse 3.svg" alt="" className="pointer-events-none select-none absolute top-1/3 left-8 w-8 hidden sm:block drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]" />
            <img src="/assets/hero-icons/Ellipse 4.svg" alt="" className="pointer-events-none select-none absolute top-1/3 right-10 w-8 hidden sm:block drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]" />
            <img src="/assets/hero-icons/Ellipse 18.svg" alt="" className="pointer-events-none select-none absolute bottom-8 sm:bottom-16 right-24 w-7 hidden sm:block drop-shadow-[0_0_1px_rgba(255,255,255,0.5)]" />
        </section>
    );
}

export default Hero;

