/**
 * Footer.tsx — Site footer with payment methods, links, and legal.
 */
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="text-2xl font-extrabold text-white flex items-center gap-1 mb-4">
              Dropes<span className="w-2 h-2 bg-brand-600 rounded-full" />
            </a>
            <p className="text-sm leading-relaxed mb-6">
              Tienda online premium para España y Portugal. Productos seleccionados con garantía oficial de 2 años y envío gratis en 24-48h.
            </p>
            <div className="flex gap-2">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/5 hover:bg-brand-600 text-ink-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Red social">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#products-section" className="hover:text-brand-400 transition-colors">Catálogo</a></li>
              <li><a href="#categorias" className="hover:text-brand-400 transition-colors">Categorías</a></li>
              <li><a href="#products-section" className="hover:text-brand-400 transition-colors">Super Ventas</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Novedades</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#payment-methods" className="hover:text-brand-400 transition-colors">Envíos y pago</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Garantía</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-500" /> hola@dropes.example</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-500" /> +34 900 000 000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-500" /> Lun-Sáb 9-21h</li>
            </ul>
          </div>
        </div>

        <div id="payment-methods" className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Pagos aceptados</span>
            <div className="flex gap-2">
              {['Visa', 'Mastercard', 'Bizum', 'PayPal', 'COD'].map((m) => (
                <span key={m} className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-ink-300 border border-white/5">{m}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} Dropes. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
