/**
 * AnnouncementBar.tsx — Top promotional bar (free shipping).
 */
export default function AnnouncementBar() {
  return (
    <div className="bg-ink-950 text-white text-center text-[11px] sm:text-xs font-semibold py-2.5 px-4 tracking-wide">
      <span className="inline-flex items-center gap-2">
        <span className="hidden sm:inline">🚚</span>
        <span>Envío <strong className="text-brand-400">GRATIS</strong> en 24-48h a toda España y Portugal · Contra reembolso disponible</span>
      </span>
    </div>
  );
}
