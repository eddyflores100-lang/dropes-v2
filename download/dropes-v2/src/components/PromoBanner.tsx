/**
 * PromoBanner.tsx — Sliding countdown banner for seasonal promos.
 */
import { useEffect, useState } from 'react';

function format(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
}

export default function PromoBanner() {
  // 24h countdown that resets daily
  const [remaining, setRemaining] = useState(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return end.getTime() - now.getTime();
  });

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      setRemaining(end.getTime() - now.getTime());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-center gap-3 sm:gap-6 relative z-10">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">🔥 Oferta flash termina en</span>
        <span className="font-mono text-base sm:text-lg font-black bg-white/15 backdrop-blur px-3 py-1 rounded-lg tabular-nums">
          {format(remaining)}
        </span>
      </div>
    </div>
  );
}
