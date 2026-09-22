/**
 * TrustRibbon.tsx — Trust badges below hero.
 */
import { Truck, ShieldCheck, RotateCcw, CreditCard, Headphones, Clock } from 'lucide-react';

const ITEMS = [
  { icon: Truck, title: 'Envío 24-48h', desc: 'Gratis en toda la península' },
  { icon: ShieldCheck, title: 'Pago seguro', desc: 'Encriptación SSL 256-bit' },
  { icon: RotateCcw, title: '30 días', desc: 'Devolución sin preguntas' },
  { icon: CreditCard, title: 'Contra reembolso', desc: 'O tarjeta / Bizum' },
  { icon: Headphones, title: 'Soporte', desc: 'Lun-Sáb 9-21h' },
  { icon: Clock, title: 'Garantía 2 años', desc: 'Producto oficial' },
] as const;

export default function TrustRibbon() {
  return (
    <section className="bg-white border-y border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink-50 transition-colors"
            >
              <div className="p-2 bg-brand-50 text-brand-600 rounded-lg shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink-900 truncate">{title}</div>
                <div className="text-[10px] text-ink-500 truncate">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
