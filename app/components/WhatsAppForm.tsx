"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

const SERVICES = [
  "LIFE HOROSCOPE BRIEFING AUDIO CLIP",
  "KIDS LIFE HOROSCOPE BRIEFING AUDIO CLIP",
  "BABY NAME BASED ON NUMEROLOGY + SUYA JATHAGAM REPORT",
  "LIFE HOROSCOPE FAMILY COMBO PACK",
  "RASI & LAGNAM BASED ACCURATE PERSONALIZED PREDICTION FOR 2025 BRIEFING VOICE CLIP",
  "DETAILED HOROSCOPE REPORT + GEMSTONE SUGGESTION + ASK 3 QUESTIONS VOICE NOTE CLIP",
  "FULL DETAILED HOROSCOPE REPORT + GEMSTONE SUGGESTION + ASK ONE QUESTION",
  "ASK 1 QUESTION RELATED TO BUSINESS & CAREER",
  "FULL DETAILED HOROSCOPE REPORT + LUCKY NUMBER & COLOR SUGGESTION + ASK ONE QUESTION",
  "YEARLY HOROSCOPE 2025",
  "PALM READING VOICE NOTE CLIP FOR 1 SPECIFIC QUESTION",
  "ACCURATE PERSONALIZED PREDICTION FOR 2025 BRIEFING VOICE CLIP",
  "RELATIONSHIP COMPATIBILITY VOICE CLIP",
  "VOICE CLIP FOR MARRIAGE MATCHING COMPATIBILITY",
  "MARRIAGE HOROSCOPE RECORDED VOICE CLIP",
  "COUPLE CAREER COMPATIBILITY",
  "LIFE HOROSCOPE + VARSHAPHALA (NEXT 10 YEARS FORECAST)",
  "SUYA JATHAGAM REPORT FAMILY COMBO PACK",
  "PERSONALIZED MONTHLY HOROSCOPE 2025 FOR 6 MONTHS",
  "PERSONALIZED MONTHLY HOROSCOPE 2025 FOR 12 MONTHS",
  "RAHU KETU TRANSIT REPORT 2025-2026",
  "DETAILED HOROSCOPE REPORT WITH RAHU KETU TRANSIT PREDICTIONS RECORDED VOICE CLIP + ASK 1 QUESTION",
  "COMBO OF LIFE HOROSCOPE + YEARLY HOROSCOPE 2025",
  "COMBO OF 2025 PERSONALIZED PREDICTION & PERSONALIZED SATURN TRNASIT PREDICTION 2025-2027",
  "SATURN TRANSIT PREDICTIONS 2025-2027",
  "TRIPLE TRANSIT PREDICTIONS 2025",
  "YEARLY HOROSCOPE 2025 + ASK 1 QUESTION",
  "ONE PAGE LIFE HOROSCOPE REPORT",
];

// Placeholder for WhatsApp number - replace with actual number later
const WHATSAPP_NUMBER: string = ""; // Format: 911234567890 (country code + number, no + or spaces)

interface WhatsAppFormProps {
  onClose: () => void;
}

export default function WhatsAppForm({ onClose }: WhatsAppFormProps) {
  const [name, setName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [errors, setErrors] = useState<{ name?: string; service?: string }>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const newErrors: { name?: string; service?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!selectedService) {
      newErrors.service = "Please select a service";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format message
    const message = `Hello! I'm ${name.trim()}. I'm interested in: ${selectedService}`;
    const encodedMessage = encodeURIComponent(message);

    // Construct WhatsApp URL
    // If number is not set, just open WhatsApp without a number
    if (!WHATSAPP_NUMBER) {
      // Open WhatsApp with pre-filled message (will prompt user to select contact)
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } else {
      // Open WhatsApp with specific number
      const phoneNumber = WHATSAPP_NUMBER.replace(/[^0-9]/g, ""); // Remove any non-digits
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    }

    // Close form after redirect
    onClose();
  };

  return (
    <div className="absolute bottom-full right-0 mb-3 w-[85vw] max-w-xs sm:w-80 bg-white dark:bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col max-h-[75vh] animate-slide-up" style={{ colorScheme: 'light' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 sm:p-3 border-b border-gray-200">
        <h2 className="text-sm sm:text-base font-bold text-black dark:text-black uppercase">
          Nakshatra Talks Form
        </h2>
      </div>

      {/* Logo */}
      <div className="flex justify-center py-2.5 sm:py-3 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <Image 
            src="/images/header/logo.png" 
            alt="Nakshatra Talks logo" 
            width={80} 
            height={20} 
            className="h-4 w-auto" 
          />
          <span className="text-sm font-normal tracking-tight text-black dark:text-black">Nakshatra Talks</span>
        </div>
      </div>

      {/* Form Content - Scrollable (only the form scrolls, not services) */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
        {/* Name Field */}
        <div className="mb-3 pt-3">
          <label htmlFor="name" className="block text-xs font-semibold text-black dark:text-black mb-1.5">
            <span className="text-red-600">*</span> Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent text-xs text-black dark:text-black bg-white dark:bg-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Services Section - No scroll, just list */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-black dark:text-black mb-2">
            <span className="text-red-600">*</span> LIFE HOROSCOPE SERVICES
          </label>
          <div className="space-y-1.5">
            {SERVICES.map((service, index) => (
              <label
                key={index}
                className="flex items-start gap-2 p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="service"
                  value={service}
                  checked={selectedService === service}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    if (errors.service) setErrors((prev) => ({ ...prev, service: undefined }));
                  }}
                  className="mt-0.5 h-3 w-3 text-[#25D366] focus:ring-[#25D366] cursor-pointer flex-shrink-0"
                />
                <span className="text-[10px] sm:text-xs text-gray-900 dark:text-gray-900 flex-1 leading-snug">{service}</span>
              </label>
            ))}
          </div>
          {errors.service && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-600">{errors.service}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#25D366] text-white dark:text-white font-semibold py-2 rounded-md hover:bg-[#20BA5A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-1 text-xs mb-2"
        >
          Submit on WhatsApp
        </button>
      </form>
    </div>
  );
}

