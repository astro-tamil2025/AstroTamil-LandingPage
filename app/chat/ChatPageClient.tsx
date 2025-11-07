"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatShell from "../components/chat/ChatShell";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import QuickActions from "../components/chat/QuickActions";
import TransitWidget from "../components/chat/TransitWidget";
import ChatbotHeader from "../components/chat/ChatbotHeader";
import WaitlistForm from "../components/chat/WaitlistForm";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  typing?: boolean;
  ts?: number;
  ui?: "birthCard" | "chartPrompt" | "chart" | "dailyRasiPalan" | "rasiChartCard";
  chartSvg?: string;
  birthData?: { datetime: string; coordinates: string; ayanamsa: 1 | 3 | 5; la?: "en" | "ta" | "ml" | "hi" };
  dailyRasiData?: { sign: string; result?: string; error?: string; loading?: boolean };
};

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getWelcome(lng: "ta" | "en") {
  return lng === "ta"
    ? "Vanakkam! நான் AstroBot. உங்கள் ராசி, நக்ஷத்திரம் அல்லது இன்று செய்ய வேண்டிய முக்கிய முடிவுகள் பற்றி கேட்டுக்கொள்ளலாம்."
    : "Hello! I'm AstroBot. Ask me about your rasi, nakshatra, or today's important decisions.";
}

// Constants
const TRIAL_DURATION_MS = 60000; // 60 seconds

// Helper function to get trial storage key
function getTrialStorageKey(ip: string | null): string {
  return ip ? `chat_trial_${ip}` : "chat_trial_fallback";
}

export default function ChatPageClient() {
  const searchParams = useSearchParams();
  const initialLang = (searchParams.get("lang") as "ta" | "en") || "en";
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcome = getWelcome(initialLang);
    return [{ id: generateId(), role: "assistant", content: welcome, ts: Date.now() }];
  });
  const [isSending, setIsSending] = useState(false);
  const [lang, setLang] = useState<"ta" | "en">(initialLang);
  const unmountedRef = useRef(false);
  const activeAbortRef = useRef<AbortController | null>(null);
  const processedIntentRef = useRef<string | null>(null);
  
  // Timer and access control state
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [userIp, setUserIp] = useState<string | null>(null);
  const [hasUsedTrial, setHasUsedTrial] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedTimerRef = useRef(false);

  // Check if we're in development mode - set after mount to ensure window is available
  const [isDevelopment, setIsDevelopment] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDev = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('localhost');
      setIsDevelopment(isDev);
    }
  }, []);

  // In development mode, always reset trial and timer states
  useEffect(() => {
    if (isDevelopment) {
      setTimerExpired(false);
      setHasUsedTrial(false);
      setShowWaitlist(false);
      // Reset timer if it's expired - use ref to avoid dependency on timerSeconds
      const currentTimerSeconds = timerSeconds;
      if (currentTimerSeconds === null || currentTimerSeconds <= 0) {
        setTimerSeconds(60);
        hasStartedTimerRef.current = false;
      }
    }
  }, [isDevelopment]);

  // Get user IP and check if they've already used their trial
  useEffect(() => {
    const fetchIpAndCheckTrial = async () => {
      // In development mode, skip localStorage checks and reset timer
      if (isDevelopment) {
        // Clear any existing trial data in dev mode
        if (typeof window !== 'undefined') {
          try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
              try {
                if (key.startsWith('chat_trial_')) {
                  localStorage.removeItem(key);
                }
              } catch (e) {
                // Silently ignore errors when removing individual keys
              }
            });
          } catch (e) {
            // Silently ignore errors when accessing localStorage keys
          }
        }
        return;
      }

      try {
        const resp = await fetch("/api/utils/ip");
        if (resp.ok) {
          const data = await resp.json();
          const ip = data.ip;
          setUserIp(ip);
          
          // Check localStorage for this IP
          const storageKey = getTrialStorageKey(ip);
          try {
            const trialData = localStorage.getItem(storageKey);
            
            if (trialData) {
              try {
                const parsed = JSON.parse(trialData);
                const now = Date.now();
                const elapsed = now - parsed.startTime;
                const remaining = Math.max(0, TRIAL_DURATION_MS - elapsed);
                
                if (parsed.expired || remaining <= 0) {
                  // Trial already expired
                  setHasUsedTrial(true);
                  setTimerExpired(true);
                  setShowWaitlist(true);
                } else {
                  // Resume timer
                  setTimerSeconds(Math.floor(remaining / 1000));
                  hasStartedTimerRef.current = true;
                }
              } catch (parseError) {
                // JSON.parse failed - corrupted data, fall back to fallback key
                console.error("Failed to parse trial data:", parseError);
                const fallbackKey = getTrialStorageKey(null);
                try {
                  const fallbackData = localStorage.getItem(fallbackKey);
                  if (fallbackData) {
                    try {
                      const parsed = JSON.parse(fallbackData);
                      const now = Date.now();
                      const elapsed = now - parsed.startTime;
                      const remaining = Math.max(0, TRIAL_DURATION_MS - elapsed);
                      if (remaining <= 0) {
                        setHasUsedTrial(true);
                        setTimerExpired(true);
                        setShowWaitlist(true);
                      } else {
                        setTimerSeconds(Math.floor(remaining / 1000));
                        hasStartedTimerRef.current = true;
                      }
                    } catch (fallbackParseError) {
                      // Silently ignore fallback parse errors
                    }
                  }
                } catch (fallbackError) {
                  // Silently ignore fallback localStorage errors
                }
              }
            }
          } catch (storageError) {
            // localStorage.getItem failed - fall back to fallback key
            const fallbackKey = getTrialStorageKey(null);
            try {
              const fallbackData = localStorage.getItem(fallbackKey);
              if (fallbackData) {
                try {
                  const parsed = JSON.parse(fallbackData);
                  const now = Date.now();
                  const elapsed = now - parsed.startTime;
                  const remaining = Math.max(0, TRIAL_DURATION_MS - elapsed);
                  if (remaining <= 0) {
                    setHasUsedTrial(true);
                    setTimerExpired(true);
                    setShowWaitlist(true);
                  } else {
                    setTimerSeconds(Math.floor(remaining / 1000));
                    hasStartedTimerRef.current = true;
                  }
                } catch (fallbackParseError) {
                  // Silently ignore fallback parse errors
                }
              }
            } catch (fallbackError) {
              // Silently ignore fallback localStorage errors
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch IP:", e);
        // Fallback: use a default key if IP fetch fails
        const fallbackKey = getTrialStorageKey(null);
        try {
          const trialData = localStorage.getItem(fallbackKey);
          if (trialData) {
            try {
              const parsed = JSON.parse(trialData);
              const now = Date.now();
              const elapsed = now - parsed.startTime;
              const remaining = Math.max(0, TRIAL_DURATION_MS - elapsed);
              if (remaining <= 0) {
                setHasUsedTrial(true);
                setTimerExpired(true);
                setShowWaitlist(true);
              } else {
                setTimerSeconds(Math.floor(remaining / 1000));
                hasStartedTimerRef.current = true;
              }
            } catch (parseError) {
              // Silently ignore parse errors in fallback
            }
          }
        } catch (storageError) {
          // Silently ignore localStorage errors in fallback
        }
      }
    };
    
    void fetchIpAndCheckTrial();
    
    return () => {
      // Only set unmounted on actual unmount, not on dependency changes
      // We'll handle cleanup separately
      if (activeAbortRef.current) {
        activeAbortRef.current.abort();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isDevelopment]);

  // Set unmounted only on actual component unmount
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  useEffect(() => {
    const spLang = (searchParams.get("lang") as "ta" | "en") || "en";
    setLang(spLang);
    // Update initial assistant welcome message to the selected language
    setMessages((m) => {
      if (!m.length) return m;
      const updated = [...m];
      const first = updated[0];
      if (first && first.role === "assistant") {
        updated[0] = { ...first, content: getWelcome(spLang) };
      }
      return updated;
    });
  }, [searchParams]);

  // Start timer when first message is sent
  const startTimer = useCallback(() => {
    if (hasStartedTimerRef.current || timerExpired || hasUsedTrial) return;
    
    hasStartedTimerRef.current = true;
    setTimerSeconds(60);
    
    // Save to localStorage only in production
    if (!isDevelopment && typeof window !== 'undefined') {
      try {
        const storageKey = getTrialStorageKey(userIp);
        const payload = JSON.stringify({
          startTime: Date.now(),
          ip: userIp || "unknown"
        });
        localStorage.setItem(storageKey, payload);
      } catch (e) {
        // Silently ignore storage errors (e.g., private browsing, quota exceeded)
        // Timer will still start even if storage fails
      }
    }
  }, [userIp, timerExpired, hasUsedTrial, isDevelopment]);

  // Handle timer expiration
  const handleTimerExpire = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // In development mode, reset timer instead of showing waitlist
    if (isDevelopment) {
      setTimerSeconds(60);
      hasStartedTimerRef.current = false;
      setTimerExpired(false);
      setShowWaitlist(false);
      setHasUsedTrial(false);
      return;
    }

    // Production mode: show waitlist
    setTimerExpired(true);
    setTimerSeconds(0);
    setShowWaitlist(true);
    
    // Mark trial as used in localStorage
    if (userIp && typeof window !== 'undefined') {
      try {
        const storageKey = getTrialStorageKey(userIp);
        const trialData = localStorage.getItem(storageKey);
        if (trialData) {
          try {
            const parsed = JSON.parse(trialData);
            localStorage.setItem(storageKey, JSON.stringify({
              ...parsed,
              expired: true,
              expiredAt: Date.now()
            }));
          } catch (parseError) {
            console.error("Failed to parse trial data on expiration:", parseError);
            // Don't throw - allow function to continue
          }
        }
      } catch (storageError) {
        console.error("Failed to update localStorage on expiration:", storageError);
        // Don't throw - allow function to continue so timer waitlist flow is not broken
      }
    }
  }, [userIp, isDevelopment]);

  // Timer countdown effect
  useEffect(() => {
    // In development mode, allow timer to continue even if expired state is set
    const shouldStop = !isDevelopment && (timerSeconds === null || timerSeconds <= 0 || timerExpired);
    if (shouldStop) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }
    
    // Clear any existing interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev === null || prev <= 1) {
          handleTimerExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerSeconds, timerExpired, handleTimerExpire, isDevelopment]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    // In development, ignore timer expiration and trial restrictions
    const shouldBlock = !isDevelopment && (timerExpired || hasUsedTrial);
    if (!trimmed || shouldBlock) {
      return;
    }
    
    // Prevent sending if already sending
    if (isSending) {
      return;
    }
    
    setIsSending(true);

    try {
      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        ts: Date.now(),
      };

      if (!unmountedRef.current) {
        setMessages((m) => {
          const updated = [...m, userMsg];
          // Start timer on first user message
          if (m.filter(msg => msg.role === "user").length === 0) {
            startTimer();
          }
          return updated;
        });
      }

      // Daily RASI Palan: show interactive card
      const isDailyRasiTrigger = ["daily rasi palan", "இன்றைய ராசி பலன்", "rasi palan", "ராசி பலன்"].some((k) => trimmed.toLowerCase().includes(k));
      if (isDailyRasiTrigger) {
        if (!unmountedRef.current) {
          setMessages((m) => [
            ...m,
            { id: generateId(), role: "assistant", content: "", ui: "dailyRasiPalan", ts: Date.now() },
          ]);
        }
        return;
      }

      // Birth details: show interactive card
      const isBirthTrigger = ["birth details", "பிறந்த விவரங்கள்"].some((k) => trimmed.toLowerCase().includes(k));
      if (isBirthTrigger) {
        if (!unmountedRef.current) {
          setMessages((m) => [
            ...m,
            { id: generateId(), role: "assistant", content: "", ui: "birthCard", ts: Date.now() },
          ]);
        }
        return;
      }

      // RASI Chart: show interactive card
      const isRasiChartTrigger = ["rasi chart", "ராசி விளக்கப்படம்"].some((k) => trimmed.toLowerCase().includes(k));
      if (isRasiChartTrigger) {
        if (!unmountedRef.current) {
          setMessages((m) => [
            ...m,
            { id: generateId(), role: "assistant", content: "", ui: "rasiChartCard", ts: Date.now() },
          ]);
        }
        return;
      }

      // Client-side quick intent filter to avoid non-astrology calls
      const intents = [
        /\b(astrology|horoscope|zodiac|nakshatra|rasi|raasi|kundli|birth|planet|graha|transit|muhur(t|th)a|compatibility|dosha|ayanamsa)\b/i,
        /(ஜோதிடம்|இன்றைய பலன்|ஜாதகம்|நக்ஷத்திரம்|ராசி|சந்திர|சூர்ய|கிரக|சஞ்சாரம்|முஹூர்த்தம்|இணக்கம்|தோஷ)/i,
      ];
      const isAstrology = intents.some((re) => re.test(trimmed));
      if (!isAstrology) {
        if (!unmountedRef.current) {
          setMessages((m) => [
            ...m,
            { id: generateId(), role: "assistant", content: lang === "ta" ? "நான் ஜோதிடம் தொடர்பான கேள்விகளுக்கு மட்டும் பதிலளிக்கிறேன்." : "I only answer astrology-related questions.", ts: Date.now() },
          ]);
        }
        return;
      }

      // For generic response via AI, show typing now
      if (!unmountedRef.current) {
        setMessages((m) => [
          ...m,
          { id: "typing", role: "assistant", content: "", typing: true },
        ]);
      }

      const aborter = new AbortController();
      activeAbortRef.current = aborter;
      try {
        const controller = new AbortController();
        activeAbortRef.current = controller;
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const resp = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            lang,
            messages: [
              { role: "system", content: lang === "ta" ? "நீங்கள் AstroBot. கேள்விக்கு சுருக்கமாக பதில் அளிக்கவும்." : "You are AstroBot. Reply briefly." },
              { role: "user", content: trimmed },
            ],
          }),
          cache: "no-store",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({} as any));
          throw new Error((errData as any)?.error || `AI failed (${resp.status})`);
        }
        const data = (await resp.json()) as { content: string };

        if (!unmountedRef.current) {
          setMessages((m) => [
            ...m.filter((x) => x.id !== "typing"),
            { id: generateId(), role: "assistant", content: data?.content || "", ts: Date.now() },
          ]);
        }
      } catch (e) {
        // Remove typing on error/cancel
        if (!unmountedRef.current) {
          setMessages((m) => m.filter((x) => x.id !== "typing"));
          setMessages((m) => [
            ...m,
            { id: generateId(), role: "assistant", content: lang === "ta" ? "AI பதில் பெற முடியவில்லை." : "Failed to get AI response.", ts: Date.now() },
          ]);
        }
      } finally {
        if (activeAbortRef.current === aborter) {
          activeAbortRef.current = null;
        }
      }
    } finally {
      // Always reset isSending, regardless of early returns
      if (!unmountedRef.current) {
        setIsSending(false);
      }
    }
  }, [isSending, lang, timerExpired, hasUsedTrial, isDevelopment, startTimer]);

  const onQuickPick = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage]
  );

  useEffect(() => {
    const intentParam = searchParams.get("intent");
    if (!intentParam || processedIntentRef.current === intentParam) {
      return;
    }

    processedIntentRef.current = intentParam;

    let phrase: string | null = null;
    switch (intentParam) {
      case "birth-details":
        phrase = lang === "ta" ? "பிறந்த விவரங்கள்" : "Birth details";
        break;
      case "kundli":
      case "rasi-chart":
        phrase = lang === "ta" ? "ராசி விளக்கப்படம்" : "Rasi Chart";
        break;
      case "daily-rasi":
        phrase = lang === "ta" ? "இன்றைய ராசி பலன்" : "Daily Rasi Palan";
        break;
      default:
        phrase = null;
    }

    if (phrase) {
      void sendMessage(phrase);
    }
  }, [searchParams, lang, sendMessage]);

  const handleWaitlistSubmit = useCallback((email: string) => {
    // TODO: Wire up with backend later
    console.log("Waitlist submission:", email);
    // For now, just log it
  }, []);

  return (
    <ChatShell backgroundParticles>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4 lg:grid-cols-[1fr_320px] lg:gap-8 lg:px-8 lg:py-8">
        <section
          aria-label="Conversation"
          className="flex h-[calc(100dvh-5rem)] sm:h-[calc(100dvh-6rem)] lg:h-[calc(100dvh-9.5rem)] flex-col rounded-2xl border border-[#f0df20]/50 bg-white/90 p-0 shadow-[0_12px_28px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:col-span-1"
        >
          <ChatbotHeader 
            timerSeconds={timerSeconds}
          />
          
          {showWaitlist ? (
            <div className="flex-1 overflow-y-auto px-4 py-6 flex items-center justify-center">
              <div className="w-full max-w-md">
                <WaitlistForm lang={lang} onSubmit={handleWaitlistSubmit} />
              </div>
            </div>
          ) : (
            <>
              <MessageList
            messages={messages}
            lang={lang}
            onBirthSubmit={async ({ datetime, coordinates, ayanamsa, la, messageId }) => {
              // Keep the card, add a new typing indicator message
              const typingId = generateId();
              setMessages((m) => [
                ...m,
                { id: typingId, role: "assistant", content: "", typing: true, ts: Date.now() },
              ]);
              try {
                const params = new URLSearchParams({
                  ayanamsa: String(ayanamsa),
                  coordinates,
                  datetime,
                  la: la || lang, // Always pass language - use la from card or fallback to current lang
                });
                const controller = new AbortController();
                activeAbortRef.current = controller;
                const timeoutId = setTimeout(() => controller.abort(), 20000);
                const resp = await fetch(`/api/astrology/birth-details?${params.toString()}`, {
                  method: "GET",
                  cache: "no-store",
                  signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!resp.ok) {
                  const errData = await resp.json().catch(() => ({} as any));
                  throw new Error((errData as any)?.error || `Failed (${resp.status})`);
                }
                const data = await resp.json();
                const n = data?.data?.nakshatra;
                const cr = data?.data?.chandra_rasi;
                const sr = data?.data?.soorya_rasi;
                const z = data?.data?.zodiac;
                const add = data?.data?.additional_info;
                const lines = [
                  n ? `${lang === "ta" ? "நக்ஷத்திரம்" : "Nakshatra"}: ${n.name}${n.pada ? ` (pada ${n.pada})` : ""}` : null,
                  cr ? `${lang === "ta" ? "சந்திர ராசி" : "Chandra rasi"}: ${cr.name}` : null,
                  sr ? `${lang === "ta" ? "சூர்ய ராசி" : "Soorya rasi"}: ${sr.name}` : null,
                  z ? `${lang === "ta" ? "சயன ராசி" : "Zodiac"}: ${z.name}` : null,
                  add?.deity ? `${lang === "ta" ? "தெய்வம்" : "Deity"}: ${add.deity}` : null,
                  add?.ganam ? `${lang === "ta" ? "கணம்" : "Gana"}: ${add.ganam}` : null,
                  add?.animal_sign ? `${lang === "ta" ? "மிருக யோனி" : "Animal sign"}: ${add.animal_sign}` : null,
                  add?.color ? `${lang === "ta" ? "நிறம்" : "Color"}: ${add.color}` : null,
                  add?.syllables ? `${lang === "ta" ? "அக்ஷரங்கள்" : "Syllables"}: ${add.syllables}` : null,
                ].filter(Boolean);
                const resultText = (lang === "ta" ? "பிறந்த விவரங்கள்:\n" : "Birth details:\n") + lines.join("\n");
                // Replace typing indicator with result
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === typingId
                      ? { 
                          id: typingId, 
                          role: "assistant", 
                          content: resultText, 
                          ts: Date.now(),
                          birthData: { datetime, coordinates, ayanamsa, la }
                        }
                      : msg
                  )
                );
                // Add chart prompt after birth details
                const chartPromptId = generateId();
                setMessages((m) => [
                  ...m,
                  { 
                    id: chartPromptId, 
                    role: "assistant", 
                    content: "", 
                    ui: "chartPrompt",
                    ts: Date.now(),
                    birthData: { datetime, coordinates, ayanamsa, la }
                  },
                ]);
              } catch (e: any) {
                // Replace typing indicator with error
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === typingId
                      ? { id: typingId, role: "assistant", content: (lang === "ta" ? `பிறந்த விவரங்களை பெற முடியவில்லை: ${e?.message || "பிழை"}` : `Failed to fetch birth details: ${e?.message || "error"}`), ts: Date.now() }
                      : msg
                  )
                );
              } finally {
                if (activeAbortRef.current) activeAbortRef.current = null;
              }
            }}
            onChartYes={async (messageId) => {
              // Find the message with birth data
              const message = messages.find((m) => m.id === messageId);
              if (!message?.birthData) return;

              const { datetime, coordinates, ayanamsa, la } = message.birthData;
              
              // Replace chart prompt with typing indicator
              const typingId = generateId();
              setMessages((m) =>
                m.map((msg) =>
                  msg.id === messageId
                    ? { id: typingId, role: "assistant", content: "", typing: true, ts: Date.now() }
                    : msg
                )
              );

              try {
                const params = new URLSearchParams({
                  ayanamsa: String(ayanamsa),
                  coordinates,
                  datetime,
                  la: la || lang, // Always pass language - use la from birth data or fallback to current lang
                });
                const controller = new AbortController();
                activeAbortRef.current = controller;
                const timeoutId = setTimeout(() => controller.abort(), 20000);
                const resp = await fetch(`/api/astrology/chart?${params.toString()}`, {
                  method: "GET",
                  cache: "no-store",
                  signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!resp.ok) {
                  const errData = await resp.text().catch(() => "");
                  throw new Error(`Failed (${resp.status})`);
                }
                const svg = await resp.text();
                // Replace typing indicator with chart
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === typingId
                      ? { id: typingId, role: "assistant", content: "", ui: "chart", chartSvg: svg, ts: Date.now() }
                      : msg
                  )
                );
              } catch (e: any) {
                // Replace typing indicator with error
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === typingId
                      ? { id: typingId, role: "assistant", content: (lang === "ta" ? `விளக்கப்படத்தை பெற முடியவில்லை: ${e?.message || "பிழை"}` : `Failed to fetch chart: ${e?.message || "error"}`), ts: Date.now() }
                      : msg
                  )
                );
              } finally {
                if (activeAbortRef.current) activeAbortRef.current = null;
              }
            }}
            onChartNo={(messageId) => {
              // Remove chart prompt
              setMessages((m) => m.filter((msg) => msg.id !== messageId));
            }}
            onDailyRasiSubmit={async ({ sign, messageId }) => {
              // Update card to show loading
              setMessages((m) =>
                m.map((msg) =>
                  msg.id === messageId
                    ? { ...msg, dailyRasiData: { sign, loading: true } }
                    : msg
                )
              );

              try {
                const iso = new Date().toISOString();
                const params = new URLSearchParams({
                  sign: sign.toLowerCase(),
                  datetime: iso,
                });
                const controller = new AbortController();
                activeAbortRef.current = controller;
                const timeoutId = setTimeout(() => controller.abort(), 20000);
                const resp = await fetch(`/api/horoscope/daily?${params.toString()}`, {
                  method: "GET",
                  cache: "no-store",
                  signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!resp.ok) {
                  const errData = await resp.json().catch(() => ({} as any));
                  throw new Error((errData as any)?.error || `Failed (${resp.status})`);
                }
                const data = await resp.json();
                const prediction = data?.data?.daily_prediction?.prediction || "";
                // Update card with result
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, dailyRasiData: { sign, result: prediction, loading: false } }
                      : msg
                  )
                );
              } catch (e: any) {
                // Update card with error
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === messageId
                      ? { ...msg, dailyRasiData: { sign, error: e?.message || (lang === "ta" ? "பிழை" : "error"), loading: false } }
                      : msg
                  )
                );
              } finally {
                if (activeAbortRef.current) activeAbortRef.current = null;
              }
            }}
            onRasiChartSubmit={async ({ datetime, coordinates, ayanamsa, la, messageId }) => {
              // Keep the card, add a new typing indicator message
              const typingId = generateId();
              setMessages((m) => [
                ...m,
                { id: typingId, role: "assistant", content: "", typing: true, ts: Date.now() },
              ]);

              try {
                const params = new URLSearchParams({
                  ayanamsa: String(ayanamsa),
                  coordinates,
                  datetime,
                  la: la || lang, // Always pass language - use la from card or fallback to current lang
                });
                const controller = new AbortController();
                activeAbortRef.current = controller;
                const timeoutId = setTimeout(() => controller.abort(), 20000);
                const resp = await fetch(`/api/astrology/chart?${params.toString()}`, {
                  method: "GET",
                  cache: "no-store",
                  signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (!resp.ok) {
                  const errData = await resp.text().catch(() => "");
                  throw new Error(`Failed (${resp.status})`);
                }
                const svg = await resp.text();
                // Replace typing indicator with chart
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === typingId
                      ? { id: typingId, role: "assistant", content: "", ui: "chart", chartSvg: svg, ts: Date.now() }
                      : msg
                  )
                );
              } catch (e: any) {
                // Replace typing indicator with error
                setMessages((m) =>
                  m.map((msg) =>
                    msg.id === typingId
                      ? { id: typingId, role: "assistant", content: (lang === "ta" ? `விளக்கப்படத்தை பெற முடியவில்லை: ${e?.message || "பிழை"}` : `Failed to fetch chart: ${e?.message || "error"}`), ts: Date.now() }
                      : msg
                  )
                );
              } finally {
                if (activeAbortRef.current) activeAbortRef.current = null;
              }
            }}
          />

          <div className="sticky bottom-0 border-t border-[#f0df20]/40 bg-white/90 px-2 py-2 sm:px-3 sm:py-2.5 [padding-bottom:max(0.5rem,env(safe-area-inset-bottom))]">
            <QuickActions onPick={onQuickPick} lang={lang} />
            <div className="mt-2" />
            <ChatInput 
              onSend={sendMessage} 
              disabled={isSending || (isDevelopment ? false : (timerExpired || hasUsedTrial))} 
              lang={lang} 
            />
          </div>
            </>
          )}
        </section>

        <aside className="hidden lg:block lg:col-span-1">
          <TransitWidget />
        </aside>
      </div>
    </ChatShell>
  );
}


