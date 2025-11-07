"use client";
import Image from "next/image";
import { useLanguage } from "../hooks/useLanguage";

const translations = {
    en: {
        title: "CONTACT US",
        subtitle: "Get in touch for cosmic insights or support.",
        description1: "Have questions about your celestial path? Want your personalized reading?",
        description2: "Fill out the form or contact us directly. Our team here is ready to guide!",
        yourName: "Your Name",
        yourEmail: "Your Email",
        yourMessage: "Your Message",
        sendMessage: "SEND MESSAGE",
        supportEmail: "Support Email:",
        phone: "Phone:",
        tagline: "Your trusted platform for authentic astrological guidance and spiritual wisdom.",
        services: "Services",
        chatAstrologer: "Chat with Astrologer",
        callAstrologer: "Call Astrologer",
        freeKundli: "Free Kundli",
        kundliMatching: "Kundli Matching",
        support: "Support",
        helpCenter: "Help Center",
        contactUs: "Contact Us",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        followUs: "Follow Us",
    },
    ta: {
        title: "எங்களைத் தொடர்பு கொள்ளுங்கள்",
        subtitle: "வானியல் நுண்ணறிவு அல்லது ஆதரவுக்காக எங்களைத் தொடர்பு கொள்ளுங்கள்.",
        description1: "உங்கள் வானியல் பாதையைப் பற்றி கேள்விகள் உள்ளனவா? உங்கள் தனிப்பயனாக்கப்பட்ட வாசிப்பை விரும்புகிறீர்களா?",
        description2: "படிவத்தை நிரப்பவும் அல்லது எங்களை நேரடியாகத் தொடர்பு கொள்ளுங்கள். எங்கள் குழு இங்கே வழிநடத்த தயாராக உள்ளது!",
        yourName: "உங்கள் பெயர்",
        yourEmail: "உங்கள் மின்னஞ்சல்",
        yourMessage: "உங்கள் செய்தி",
        sendMessage: "செய்தியை அனுப்பவும்",
        supportEmail: "ஆதரவு மின்னஞ்சல்:",
        phone: "தொலைபேசி:",
        tagline: "நம்பகமான ஜோதிட வழிகாட்டுதல் மற்றும் ஆன்மீக ஞானத்திற்கான உங்கள் நம்பகமான தளம்.",
        services: "சேவைகள்",
        chatAstrologer: "ஜோதிடருடன் அரட்டை",
        callAstrologer: "ஜோதிடரை அழைக்கவும்",
        freeKundli: "இலவச குண்டலி",
        kundliMatching: "குண்டலி பொருத்தம்",
        support: "ஆதரவு",
        helpCenter: "உதவி மையம்",
        contactUs: "எங்களைத் தொடர்பு கொள்ளுங்கள்",
        privacyPolicy: "தனியுரிமைக் கொள்கை",
        termsOfService: "சேவை விதிமுறைகள்",
        followUs: "எங்களைப் பின்தொடரவும்",
    },
};

function ContactFooter() {
    const lang = useLanguage();
    const t = translations[lang as keyof typeof translations] ?? translations.en;
    
    return (
        <section id="contact" className="relative overflow-hidden scroll-mt-16">
            {/* Background replicated from DailyHoroscope */}
            <div className="absolute inset-0 -z-10">
                {/* Mobile gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#F7E9A8] via-[#F7E9A8] to-[#FDFDF5] lg:hidden" />
                {/* Desktop solid with semicircle overlay */}
                <div className="absolute inset-0 bg-[#F7E9A8] hidden lg:block" />
            </div>
            {/* White semicircle divider (desktop) */}
            <div className="hidden lg:block absolute inset-0 -z-10 overflow-hidden">
                <svg
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-full"
                    viewBox="0 0 1728 800"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0,800 A720,650 0 0,1 1728,800 L1728,800 L0,800 Z" fill="#FDFDF5" />
                </svg>
            </div>

            {/* Decorative stars (reuse hero assets lightly) */}
            <img src="/assets/hero-icons/Star 1.svg" alt="" className="pointer-events-none select-none absolute top-6 left-2 w-3 opacity-80 sm:top-6 sm:left-6 sm:w-6 sm:opacity-100" />
            <img src="/assets/hero-icons/Star 3.svg" alt="" className="pointer-events-none select-none absolute top-6 right-2 w-3 opacity-80 sm:top-8 sm:right-10 sm:w-6 sm:opacity-100" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-12 sm:pt-16 pb-0">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-[28px] sm:text-[35px] font-bold text-[#555555]">{t.title}</h2>
                    <p className="text-[14px] sm:text-[16px] text-[#555555] mt-2">{t.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    {/* Left copy */}
                    <div className="hidden md:block relative">
                        <div className="absolute -inset-4 bg-white/70 rounded-[20px] shadow-[0_8px_24px_rgba(0,0,0,0.06)]" aria-hidden="true"></div>
                        <p className="relative text-[#7e796c] text-[16px] leading-7 max-w-md p-2">
                            {t.description1}
                            <br />
                            <br />
                            {t.description2}
                        </p>
                    </div>

                    {/* Contact Card */}
                    <div className="lg:col-span-2 flex justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-[24px] shadow-[0_10px_32px_rgba(0,0,0,0.10)] border-2 border-[#555555]/50 px-6 sm:px-10 py-6 sm:py-9 max-w-[640px] w-full min-h-[420px]">
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()} aria-label="Contact form">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="sr-only">{t.yourName}</span>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder={t.yourName}
                                            className="w-full rounded-[18px] border-2 border-[#f0df20] bg-white px-4 py-3 text-[14px] text-black placeholder:text-black/70 focus:outline-none"
                                            aria-label={t.yourName}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="sr-only">{t.yourEmail}</span>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={t.yourEmail}
                                            className="w-full rounded-[18px] border-2 border-[#f0df20] bg-white px-4 py-3 text-[14px] text-black placeholder:text-black/70 focus:outline-none"
                                            aria-label={t.yourEmail}
                                        />
                                    </label>
                                </div>
                                <label className="block">
                                    <span className="sr-only">{t.yourMessage}</span>
                                    <textarea
                                        name="message"
                                        placeholder={t.yourMessage}
                                        className="w-full min-h-[140px] rounded-[18px] border-2 border-[#f0df20] bg-white px-4 py-3 text-[14px] text-black placeholder:text-black/70 focus:outline-none"
                                        aria-label={t.yourMessage}
                                    />
                                </label>
                                <div className="flex items-center justify-center sm:justify-start">
                                    <button type="submit" className="inline-flex items-center justify-center rounded-[18px] bg-[#f0df20] px-7 py-2.5 text-[14px] font-medium text-black shadow-sm hover:bg-[#f0df20]/90">
                                        {t.sendMessage}
                                    </button>
                                </div>
                                <div className="text-center sm:text-left text-[13px] text-[#555555]">
                                    <p>
                                        {t.supportEmail} <span className="font-medium">support@cosmicforecast.com</span>
                                        <br />
                                        {t.phone} <span className="font-medium">+1 (555) 123-667</span>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-10 bg-black text-white">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2">
                            <Image src="/images/header/logo.png" alt="Nakshatra Talks logo" width={120} height={30} className="h-6 w-auto" />
                            <span className="text-[22px] font-normal tracking-tight">Nakshatra Talks</span>
                        </div>
                        <p className="mt-4 text-gray-400 text-[14px] leading-6 max-w-xs">
                            {t.tagline}
                        </p>
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold mb-4">{t.services}</p>
                        <ul className="space-y-2 text-gray-400 text-[14px]">
                            <li>{t.chatAstrologer}</li>
                            <li>{t.callAstrologer}</li>
                            <li>{t.freeKundli}</li>
                            <li>{t.kundliMatching}</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold mb-4">{t.support}</p>
                        <ul className="space-y-2 text-gray-400 text-[14px]">
                            <li>{t.helpCenter}</li>
                            <li>{t.contactUs}</li>
                            <li>{t.privacyPolicy}</li>
                            <li>{t.termsOfService}</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold mb-4">{t.followUs}</p>
                        <div className="flex items-center gap-5">
                            {/* Open-source icon SVGs */}
                            <a aria-label="Facebook" href="#" className="text-white/90 hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06C2 17.08 5.66 21.2 10.44 22v-6.99H7.9v-2.95h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.95h-2.34V22C18.34 21.2 22 17.08 22 12.06Z"/></svg>
                            </a>
                            <a aria-label="Twitter" href="#" className="text-white/90 hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.633 7.997c.013.18.013.36.013.54 0 5.49-4.181 11.82-11.82 11.82-2.35 0-4.531-.69-6.363-1.87.33.04.65.05.99.05 1.95 0 3.75-.66 5.18-1.77a4.17 4.17 0 0 1-3.89-2.89c.26.04.52.07.79.07.38 0 .76-.05 1.11-.15a4.16 4.16 0 0 1-3.34-4.08v-.05c.55.31 1.19.5 1.86.52a4.15 4.15 0 0 1-1.86-3.46c0-.77.21-1.49.57-2.11a11.83 11.83 0 0 0 8.58 4.36c-.06-.31-.09-.64-.09-.97a4.16 4.16 0 0 1 7.2-2.84 8.3 8.3 0 0 0 2.64-1.01 4.17 4.17 0 0 1-1.83 2.3 8.32 8.32 0 0 0 2.39-.65 8.93 8.93 0 0 1-2.09 2.16Z"/></svg>
                            </a>
                            <a aria-label="Instagram" href="#" className="text-white/90 hover:text-white">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 14.8 2.8 2.8 0 0 0 12 9.2Zm5.5-.9a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/></svg>
                            </a>
                            <a aria-label="YouTube" href="#" className="text-white/90 hover:text-white">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2s-.23-1.63-.95-2.35c-.91-.95-1.92-.96-2.38-1.01C16.74 2.5 12 2.5 12 2.5h-.01s-4.74 0-8.16.34c-.46.05-1.47.06-2.38 1.01C.73 4.57.5 6.2.5 6.2S.27 8.1.27 9.99v1.98c0 1.9.23 3.79.23 3.79s.23 1.63.95 2.35c.91.95 2.1.92 2.63 1.03 1.91.18 8.02.24 8.02.24s4.75-.01 8.17-.35c.46-.05 1.47-.06 2.38-1.01.72-.72.95-2.35.95-2.35s.23-1.9.23-3.79V9.99c0-1.89-.23-3.79-.23-3.79ZM9.75 14.5v-6l6 3-6 3Z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </section>
    );
}

export default ContactFooter;

