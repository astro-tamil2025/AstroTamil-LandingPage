export default function TransitWidget() {
  return (
    <div className="rounded-2xl border border-[#f0df20]/50 bg-white/90 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      <h3 className="text-[16px] font-semibold text-black">Today’s Transit</h3>
      <p className="mt-1 text-[12px] text-zinc-600">
        Planetary movements and auspicious timings at a glance.
      </p>
      <div className="mt-3 space-y-2 text-[13px] text-black">
        <div className="flex items-center justify-between rounded-xl border border-[#f0df20]/40 bg-[#fff8d5] px-3 py-2">
          <span>Sun</span>
          <span className="text-[12px] text-zinc-700">Stable</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#f0df20]/40 bg-[#fff8d5] px-3 py-2">
          <span>Moon</span>
          <span className="text-[12px] text-zinc-700">Calm</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#f0df20]/40 bg-[#fff8d5] px-3 py-2">
          <span>Venus</span>
          <span className="text-[12px] text-zinc-700">Favorable</span>
        </div>
      </div>
    </div>
  );
}


