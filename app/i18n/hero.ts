import type { Language } from "../hooks/useLanguage";

export type HeroTranslations = {
    headline1: string;
    headline2: string;
    subtext: string;
    chatbotGreeting: string;
    birthChart: string;
    kundli: string;
    chatNow: string;
    coin1: string;
    coin2: string;
    coin3: string;
    coin4: string;
    birthChartAriaLabel: string;
    kundliAriaLabel: string;
    startChatAriaLabel: string;
};

export const heroTranslations: Record<Language, HeroTranslations> = {
    en: {
        headline1: "Connect with",
        headline2: "Ancient Wisdom",
        subtext: "Trusted Astrologers & Instant Solutions",
        chatbotGreeting: "Hi I'm AstroBot! How can I help you today?",
        birthChart: "Birth Chart",
        kundli: "Kundli",
        chatNow: "CHAT NOW",
        coin1: "Chat with Astrologer",
        coin2: "Talk to Astrologer",
        coin3: "Live sessions",
        coin4: "Book A Pooja",
        birthChartAriaLabel: "Get birth chart reading",
        kundliAriaLabel: "Get kundli reading",
        startChatAriaLabel: "Start chat with astrologer",
    },
    ta: {
        headline1: "பழங்கால",
        headline2: "ஞானத்துடன் இணைக்கவும்",
        subtext: "நம்பகமான ஜோதிடர்கள் & உடனடி தீர்வுகள்",
        chatbotGreeting: "வணக்கம்! நான் AstroBot! இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        birthChart: "பிறப்பு விளக்கப்படம்",
        kundli: "குண்டலி",
        chatNow: "இப்போது அரட்டை",
        coin1: "ஜோதிடருடன் அரட்டை",
        coin2: "ஜோதிடருடன் பேசுங்கள்",
        coin3: "நேரடி அமர்வுகள்",
        coin4: "பூஜை பதிவு செய்யுங்கள்",
        birthChartAriaLabel: "பிறப்பு விளக்கப்பட வாசிப்பைப் பெறுங்கள்",
        kundliAriaLabel: "குண்டலி வாசிப்பைப் பெறுங்கள்",
        startChatAriaLabel: "ஜோதிடருடன் அரட்டையைத் தொடங்கவும்",
    },
};

/**
 * Get Hero translations for a given language with type-safe fallback
 * @param lang - The language code ('en' | 'ta')
 * @returns The translations object for the specified language, or English as fallback
 */
export function getHeroTranslations(lang: Language): HeroTranslations {
    return heroTranslations[lang] ?? heroTranslations.en;
}

