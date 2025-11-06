"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawLang = searchParams.get("lang");
  const lang: "ta" | "en" = rawLang === "ta" || rawLang === "en" ? rawLang : "en";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const setLangParam = (next: "en" | "ta") => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("lang", next);
    router.replace(`${pathname}?${sp.toString()}`);
    setOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Back home" className="inline-flex items-center justify-center rounded-full p-2 text-black hover:bg-zinc-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/" className="flex items-center gap-2" aria-label="AstroTamil Home">
            <Image src="/images/header/logo.png" alt="AstroTamil logo" width={120} height={30} className="h-6 w-auto" />
            <span className="text-[22px] font-normal tracking-tight text-black">AstroTamil</span>
          </Link>
        </div>
        <div className="relative flex items-center gap-3" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#f6d851] bg-white px-3 py-1.5 text-[12px] font-semibold text-black shadow-[0_0_0_1px_#f6e095_inset,0_10px_22px_rgba(240,223,32,0.15)]"
          >
            <Image src="/globe.svg" alt="" width={18} height={18} />
            {lang === "en" ? "EN" : "TA"}
          </button>
          {open && (
            <div role="listbox" aria-label="Language" className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-[#f6d851] bg-white p-1 text-black shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
              <button
                role="option"
                aria-selected={lang === "en"}
                onClick={() => setLangParam("en")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-black ${lang === "en" ? "bg-[#fff8d5] font-semibold" : "hover:bg-zinc-50"}`}
              >
                English {lang === "en" ? "✓" : ""}
              </button>
              <button
                role="option"
                aria-selected={lang === "ta"}
                onClick={() => setLangParam("ta")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-black ${lang === "ta" ? "bg-[#fff8d5] font-semibold" : "hover:bg-zinc-50"}`}
              >
                தமிழ் {lang === "ta" ? "✓" : ""}
              </button>
            </div>
          )}
          {/* Login removed for chat header */}
        </div>
      </div>
    </div>
  );
}


