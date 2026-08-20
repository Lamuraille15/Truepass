"use client";

export function PrintButton({ label = "Télécharger le CV ↗" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center justify-center rounded-xl border-2 border-gelap-200 px-5 py-2.5 text-sm font-bold text-gelap-300 transition hover:border-brand hover:text-brand"
    >
      {label}
    </button>
  );
}
