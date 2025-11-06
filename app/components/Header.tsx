"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
	{ href: "/", label: "Home" },
	{ href: "/horoscope", label: "Horoscope" },
	{ href: "/astrologers", label: "Astrologers" },
	{ href: "/contact", label: "Contact" },
];

export default function Header() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);

	// Hide primary header on chat route for immersive chat screen
	if (pathname.startsWith("/chat")) {
		return null;
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
				{/* Left: Brand */}
				<Link href="/" className="flex items-center gap-2" aria-label="AstroTamil Home">
					<Image src="/images/header/logo.png" alt="AstroTamil logo" width={120} height={30} className="h-6 w-auto" priority />
					<span className="text-[22px] font-normal tracking-tight text-black">AstroTamil</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden items-center gap-8 sm:flex" aria-label="Main">
					{NAV_ITEMS.map(({ href, label }) => {
						const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
						return (
							<Link
								key={href}
								href={href}
								className="group relative text-[16px] font-semibold text-black"
							>
								{label}
								<span
									className={
										"absolute -bottom-2 left-1/2 h-[3px] w-0 -translate-x-1/2 rounded bg-zinc-400 transition-all duration-200 group-hover:w-10 " +
										(isActive ? "w-10" : "")
									}
								/>
							</Link>
						);
					})}
				</nav>

			{/* Right: Actions (Login removed) */}
			<div className="hidden items-center gap-3 sm:flex">
				<Image src="/globe.svg" alt="" width={22} height={22} aria-hidden="true" />
			</div>

				{/* Mobile actions + hamburger */}
			<div className="flex items-center gap-3 sm:hidden">
				<Image src="/globe.svg" alt="" width={22} height={22} aria-hidden="true" />
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
					{NAV_ITEMS.map(({ href, label }) => {
						const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
						return (
							<Link
								key={href}
								href={href}
								className={
									"flex flex-col items-start gap-1 rounded-md px-2 py-2 text-[16px] font-medium text-black hover:bg-zinc-50 " +
									(isActive ? "bg-zinc-100" : "")
								}
								onClick={() => setMobileOpen(false)}
							>
								<span>{label}</span>
								{isActive ? <span className="h-[3px] w-10 rounded bg-zinc-400" /> : null}
							</Link>
						);
					})}
					{/* Globe/Login already in header on mobile */}
				</nav>
			</div>
		</header>
	);
}


