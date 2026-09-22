"use client";

const REVIEWS = [
  {
    name: "María G.",
    location: "Madrid",
    avatar: "M",
    color: "bg-pink-500",
    text: "El envío fue súper rápido, me llegó al día siguiente. El producto es tal cual se describe. Muy contenta con la compra.",
  },
  {
    name: "Carlos M.",
    location: "Valencia",
    avatar: "C",
    color: "bg-brand-cobalt",
    text: "Poder pagar contra reembolso me dio mucha confianza. El repartidor fue muy amable. Repetiré seguro.",
  },
  {
    name: "Laura P.",
    location: "Sevilla",
    avatar: "L",
    color: "bg-emerald-600",
    text: "Tuve una duda con mi pedido y me atendieron por WhatsApp al instante. Un servicio al cliente de 10.",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-16 bg-brand-purewhite brutal-border-b" id="testimonios">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-red text-white font-mono text-xs font-black uppercase px-3 py-1 brutal-border mb-3">
              <span>★</span>
              <span>VERIFICADOS POR TRUSTPILOT & WHATSAPP</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-brand-black uppercase tracking-tight leading-none">
              LO QUE DICEN DE <span className="bg-brand-yellow px-2">NOSOTROS.</span>
            </h2>
          </div>
          <div className="bg-brand-black text-brand-yellow brutal-border px-4 py-2 font-mono text-xs font-black uppercase shadow-brutal">
            ★ 4.9 / 5 • MÁS DE 10.000 PEDIDOS ENTREGADOS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="bg-brand-cream brutal-border p-6 sm:p-8 shadow-brutal-lg flex flex-col justify-between relative"
            >
              <span className="absolute top-4 right-4 font-serif font-black text-6xl text-gray-300 leading-none select-none">
                "
              </span>
              <div>
                <div className="text-amber-500 font-mono text-lg font-black tracking-widest mb-4">
                  ★★★★★
                </div>
                <blockquote className="font-headline font-bold text-lg text-brand-black leading-snug mb-6">
                  "{r.text}"
                </blockquote>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t-2 border-brand-black">
                <div className={`w-12 h-12 brutal-border ${r.color} text-white flex items-center justify-center font-display font-black text-xl`}>
                  {r.avatar}
                </div>
                <div>
                  <p className="font-headline font-black text-sm uppercase text-brand-black">{r.name}</p>
                  <p className="font-mono text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <span>✓</span> Comprador Verificado • {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
