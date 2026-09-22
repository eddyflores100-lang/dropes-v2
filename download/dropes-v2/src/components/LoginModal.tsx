/**
 * LoginModal.tsx — Email-only "magic" sign-in (no real auth, local-only).
 * Real authentication should integrate Firebase Auth, Clerk, or Auth0
 * in production — see MIGRATION.md.
 */
import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, LogOut, Package, Loader2 } from 'lucide-react';
import type { LocalUser, OrderRecord } from '@/types';
import { isValidEmail } from '@/lib/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LocalUser | null;
  onSignIn: (email: string, name?: string) => void;
  onSignOut: () => void;
  orders: OrderRecord[];
}

export default function LoginModal({
  isOpen,
  onClose,
  user,
  onSignIn,
  onSignOut,
  orders,
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Introduce un email válido.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      try {
        onSignIn(email, name);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-ink-200 hover:text-ink-900 transition-colors z-10" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>

            {user ? (
              // ── Signed-in view ────────────────────────────────────────────
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-xl font-black uppercase">
                    {user.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs text-ink-400 uppercase tracking-wider font-bold">Hola,</p>
                    <h3 className="text-lg font-black text-ink-900">{user.name}</h3>
                    <p className="text-xs text-ink-500">{user.email}</p>
                  </div>
                </div>

                <div className="bg-ink-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-brand-600" />
                    <h4 className="font-bold text-ink-900 text-sm">Tus pedidos</h4>
                    <span className="ml-auto text-xs text-ink-400">{orders.length} total</span>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-sm text-ink-500 py-4 text-center">Aún no tienes pedidos. ¡Explora el catálogo!</p>
                  ) : (
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                      {orders.slice(0, 5).map((o) => (
                        <li key={o.id} className="flex items-center justify-between p-2 bg-white rounded-lg text-xs">
                          <div>
                            <div className="font-bold text-ink-900">#{o.dropea_id ?? o.id}</div>
                            <div className="text-ink-400">
                              {new Date(o.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                              {' · '}
                              {o.items.length} {o.items.length === 1 ? 'artículo' : 'artículos'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-ink-900">{o.total}€</div>
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase">
                              {o.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={() => { onSignOut(); onClose(); }}
                  className="w-full py-3 bg-ink-100 hover:bg-ink-200 text-ink-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              // ── Sign-in form ────────────────────────────────────────────
              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center mb-4">
                    <User className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-ink-900 tracking-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>Mi cuenta</h3>
                  <p className="text-sm text-ink-500">Accede para ver tu historial de pedidos y favoritos.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-ink-400 uppercase ml-2">Nombre (opcional)</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-ink-50 border border-ink-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-brand-600 focus:bg-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-ink-400 uppercase ml-2">Email</span>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="w-full bg-ink-50 border border-ink-200 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-600 focus:bg-white font-bold"
                      />
                    </div>
                  </div>

                  {error && <p className="text-brand-600 text-xs ml-2">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-brand-700 transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Acceder'}
                  </button>
                </form>

                <p className="text-[11px] text-ink-400 text-center mt-4 leading-relaxed">
                  Al continuar aceptas los <a href="#" className="underline hover:text-ink-600">Términos</a> y la <a href="#" className="underline hover:text-ink-600">Política de Privacidad</a>. Cuenta local — tus datos se guardan solo en este dispositivo.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
