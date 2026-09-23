/**
 * PaymentMethods.tsx — Payment + shipping info section.
 */
import { CreditCard, Truck, RotateCcw, ShieldCheck, Wallet, Banknote } from 'lucide-react';

const METHODS = [
  { icon: Banknote, title: 'Contra reembolso', desc: 'Paga en efectivo al recibir el pedido. Solo España y Portugal península.' },
  { icon: CreditCard, title: 'Tarjeta de crédito/débito', desc: 'Visa, Mastercard, American Express. Pago seguro mediante pasarela certificada.' },
  { icon: Wallet, title: 'Bizum', desc: 'Paga al instante con Bizum desde tu banco. Sin comisiones.' },
  { icon: ShieldCheck, title: 'PayPal', desc: 'Protección al comprador incluida con cada transacción.' },
];

const SHIPPING = [
  { icon: Truck, title: 'Envío gratis', desc: 'En todos los pedidos a España península y Portugal. Sin mínimo.' },
  { icon: RotateCcw, title: 'Devoluciones', desc: '30 días para devolver sin preguntas. Gastos de envío a cargo nuestro.' },
];

export default function PaymentMethods() {
  return (
    <section id="payment-methods" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-3 inline-block">Envíos y pago</span>
          <h2 className="text-3xl sm:text-5xl font-black text-ink-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Paga como <span className="text-brand-600">prefieras</span>
          </h2>
          <p className="text-ink-500 mt-4 max-w-2xl mx-auto">
            Múltiples métodos de pago seguros y envío gratuito en todos los pedidos. Tu pedido está cubierto de principio a fin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {METHODS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-ink-50 rounded-2xl border border-ink-100">
              <div className="p-3 bg-white text-brand-600 rounded-xl shrink-0 border border-ink-100">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-ink-900 mb-1">{title}</h3>
                <p className="text-sm text-ink-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SHIPPING.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-gradient-to-br from-brand-50 to-white rounded-2xl border border-brand-100">
              <div className="p-3 bg-brand-600 text-white rounded-xl shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-ink-900 mb-1">{title}</h3>
                <p className="text-sm text-ink-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
