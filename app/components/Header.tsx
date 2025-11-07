"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import type { Language } from "../hooks/useLanguage";

const NAV_ITEMS = [
	{ href: "#home", label: "Home", sectionId: "home" },
	{ href: "#horoscope", label: "Horoscope", sectionId: "horoscope" },
	{ href: "#astrologers", label: "Astrologers", sectionId: "astrologers" },
	{ href: "#contact", label: "Contact", sectionId: "contact" },
];

function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const rawLang = searchParams.get("lang");
	const lang: Language = rawLang === "ta" || rawLang === "en" ? rawLang : "en";
	
	const [mobileOpen, setMobileOpen] = useState(false);
	const [langMenuOpen, setLangMenuOpen] = useState(false);
	const langMenuRef = useRef<HTMLDivElement | null>(null);
	const [currentHash, setCurrentHash] = useState<string>("");

	// Handle language change - properly update URL to trigger re-renders
	const handleLanguageChange = useCallback((newLang: Language) => {
		// Don't do anything if language is already set to the same value
		if (newLang === lang) {
			setLangMenuOpen(false);
			return;
		}

		// Close the menu first to provide immediate feedback
		setLangMenuOpen(false);

		// Create new URLSearchParams from current search params
		const currentParams = new URLSearchParams(searchParams.toString());
		currentParams.set("lang", newLang);
		
		// Build the new URL with updated language parameter
		const newUrl = `${pathname}?${currentParams.toString()}`;
		
		// Use replace instead of push to avoid adding to history
		// This ensures the URL changes and triggers re-renders in all components
		router.replace(newUrl, { scroll: false });
	}, [pathname, router, searchParams, lang]);

	const toggleLangMenu = useCallback(() => {
		setLangMenuOpen((prev) => !prev);
	}, []);

	// Ensure landing page always has lang parameter in URL (default to "en")
	useEffect(() => {
		// Only run on landing page (not chat route)
		if (!pathname.startsWith("/chat") && pathname === "/") {
			const currentLang = searchParams.get("lang");
			// If no lang parameter exists or it's invalid, add default "en"
			if (!currentLang || (currentLang !== "en" && currentLang !== "ta")) {
				const sp = new URLSearchParams(searchParams.toString());
				sp.set("lang", "en");
				const newUrl = `${pathname}?${sp.toString()}`;
				// Use replace to avoid adding to history
				router.replace(newUrl, { scroll: false });
			}
		}
	}, [pathname, router, searchParams]);

	// Track current hash to avoid hydration mismatch
	useEffect(() => {
		if (typeof window !== "undefined") {
			setCurrentHash(window.location.hash);
			
			const handleHashChange = () => {
				setCurrentHash(window.location.hash);
			};
			
			window.addEventListener("hashchange", handleHashChange);
			return () => window.removeEventListener("hashchange", handleHashChange);
		}
	}, []);

	// Handle initial hash navigation on page load
	useEffect(() => {
		if (pathname === "/" && typeof window !== "undefined") {
			const hash = window.location.hash;
			if (hash) {
				// Wait for page to load, then scroll to section
				setTimeout(() => {
					const sectionId = hash.substring(1); // Remove #
					const element = document.getElementById(sectionId);
					if (element) {
						const headerHeight = 64;
						const elementPosition = element.getBoundingClientRect().top;
						const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
						
						window.scrollTo({
							top: offsetPosition,
							behavior: "smooth"
						});
					}
				}, 100);
			}
		}
	}, [pathname]);

	// Close language menu when clicking outside
	useEffect(() => {
		if (!langMenuOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			// Only close if clicking outside the menu container
			if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
				// Use requestAnimationFrame to ensure this runs after the button click handler
				requestAnimationFrame(() => {
					setLangMenuOpen(false);
				});
			}
		};

		// Use a longer delay to ensure menu item clicks are fully processed
		const timeoutId = setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
		}, 150);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener("click", handleClickOutside);
		};
	}, [langMenuOpen]);

	// Hide primary header on chat route for immersive chat screen
	// Early return MUST come after all hooks
	if (pathname.startsWith("/chat")) {
		return null;
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
				{/* Left: Brand */}
				<a 
					href={pathname === "/" ? "#home" : "/"} 
					onClick={(e) => {
						if (pathname === "/") {
							e.preventDefault();
							const element = document.getElementById("home");
							if (element) {
								const headerHeight = 64;
								const elementPosition = element.getBoundingClientRect().top;
								const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
								
								window.scrollTo({
									top: offsetPosition,
									behavior: "smooth"
								});
								
								window.history.pushState(null, "", "#home");
							}
						}
					}}
					className="flex items-center gap-2 cursor-pointer" 
					aria-label="Nakshatra Talks Home"
				>
					<Image src="/images/header/logo.png" alt="Nakshatra Talks logo" width={120} height={30} className="h-6 w-auto" priority />
					<span className="text-[22px] font-normal tracking-tight text-black">Nakshatra Talks</span>
				</a>

				{/* Desktop Nav */}
				<nav className="hidden items-center gap-8 sm:flex" aria-label="Main">
					{NAV_ITEMS.map(({ href, label, sectionId }) => {
						const isActive = pathname === "/" && currentHash === href;
						const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
							// Only prevent default if we're on the home page
							if (pathname === "/") {
								e.preventDefault();
								const element = document.getElementById(sectionId);
								if (element) {
									const headerHeight = 64; // Height of sticky header
									const elementPosition = element.getBoundingClientRect().top;
									const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
									
									window.scrollTo({
										top: offsetPosition,
										behavior: "smooth"
									});
									
									// Update URL hash without scrolling
									window.history.pushState(null, "", href);
									setCurrentHash(href);
								}
							}
						};
						
						return (
							<a
								key={href}
								href={pathname === "/" ? href : `/${href}`}
								onClick={handleClick}
								className="group relative text-[16px] font-semibold text-black cursor-pointer"
							>
								{label}
								<span
									className={
										"absolute -bottom-2 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded bg-zinc-400 transition-all duration-200 group-hover:w-10 " +
										(isActive ? "w-10" : "")
									}
								/>
							</a>
						);
					})}
				</nav>

			{/* Right: Language Selector */}
			<div className="hidden items-center gap-3 sm:flex">
				<LanguageSelector
					lang={lang}
					isOpen={langMenuOpen}
					onToggle={toggleLangMenu}
					onChange={handleLanguageChange}
					ref={langMenuRef}
				/>
			</div>

				{/* Mobile actions + hamburger */}
			<div className="flex items-center gap-3 sm:hidden">
				<LanguageSelector
					lang={lang}
					isOpen={langMenuOpen}
					onToggle={toggleLangMenu}
					onChange={handleLanguageChange}
					ref={langMenuRef}
				/>
				<button
						className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-zinc-100 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/50"
						aria-controls="mobile-nav"
						aria-expanded={mobileOpen}
						onClick={() => setMobileOpen((v) => !v)}
					>
						<span className="sr-only">Toggle navigation</span>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Nav */}
			<div id="mobile-nav" className={(mobileOpen ? "block" : "hidden") + " sm:hidden border-t border-zinc-200 bg-white"}>
				<nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
					{NAV_ITEMS.map(({ href, label, sectionId }) => {
						const isActive = pathname === "/" && currentHash === href;
						const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
							// Only prevent default if we're on the home page
							if (pathname === "/") {
								e.preventDefault();
								const element = document.getElementById(sectionId);
								if (element) {
									const headerHeight = 64; // Height of sticky header
									const elementPosition = element.getBoundingClientRect().top;
									const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
									
									window.scrollTo({
										top: offsetPosition,
										behavior: "smooth"
									});
									
									// Update URL hash without scrolling
									window.history.pushState(null, "", href);
								}
							}
							setMobileOpen(false);
						};
						
						return (
							<a
								key={href}
								href={pathname === "/" ? href : `/${href}`}
								onClick={handleClick}
								className={
									"flex flex-col items-start gap-1 rounded-md px-2 py-2 text-[16px] font-medium text-black hover:bg-zinc-50 cursor-pointer " +
									(isActive ? "bg-zinc-100" : "")
								}
							>
								<span>{label}</span>
								{isActive ? <span className="h-[3px] w-10 rounded bg-zinc-400" /> : null}
							</a>
						);
					})}
					{/* Globe/Login already in header on mobile */}
				</nav>
			</div>
		</header>
	);
}

export default Header;

// Language Selector Component - Reusable and optimized with React
interface LanguageSelectorProps {
	lang: Language;
	isOpen: boolean;
	onToggle: () => void;
	onChange: (lang: Language) => void;
}

const LanguageSelector = React.forwardRef<HTMLDivElement, LanguageSelectorProps>(
	({ lang, isOpen, onToggle, onChange }, ref) => {
		return (
			<div className="relative" ref={ref}>
				<button
					type="button"
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					onClick={onToggle}
					className="inline-flex items-center gap-2 rounded-full border border-[#f6d851] bg-white px-3 py-1.5 text-[12px] font-semibold text-black shadow-[0_0_0_1px_#f6e095_inset,0_10px_22px_rgba(240,223,32,0.15)] transition-all hover:shadow-[0_0_0_1px_#f6e095_inset,0_12px_24px_rgba(240,223,32,0.2)]"
				>
					<Image src="/globe.svg" alt="Language selector" width={18} height={18} />
					<span>{lang === "en" ? "EN" : "TA"}</span>
				</button>
				{isOpen && (
					<div
						role="listbox"
						aria-label="Language selector"
						className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-[#f6d851] bg-white p-1 text-black shadow-[0_12px_30px_rgba(0,0,0,0.12)] z-50"
						onMouseDown={(e) => e.preventDefault()}
					>
						<button
							type="button"
							role="option"
							aria-selected={lang === "en"}
							onMouseDown={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onChange("en");
							}}
							className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-black transition-colors cursor-pointer ${
								lang === "en" ? "bg-[#fff8d5] font-semibold" : "hover:bg-zinc-50"
							}`}
						>
							<span>English</span>
							{lang === "en" && <span className="text-[#f0df20]">✓</span>}
						</button>
						<button
							type="button"
							role="option"
							aria-selected={lang === "ta"}
							onMouseDown={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onChange("ta");
							}}
							className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] text-black transition-colors cursor-pointer ${
								lang === "ta" ? "bg-[#fff8d5] font-semibold" : "hover:bg-zinc-50"
							}`}
						>
							<span>தமிழ்</span>
							{lang === "ta" && <span className="text-[#f0df20]">✓</span>}
						</button>
					</div>
				)}
			</div>
		);
	}
);

LanguageSelector.displayName = "LanguageSelector";


