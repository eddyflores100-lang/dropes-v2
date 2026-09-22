/**
 * Newsletter.tsx — Email capture with simple inline validation.
 */
import { useState, type FormEvent } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { isValidEmail } from '@/lib/auth';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Introduce un email válido');
      return;
    }
    setError('');
    setDone(true);
    // In production: POST to your backend or Mailchimp API.
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15),transparent_60%)] pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-[11px] font-bold tracking-wider uppercase mb-6">
          <Mail className="w-3.5 h-3.5" />
          Newsletter
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Recibe <span className="text-brand-500">ofertas exclusivas</span> antes que nadie
        </h2>
        <p className="text-ink-400 mb-10 max-w-xl mx-auto">
          Únete y obtén un cupón de bienvenida del 10% en tu primer pedido, además de acceso anticipado a flash sales y novedades.
        </p>

        {done ? (
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold">¡Suscrito! Revisa tu email para el cupón de bienvenida.</span>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-brand-500 focus:bg-white/15 placeholder:text-ink-400 font-medium"
              required
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              Suscribirme
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
        {error && <p className="text-brand-300 text-sm mt-3">{error}</p>}
        <p className="text-xs text-ink-500 mt-4">Sin spam. Puedes darte de baja cuando quieras.</p>
      </div>
    </section>
  );
}
