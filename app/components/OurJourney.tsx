import Image from "next/image";

export default function OurJourney() {
    return (
        <section className="relative overflow-hidden">
            {/* Background: reuse Hero gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,#E5E7EB_0%,#F6E095_100%)]" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
                {/* Heading from Figma context */}
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-[32px] sm:text-[36px] font-bold text-black">
                        Our Journey: Guiding You with Ancient Wisdom
                    </h2>
                </div>

                {/* Top row: two large rounded panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left Panel: Guruji */}
                    <div className="bg-white/90 rounded-[20px] p-6 sm:p-8 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                        <div className="flex items-start gap-6">
                            <div className="relative w-28 h-28 rounded-full bg-white ring-4 ring-[#f6e095] shrink-0 overflow-hidden">
                                <Image src="/images/astrologer/guruji-krishnan.png" alt="Guruji Krishnan" width={112} height={112} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[18px] sm:text-[20px] font-bold text-black mb-1">Meet Guruji Krishnan</p>
                                <p className="text-[14px] sm:text-[15px] text-black mb-3">"Astrology is the lamp that lights the path to life."</p>
                                <p className="text-[14px] leading-6 text-black">
                                    Founded to revive Tamil Vedic astrology with lineage and authenticity. With
                                    ethical guidance, we accompany your journey with compassionate counsel.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Philosophy */}
                    <div className="bg-white/90 rounded-[20px] p-6 sm:p-8 shadow-[0_10px_24px_rgba(0,0,0,0.06)]">
                        <p className="text-[18px] sm:text-[20px] font-bold text-black mb-4">Our Philosophy</p>
                        <div className="space-y-4">
                            {/* Authenticity */}
                            <div className="flex items-center gap-4 py-1">
                                <div className="w-8 h-8 rounded-full bg-[#ffd9b3] flex items-center justify-center shrink-0">
                                    <Image src="/images/astrologer/star.svg" alt="Authenticity" width={22} height={22} />
                                </div>
                                <p className="text-[15px] leading-normal text-black">
                                    <span className="font-semibold">Authenticity:</span> Rooted in ancient Tamil scriptures.
                                </p>
                            </div>
                            {/* Personalization */}
                            <div className="flex items-center gap-4 py-1">
                                <div className="w-8 h-8 rounded-full bg-[#ffd9b3] flex items-center justify-center shrink-0">
                                    <Image src="/images/astrologer/book.svg" alt="Personalization" width={22} height={22} />
                                </div>
                                <p className="text-[15px] leading-normal text-black">
                                    <span className="font-semibold">Personalization:</span> Tailored guidance for your unique journey.
                                </p>
                            </div>
                            {/* Trust */}
                            <div className="flex items-center gap-4 py-1">
                                <div className="w-8 h-8 rounded-full bg-[#ffd9b3] flex items-center justify-center shrink-0">
                                    <Image src="/images/astrologer/phone.svg" alt="Trust" width={22} height={22} />
                                </div>
                                <p className="text-[15px] leading-normal text-black">
                                    <span className="font-semibold">Trust:</span> Confidential, ethical guidance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: floating cards (no container bg) */}
                <div className="mt-10 sm:mt-12">
                    <div className="text-center mb-8">
                        <p className="text-[22px] sm:text-[26px] font-bold text-black">Meet Our Top-Rated Astrologers</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { img: "/images/astrologer/img.png", name: "Pandit Rajesh", role: "Vedic Astrology" },
                            { img: "/images/astrologer/img-1.png", name: "Smt. Priya", role: "Tarot Reading" },
                            { img: "/images/astrologer/img-2.png", name: "Dr. Suresh", role: "Numerology" },
                            { img: "/images/astrologer/img-3.png", name: "Guru Lakshmi", role: "Palmistry" },
                        ].map((a) => (
                            <div
                                key={a.name}
                                className="w-full max-w-[320px] sm:max-w-none mx-auto bg-white/95 backdrop-blur-sm rounded-[18px] p-5 sm:p-6 border border-black/5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-transform duration-200 will-change-transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 ring-4 ring-white shadow-md">
                                        <Image src={a.img} alt={a.name} fill sizes="(min-width: 640px) 112px, 96px" className="object-cover" />
                                    </div>
                                    <p className="text-[18px] sm:text-[19px] font-bold text-black">{a.name}</p>
                                    <p className="text-[14px] text-black">{a.role}</p>
                                    <div className="flex items-center gap-1 my-3" aria-label="rating 5 of 5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Image key={i} src="/images/astrologer/rating-star.svg" alt="star" width={18} height={18} className="w-[18px] h-[18px]" />
                                        ))}
                                    </div>
                                    <button className="inline-flex items-center justify-center rounded-[10px] bg-[#f0df20] px-6 py-2.5 text-[16px] font-medium text-black shadow-[0_6px_20px_rgba(240,223,32,0.25)]">
                                        Consult Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}


