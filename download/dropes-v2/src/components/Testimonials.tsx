/**
 * Testimonials.tsx — Customer reviews carousel.
 */
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'María González', location: 'Madrid', text: 'Pedí una freidora de aire y llegó al día siguiente. Calidad excelente y el precio fue el mejor que encontré. Volveré a comprar sin duda.', product: 'Freidora 12-en-1', rating: 5 },
  { name: 'Carlos Martínez', location: 'Barcelona', text: 'El sistema de contra reembolso me dio confianza para probar. Todo perfecto, producto original y factura correcta.', product: 'Auriculares Bluetooth', rating: 5 },
  { name: 'Laura Pérez', location: 'Valencia', text: 'Compré un masajeador cervical y superó mis expectativas. Atención al cliente rápida cuando tuve dudas.', product: 'Masajeador cervical', rating: 5 },
  { name: 'David Ruiz', location: 'Sevilla', text: 'Segunda compra en Dropes. Envío gratis de verdad, sin sorpresas. Los productos llegan bien empaquetados.', product: 'Compostador eléctrico', rating: 5 },
] as const;

export default function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex text-brand-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <span className="text-sm font-bold text-ink-600">4.9/5 · 2.487 opiniones verificadas</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Lo que dicen <span className="text-brand-600">nuestros clientes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-ink-50 rounded-2xl p-6 relative"
            >
              <Quote className="w-8 h-8 text-brand-300 mb-3" />
              <div className="flex text-brand-500 mb-3">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm text-ink-700 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-black text-sm uppercase">
                  {t.name.slice(0, 1)}
                </div>
                <div>
                  <div className="font-bold text-ink-900 text-sm">{t.name}</div>
                  <div className="text-xs text-ink-400">{t.location} · {t.product}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
