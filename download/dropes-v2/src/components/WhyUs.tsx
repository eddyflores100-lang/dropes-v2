/**
 * WhyUs.tsx — "Why choose Dropes" feature grid.
 */
import { motion } from 'motion/react';
import { ShieldCheck, Truck, Headphones, Award, RefreshCw, CreditCard } from 'lucide-react';

const REASONS = [
  { icon: ShieldCheck, title: 'Compra segura', desc: 'Encriptación SSL 256-bit. Tus datos siempre protegidos.' },
  { icon: Truck, title: 'Envío 24-48h', desc: 'Gratis a toda España y Portugal. Sin pedido mínimo.' },
  { icon: Award, title: 'Productos premium', desc: 'Catálogo seleccionado por IA entre miles de referencias.' },
  { icon: RefreshCw, title: '30 días devolución', desc: '¿No te convence? Devuélvelo sin preguntas ni coste.' },
  { icon: CreditCard, title: 'Contra reembolso', desc: 'Paga cuando lo recibas. O tarjeta / Bizum si prefieres.' },
  { icon: Headphones, title: 'Soporte humano', desc: 'Equipo en España, lun-sáb 9-21h. WhatsApp y email.' },
] as const;

export default function WhyUs() {
  return (
    <section className="py-16 sm:py-24 bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3 inline-block">Por qué Dropes</span>
          <h2 className="text-3xl sm:text-5xl font-black text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Hecho para <span className="text-brand-600">comprar sin riesgos</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-ink-100 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
                <r.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-ink-900 text-lg mb-2">{r.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
