"use client";

type ChatTimerProps = {
  seconds: number;
};

export default function ChatTimer({ seconds }: ChatTimerProps) {
  const formatTime = (secs: number) => {
    // Coerce to safe integer and clamp negatives to zero
    const sanitizedSecs = Math.max(0, Math.floor(Number(secs) || 0));
    const mins = Math.floor(sanitizedSecs / 60);
    const secsRemaining = sanitizedSecs % 60;
    return `${mins}:${secsRemaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <svg
          className="h-4 w-4 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-[14px] font-semibold text-red-600">
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  );
}

