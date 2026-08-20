export function DonutProgress({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 50;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} stroke="#E4E4E7" strokeWidth="10" fill="none" />
        <circle cx="60" cy="60" r={r} stroke="#10B981" strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-extrabold text-gelap">{v}%</div>
          <div className="text-[10px] uppercase tracking-widest text-gelap-500 font-bold">COMPLET</div>
        </div>
      </div>
    </div>
  );
}
