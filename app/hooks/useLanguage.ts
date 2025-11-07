"use client";

import { useSearchParams } from "next/navigation";

export type Language = "en" | "ta";

/**
 * Custom hook to manage language state from URL search params
 * Automatically syncs with URL and returns the current language string
 * 
 * Note: Components using this hook must be wrapped in Suspense boundary
 * 
 * The hook automatically re-renders when the URL search params change
 * because useSearchParams() is reactive in Next.js App Router
 * 
 * Components must handle translations separately using the returned language value
 */
export function useLanguage(): Language {
  const searchParams = useSearchParams();
  
  // Get the language from URL params
  // useSearchParams() automatically triggers re-renders when URL changes
  const urlLang = searchParams.get("lang");
  const lang: Language = urlLang === "ta" || urlLang === "en" ? urlLang : "en";
  
  return lang;
}

