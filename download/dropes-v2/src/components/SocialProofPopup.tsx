/**
 * SocialProofPopup.tsx — Rotating "X bought Y" social proof popup.
 */
import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

const NOTIFICATIONS = [
  { name: 'María G.', location: 'Madrid', product: 'Humidificador premium', time: 'Hace 2 min' },
  { name: 'Carlos M.', location: 'Barcelona', product: 'Auriculares inalámbricos', time: 'Hace 5 min' },
  { name: 'Laura P.', location: 'Valencia', product: 'Freidora de aire 12-en-1', time: 'Hace 12 min' },
  { name: 'David R.', location: 'Sevilla', product: 'Masajeador cervical', time: 'Hace 15 min' },
  { name: 'Ana S.', location: 'Bilbao', product: 'Faja colombiana push-up', time: 'Hace 22 min' },
  { name: 'Pedro J.', location: 'Málaga', product: 'Compostador eléctrico', time: 'Hace 28 min' },
] as const;

export default function SocialProofPopup() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (closed) return;
    const show = setTimeout(() => setVisible(true), 3000);
    const rot = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((p) => (p + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 800);
    }, 9000);
    return () => { clearTimeout(show); clearInterval(rot); };
  }, [closed]);

  if (closed) return null;
  const n = NOTIFICATIONS[index];

  return (
    <div
      className={`fixed bottom-4 left-4 z-40 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}
    >
      <div className="glass rounded-2xl p-4 pr-10 flex items-center gap-3 max-w-sm shadow-xl">
        <button onClick={() => setClosed(true)} className="absolute top-2 right-2 text-ink-400 hover:text-ink-600" aria-label="Cerrar">
          <X className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="text-sm">
          <div className="text-ink-600 mb-0.5">
            <strong className="text-ink-900">{n.name}</strong> en {n.location}
          </div>
          <div className="font-bold text-ink-900 mb-0.5">Compró {n.product}</div>
          <div className="text-xs text-ink-400">{n.time} · Compra verificada</div>
        </div>
      </div>
    </div>
  );
}
