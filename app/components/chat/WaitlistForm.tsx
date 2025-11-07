"use client";

import { useState } from "react";

type WaitlistFormProps = {
  lang: "ta" | "en";
  onSubmit: (email: string) => Promise<void> | void;
};

export default function WaitlistForm({ lang, onSubmit }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) {
      return;
    }
    
    const trimmed = email.trim();
    
    if (!trimmed) {
      setError(lang === "ta" ? "மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError(lang === "ta" ? "செல்லுபடியான மின்னஞ்சல் முகவரியை உள்ளிடவும்" : "Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);
    
    try {
      await Promise.resolve(onSubmit(trimmed));
      setSubmitted(true);
    } catch (err) {
      // Handle async errors
      const errorMessage = err instanceof Error 
        ? err.message 
        : (lang === "ta" 
          ? "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்." 
          : "Something went wrong. Please try again.");
      setError(errorMessage);
      setSubmitted(false);
      console.error("Waitlist submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-green-500 bg-green-50 p-6 text-center">
        <div className="mb-2">
          <svg
            className="mx-auto h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-[16px] font-semibold text-green-800">
          {lang === "ta" 
            ? "நன்றி! உங்கள் மின்னஞ்சல் சேர்க்கப்பட்டது." 
            : "Thank you! Your email has been added."}
        </p>
        <p className="mt-2 text-[14px] text-green-700">
          {lang === "ta"
            ? "விரைவில் உங்களுக்கு தகவல் அனுப்பப்படும்."
            : "We'll be in touch soon!"}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-[#f0df20] bg-gradient-to-br from-[#fff3a6] to-[#fff8d5] p-6 shadow-[0_8px_24px_rgba(240,223,32,0.2)]">
      <div className="mb-4 text-center">
        <h3 className="text-[20px] font-bold text-black mb-2">
          {lang === "ta" 
            ? "எங்கள் பயன்பாட்டில் மேலும் ஆர்வமா?" 
            : "Interested in our application?"}
        </h3>
        <p className="text-[15px] text-black/80 mb-1">
          {lang === "ta"
            ? "எங்கள் காத்திருப்புப் பட்டியலில் சேர்ந்து பிரத்தியேக சலுகைகளைப் பெறுங்கள்!"
            : "Join our waitlist and get exclusive perks!"}
        </p>
        <p className="text-[14px] text-black/70">
          {lang === "ta"
            ? "முன்கூட்டியே சேர்வதற்கான சிறப்பு வாய்ப்பு"
            : "Pre-join exclusive opportunity"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="waitlist-email" className="sr-only">
            {lang === "ta" ? "மின்னஞ்சல்" : "Email"}
          </label>
          <input
            id="waitlist-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder={lang === "ta" ? "உங்கள் மின்னஞ்சல் முகவரி" : "Enter your email address"}
            className="w-full rounded-lg border-2 border-[#f0df20] bg-white px-4 py-2.5 text-[15px] text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#f0df20] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "error-message" : undefined}
          />
          {error && (
            <p 
              id="error-message"
              role="alert"
              aria-live="assertive"
              className="mt-1 text-[13px] text-red-600"
            >
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#f0df20] px-4 py-2.5 text-[15px] font-semibold text-black shadow-[0_4px_12px_rgba(240,223,32,0.3)] hover:bg-[#f6d851] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f0df20]"
        >
          {loading 
            ? (lang === "ta" ? "சேர்க்கிறது..." : "Joining...")
            : (lang === "ta" ? "காத்திருப்புப் பட்டியலில் சேர்" : "Join Waitlist")
          }
        </button>
      </form>
    </div>
  );
}

