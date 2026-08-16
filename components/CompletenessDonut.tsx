export function CompletenessDonut({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className="relative w-32 h-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="#E4E4E7" strokeWidth="10" fill="none" />
        <circle cx="50" cy="50" r={r} stroke="#10B981" strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-extrabold text-gelap">{v}%</div>
          <div className="text-[10px] uppercase tracking-wide text-gelap-500 font-semibold">Complet</div>
        </div>
      </div>
    </div>
  );
}
