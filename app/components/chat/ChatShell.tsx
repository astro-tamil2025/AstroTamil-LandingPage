import type { ReactNode } from "react";
type ChatShellProps = {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  backgroundParticles?: boolean;
};

export default function ChatShell({ title, subtitle, right, children, backgroundParticles }: ChatShellProps) {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,#E5E7EB_0%,#F6E095_100%)]" />
      </div>

      {/* Particles */}
      {backgroundParticles && (
        <>
          <img src="/assets/hero-icons/Star 1.svg" alt="" className="pointer-events-none select-none absolute top-6 left-6 w-4 opacity-80" />
          <img src="/assets/hero-icons/Star 3.svg" alt="" className="pointer-events-none select-none absolute top-10 right-10 w-5 opacity-80" />
          <img src="/assets/hero-icons/Ellipse 2.svg" alt="" className="pointer-events-none select-none absolute bottom-12 left-10 w-4 opacity-70" />
          <img src="/assets/hero-icons/Ellipse 6.svg" alt="" className="pointer-events-none select-none absolute bottom-8 right-16 w-4 opacity-70" />
        </>
      )}

      {/* Foreground */}
      <div className="relative z-10">
        {title ? (
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
            <div>
              <h1 className="text-[22px] font-bold text-black">{title}</h1>
              {subtitle ? (
                <p className="text-[12px] text-zinc-600">{subtitle}</p>
              ) : null}
            </div>
            {right}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}


