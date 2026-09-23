/**
 * CheckoutModal.tsx — Cart + Checkout + Success flow.
 * Email is now required and validated (no hardcoded fake email).
 * Calls createOrder via src/lib/dropea.ts.
 */
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, CheckCircle2, ShieldCheck, Truck, CreditCard, Minus, Plus,
  ShoppingBag, Loader2, AlertCircle, ArrowRight, Mail,
} from 'lucide-react';
import type { CartItem, Customer, PaymentMethod, OrderRecord } from '@/types';
import { createOrder } from '@/lib/dropea';
import { subtotal, formatEuro } from '@/lib/format';
import { isValidEmail } from '@/lib/auth';

interface CheckoutModalProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onClearCart: () => void;
  onOrderConfirmed: (order: OrderRecord) => void;
  userEmail?: string;
}

const SPAIN_PROVINCES = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia',
  'Palma de Mallorca', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid',
  'Vigo', 'Gijón', 'Hospitalet', 'Vitoria', 'A Coruña', 'Granada', 'Elche',
];

const PORTUGAL_DISTRICTS = [
  'Lisboa', 'Porto', 'Braga', 'Setúbal', 'Aveiro', 'Leiria', 'Santarém', 'Coimbra', 'Faro', 'Viseu',
];

type Step = 'cart' | 'checkout' | 'success';

export default function CheckoutModal({
  cart,
  onClose,
  onUpdateQuantity,
  onClearCart,
  onOrderConfirmed,
  userEmail,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>('cart');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [savedTotal, setSavedTotal] = useState('0.00');
  const [savedOrderId, setSavedOrderId] = useState<string>('');

  const [formData, setFormData] = useState<Customer>({
    first_name: '',
    last_name: '',
    email: userEmail ?? '',
    phone: '',
    address: '',
    zip: '',
    city: '',
    country: 'ES',
  });

  const total = subtotal(cart);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(formData.email)) {
      setError('Introduce un email válido. Te enviaremos allí la confirmación del pedido.');
      return;
    }
    if (!/^[679]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Introduce un teléfono español válido (9 dígitos, empieza por 6/7/9).');
      return;
    }
    if (formData.country === 'ES' && !/^\d{5}$/.test(formData.zip)) {
      setError('El código postal español debe tener 5 dígitos.');
      return;
    }

    setLoading(true);
    try {
      const dropeaId = await createOrder({
        cart: cart.map((item) => ({ id: item.id, priceNow: item.priceNow, quantity: item.quantity })),
        customer: formData,
        paymentMethod,
      });

      setSavedTotal(formatEuro(total));
      setSavedOrderId(dropeaId);

      const order: OrderRecord = {
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
        total: formatEuro(total),
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          priceNow: item.priceNow,
          image: item.image,
        })),
        customer: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          city: formData.city,
          country: formData.country,
        },
        payment_method: paymentMethod,
        status: 'confirmed',
        dropea_id: dropeaId,
      };
      onOrderConfirmed(order);

      setStep('success');
      onClearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor. Inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-ink-950/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl relative flex flex-col no-scrollbar"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-ink-100 text-ink-500 hover:bg-ink-200 hover:text-ink-900 transition-colors z-20"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {step === 'cart' && (
            <motion.div
              key="cart"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="p-6 sm:p-8 flex-1 flex flex-col"
            >
              <h3 className="text-2xl font-black text-ink-900 mb-6 flex items-center gap-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                <ShoppingBag className="w-6 h-6 text-brand-600" />
                Tu carrito
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-ink-400 flex flex-col items-center">
                  <div className="w-24 h-24 bg-ink-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-ink-200" />
                  </div>
                  <p className="text-lg font-bold text-ink-300">El carrito está vacío</p>
                  <button onClick={onClose} className="mt-8 px-8 py-3.5 bg-ink-900 text-white rounded-xl font-bold hover:bg-ink-800 transition-all active:scale-95">
                    Seguir comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto mb-6 pr-1 space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center bg-ink-50 rounded-2xl p-3 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-ink-100 p-1.5 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-0.5">{item.category || 'General'}</div>
                          <div className="font-bold text-ink-900 mb-1.5 truncate text-sm" title={item.name}>{item.name}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-black text-ink-900">{item.priceNow}€</div>
                            <div className="flex items-center gap-3 bg-white border border-ink-100 px-2 py-1 rounded-full">
                              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} aria-label="Reducir" className="text-ink-400 hover:text-brand-600 transition-colors">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-bold text-sm text-ink-900">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar" className="text-ink-400 hover:text-emerald-500 transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-ink-900 rounded-2xl p-5 text-white mb-4 shadow-xl">
                    <div className="flex justify-between mb-2 text-sm text-ink-300">
                      <span>Subtotal</span>
                      <span>{formatEuro(total)}€</span>
                    </div>
                    <div className="flex justify-between mb-4 text-emerald-400 text-sm font-bold uppercase tracking-wider">
                      <span>Envío exprés</span>
                      <span>Gratis</span>
                    </div>
                    <div className="flex justify-between text-xl font-black">
                      <span>Total</span>
                      <span>{formatEuro(total)}€</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg shadow-xl shadow-brand-600/30"
                  >
                    Finalizar pedido
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>
          )}

          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <button onClick={() => setStep('cart')} className="p-2 bg-ink-50 rounded-full hover:bg-ink-100 transition-colors -ml-1" aria-label="Volver">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
                <h3 className="text-2xl font-black text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Finalizar</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-brand-600 bg-brand-50' : 'border-ink-100 bg-ink-50 hover:border-ink-200'}`}
                >
                  <Truck className={`w-7 h-7 ${paymentMethod === 'cod' ? 'text-brand-600' : 'text-ink-300'}`} />
                  <span className={`text-sm font-bold ${paymentMethod === 'cod' ? 'text-ink-900' : 'text-ink-400'}`}>Contra reembolso</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-ink-900 bg-ink-100' : 'border-ink-100 bg-ink-50 hover:border-ink-200'}`}
                >
                  <CreditCard className={`w-7 h-7 ${paymentMethod === 'card' ? 'text-ink-900' : 'text-ink-300'}`} />
                  <span className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-ink-900' : 'text-ink-400'}`}>Tarjeta / Bizum</span>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm flex gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-bold">{error}</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Nombre" name="first_name" value={formData.first_name} onChange={handleChange} required />
                  <Field label="Apellidos" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="tu@email.com" icon={Mail} hint="Te enviaremos la confirmación del pedido" />
                <Field label="Teléfono" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="600 000 000" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ink-400 uppercase ml-2">País</span>
                  <select name="country" value={formData.country} onChange={handleChange} className="w-full bg-ink-50 border border-ink-200 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-brand-600 focus:bg-white font-bold">
                    <option value="ES">España 🇪🇸</option>
                    <option value="PT">Portugal 🇵🇹</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ink-400 uppercase ml-2">Ciudad / Provincia</span>
                  <select name="city" value={formData.city} onChange={handleChange} required className="w-full bg-ink-50 border border-ink-200 rounded-xl py-3.5 px-4 text-sm outline-none focus:border-brand-600 focus:bg-white font-bold">
                    <option value="">Selecciona tu ciudad...</option>
                    {formData.country === 'ES'
                      ? SPAIN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)
                      : PORTUGAL_DISTRICTS.map((p) => <option key={p} value={p}>{p}</option>)}
                    <option value="Otra">Otra (especificar en dirección)</option>
                  </select>
                </div>
                <Field label="Código postal" name="zip" value={formData.zip} onChange={handleChange} required placeholder="28001" />
                <Field label="Dirección completa" name="address" value={formData.address} onChange={handleChange} required placeholder="Calle, número, piso..." />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-4 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 text-lg shadow-xl ${paymentMethod === 'cod' ? 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/30' : 'bg-ink-900 hover:bg-ink-800 shadow-ink-900/30'}`}
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : paymentMethod === 'cod' ? 'Confirmar pedido' : 'Ir al pago'}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Conexión encriptada SSL
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100"
              >
                <CheckCircle2 className="w-14 h-14 text-emerald-600" />
              </motion.div>
              <h3 className="text-3xl font-black text-ink-900 mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>¡Gracias por tu pedido!</h3>
              <p className="text-ink-500 mb-2 text-sm">
                Hemos recibido tu pedido <strong className="text-ink-900">#{savedOrderId}</strong>. En breve recibirás un email de confirmación.
              </p>
              <p className="text-ink-500 mb-8 text-sm">
                Te contactaremos por WhatsApp para confirmar el envío en las próximas 24-48h.
              </p>
              {paymentMethod === 'cod' && (
                <div className="bg-brand-50 text-brand-700 px-6 py-4 rounded-2xl inline-block font-bold border-2 border-brand-100 mb-8">
                  Prepárate: el repartidor cobrará {savedTotal}€
                </div>
              )}
              <button onClick={onClose} className="w-full bg-ink-900 text-white py-4 rounded-xl font-bold text-base hover:bg-ink-800 transition-colors">
                Continuar comprando
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  icon: Icon,
  hint,
}: {
  label: string;
  name: keyof Customer;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: typeof Mail;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-ink-400 uppercase ml-2">{label}</span>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          required={required}
          placeholder={placeholder}
          className={`w-full bg-ink-50 border border-ink-200 rounded-xl py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-sm outline-none focus:border-brand-600 focus:bg-white transition-all font-bold`}
        />
      </div>
      {hint && <p className="text-[10px] text-ink-400 ml-2">{hint}</p>}
    </div>
  );
}


