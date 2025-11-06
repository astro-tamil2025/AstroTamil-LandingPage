export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 animate-bounce rounded-full bg-[#f0df20] [animation-delay:0ms]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-[#f0df20] [animation-delay:120ms]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-[#f0df20] [animation-delay:240ms]" />
    </div>
  );
}


