"use client";

import { MessageCircle, Mail, Warehouse } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-brand-black text-brand-purewhite pt-16 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16 pb-12 border-b-2 border-white/10">
          {/* Brand Pitch */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="font-display font-black text-4xl text-brand-purewhite tracking-tighter uppercase inline-block">
              DROPEA<span className="text-brand-red">.</span>
            </a>
            <p className="font-body text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
              La tienda de confianza para productos que marcan tendencia. Pagas cuando recibes tu paquete directamente en tus manos en cualquier punto de España y Portugal.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-brand-yellow text-brand-black font-mono font-bold text-xs px-2.5 py-1 brutal-border">
                SELLO DE CONFIANZA ONLINE
              </span>
              <span className="bg-brand-purewhite text-brand-black font-mono font-bold text-xs px-2.5 py-1 brutal-border">
                GARANTÍA EUROPEA
              </span>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-headline font-black text-sm uppercase text-brand-yellow tracking-wider mb-4">Catálogo</h4>
            <ul className="space-y-2 font-headline font-bold text-xs uppercase">
              <li><a href="#catalogo" className="text-gray-300 hover:text-brand-yellow transition-colors">Top Ventas</a></li>
              <li><a href="#flash-deal" className="text-gray-300 hover:text-brand-yellow transition-colors">Ofertas Salvajes</a></li>
              <li><a href="#categorias" className="text-gray-300 hover:text-brand-yellow transition-colors">Categorías</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">Rastrear mi Envío</a></li>
            </ul>
          </div>

          {/* Políticas */}
          <div>
            <h4 className="font-headline font-black text-sm uppercase text-brand-yellow tracking-wider mb-4">Garantías</h4>
            <ul className="space-y-2 font-headline font-bold text-xs uppercase">
              <li><a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">Pago Contra Reembolso</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">Devolución en 30 Días</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">Privacidad Encriptada</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-headline font-black text-sm uppercase text-brand-yellow tracking-wider mb-4">Contacto Directo</h4>
            <div className="space-y-3 font-mono text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <MessageCircle className="text-brand-yellow text-sm" />
                <span className="font-bold">WhatsApp: 24h Activo</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-brand-yellow text-sm" />
                <span>soporte@dropes.es</span>
              </div>
              <div className="flex items-center gap-2">
                <Warehouse className="text-brand-yellow text-sm" />
                <span>Hubs: Madrid & Barcelona</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-mono text-xs text-gray-500 font-bold uppercase text-center sm:text-left">
            © 2026 Dropea Shop S.L. • Todos los derechos reservados. Comercio electrónico seguro.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs font-black">
            <span className="bg-brand-purewhite text-black px-2 py-0.5 brutal-border">CONTRA REEMBOLSO</span>
            <span className="bg-brand-purewhite text-black px-2 py-0.5 brutal-border">BIZUM</span>
            <span className="bg-brand-purewhite text-black px-2 py-0.5 brutal-border">VISA</span>
            <span className="bg-brand-purewhite text-black px-2 py-0.5 brutal-border">MASTERCARD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
