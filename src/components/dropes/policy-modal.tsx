"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// ─── Contenido de las políticas ─────────────────────────────────────────
const POLICIES: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  aviso: {
    title: "AVISO LEGAL",
    sections: [
      {
        h: "1. IDENTIFICACIÓN DEL TITULAR",
        p: "El sitio web dropes.shop es operado por AliceLabs LLC, sociedad de responsabilidad limitada constituida conforme a las leyes del Estado de Delaware (EE.UU.), con domicilio social en 1209 Orange Street, Wilmington, DE 19801. Número de registro: 2026-ALC-XXX. Para contactar: soporte@dropes.shop o WhatsApp 24/7 disponible en el pie de página.",
      },
      {
        h: "2. OBJETO",
        p: "El presente Aviso Legal regula el acceso, navegación y uso del sitio web dropes.shop, así como los derechos y obligaciones derivados de la relación entre AliceLabs LLC y los usuarios que accedan al portal. La utilización del sitio atribuye a quien la realiza la condición de usuario, lo que implica la aceptación de las presentes condiciones.",
      },
      {
        h: "3. ACCESO Y USO",
        p: "El acceso a dropes.shop es gratuito salvo en aquellos servicios que requieran pago previo. El usuario se compromete a utilizar el sitio de conformidad con la ley, la moral y el orden público. Queda prohibido cualquier uso que pudiera dañar, sobrecargar, deteriorar o impedir la normal utilización del portal.",
      },
      {
        h: "4. PROPIEDAD INTELECTUAL",
        p: "Todos los contenidos de dropes.shop (textos, imágenes, logos, diseños, código fuente, bases de datos) son titularidad de AliceLabs LLC o de terceros que han autorizado su uso, y están protegidos por la legislación nacional e internacional sobre propiedad intelectual e industrial. Queda prohibida la reproducción total o parcial sin autorización expresa por escrito.",
      },
      {
        h: "5. RESPONSABILIDAD",
        p: "AliceLabs LLC no se hace responsable de los daños derivados del uso incorrecto del sitio, ni de los contenidos enlazados desde terceros. Los productos mostrados pueden variar en disponibilidad, precio y características. Las imágenes son orientativas y pueden no corresponderse exactamente con el producto final.",
      },
      {
        h: "6. LEY APLICABLE Y JURISDICCIÓN",
        p: "El presente Aviso Legal se rige por la legislación española y europea aplicable al comercio electrónico. Para la resolución de conflictos, las partes se someten a los Juzgados y Tribunales de Madrid (España), renunciando expresamente a cualquier otro fuero que pudiera corresponderles.",
      },
    ],
  },

  privacidad: {
    title: "POLÍTICA DE PRIVACIDAD",
    sections: [
      {
        h: "1. RESPONSABLE DEL TRATAMIENTO",
        p: "AliceLabs LLC, con domicilio en 1209 Orange Street, Wilmington, DE 19801 (EE.UU.), es responsable del tratamiento de los datos personales recabados a través de dropes.shop. Contacto: soporte@dropes.shop. Como encargado europeo actúa el representante designado conforme al RGPD (UE) 2016/679.",
      },
      {
        h: "2. DATOS RECABADOS",
        p: "Recabamos los siguientes datos personales: nombre y apellidos, email, teléfono, dirección completa (calle, número, código postal, ciudad, país) necesarios para procesar pedidos. Datos de navegación: dirección IP, tipo de navegador, páginas visitadas, fecha y hora de acceso, a través de cookies y tecnologías similares.",
      },
      {
        h: "3. FINALIDAD DEL TRATAMIENTO",
        p: "Los datos se utilizan para: (a) gestionar y procesar pedidos, incluida la entrega al domicilio indicado; (b) gestionar el pago contra reembolso o mediante tarjeta/Bizum; (c) enviar comunicaciones comerciales y boletines (solo si el usuario se suscribe al VIP Club); (d) prestar atención al cliente por WhatsApp y email; (e) cumplir obligaciones legales y fiscales.",
      },
      {
        h: "4. LEGITIMACIÓN",
        p: "La base legal para el tratamiento de datos es: (a) la ejecución de un contrato para los pedidos realizados; (b) el consentimiento del usuario para las comunicaciones comerciales y el uso de cookies no técnicas; (c) el cumplimiento de obligaciones legales en materia fiscal y comercial.",
      },
      {
        h: "5. CONSERVACIÓN DE DATOS",
        p: "Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados y, en cualquier caso, durante los plazos legalmente establecidos para atender posibles responsabilidades derivadas del tratamiento. Los datos de pedidos se conservan mínimo 6 años por exigencias fiscales.",
      },
      {
        h: "6. DESTINATARIOS",
        p: "Tus datos podrán ser cedidos a: (a) empresas de paquetería y mensajería para la entrega de pedidos (DHL, SEUR, Correos, GLS); (b) pasarelas de pago (Stripe, PayPal, Bizum) para procesar transacciones; (c) proveedores de Dropshipping (Dropea S.L.) para el envío directo de productos; (d) autoridades fiscales cuando sea legalmente exigible. No se cederán datos a terceros sin consentimiento salvo obligación legal.",
      },
      {
        h: "7. DERECHOS DEL USUARIO",
        p: "Como usuario tienes derecho a: (a) acceder a tus datos personales; (b) solicitar su rectificación si son inexactos; (c) solicitar su supresión cuando ya no sean necesarios; (d) solicitar la limitación del tratamiento; (e) oponerte al tratamiento; (f) solicitar la portabilidad de tus datos; (g) retirar el consentimiento prestado en cualquier momento. Para ejercer estos derechos escribe a soporte@dropes.shop.",
      },
      {
        h: "8. TRANSFERENCIAS INTERNACIONALES",
        p: "Como AliceLabs LLC está constituida en EE.UU., tus datos pueden ser transferidos a servidores ubicados en ese país. Garantizamos que dichas transferencias se realizan conforme a cláusulas contractuales tipo aprobadas por la Comisión Europea o bajo otras garantías adecuadas previstas por el RGPD.",
      },
    ],
  },

  cookies: {
    title: "POLÍTICA DE COOKIES",
    sections: [
      {
        h: "1. ¿QUÉ SON LAS COOKIES?",
        p: "Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas un sitio web. Permiten reconocer al usuario en visitas posteriores, recordar preferencias, analizar el tráfico y mejorar la experiencia de navegación.",
      },
      {
        h: "2. COOKIES PROPIAS",
        p: "dropes.shop utiliza cookies propias técnicas necesarias para el funcionamiento del sitio: dropes_cart (recuerda los productos en tu cesta durante 30 días), dropes_favorites (recuerda tus favoritos), dropes_session (mantiene tu sesión activa). Estas cookies no requieren consentimiento según la LSSI-CE.",
      },
      {
        h: "3. COOKIES DE TERCEROS",
        p: "Utilizamos cookies de terceros para análisis y marketing: Google Analytics (estadísticas anónimas de uso), Meta Pixel (segmentación publicitaria en Facebook/Instagram), Google Ads (medición de campañas). Estas cookies requieren tu consentimiento previo, que puedes dar o denegar en el banner mostrado al entrar.",
      },
      {
        h: "4. DURACIÓN",
        p: "Las cookies técnicas se eliminan al cerrar el navegador (cookies de sesión). Las cookies analíticas y de marketing persisten entre 1 y 24 meses según el proveedor. Puedes eliminarlas en cualquier momento desde la configuración de tu navegador.",
      },
      {
        h: "5. GESTIÓN DE PREFERENCIAS",
        p: "Puedes aceptar, rechazar o configurar individualmente las cookies no esenciales a través de nuestro panel de preferencias (botón flotante abajo a la derecha). También puedes configurar tu navegador para bloquear todas las cookies, aunque esto puede afectar a la funcionalidad de la tienda.",
      },
      {
        h: "6. MÁS INFORMACIÓN",
        p: "Para más información sobre cookies visita la página de la Agencia Española de Protección de Datos (www.aepd.es) o el portal de la CNMC sobre cookies. Para consultas específicas sobre nuestra política contacta: soporte@dropes.shop.",
      },
    ],
  },

  terminos: {
    title: "TÉRMINOS Y CONDICIONES",
    sections: [
      {
        h: "1. ACEPTACIÓN",
        p: "La realización de cualquier pedido en dropes.shop implica la aceptación plena de los presentes Términos y Condiciones, así como de la Política de Privacidad y la Política de Cookies. Si no estás de acuerdo con alguna cláusula, por favor no utilices el sitio.",
      },
      {
        h: "2. CUENTA DE USUARIO",
        p: "Para realizar pedidos no es necesario crear cuenta. El checkout se realiza como invitado proporcionando email y datos de envío. Toda la información proporcionada debe ser veraz. Eres responsable de mantener la confidencialidad de tus datos de acceso si los utilizaras.",
      },
      {
        h: "3. PEDIDOS",
        p: "Los pedidos se realizan a través del catálogo online. Al confirmar el pedido recibes un email con el identificador y los detalles. dropes.shop se reserva el derecho de rechazar pedidos por falta de stock, datos incompletos o sospecha de fraude, devolviendo el importe íntegro si se hubiera cobrado. Los precios mostrados incluyen IVA.",
      },
      {
        h: "4. PAGO",
        p: "Métodos aceptados: (a) Contra reembolso (pago en efectivo al mensajero, solo España península y Portugal continental); (b) Tarjeta de crédito/débito Visa, Mastercard, American Express vía Stripe; (c) Bizum. El pago contra reembolso tiene un recargo de 2€ que se muestra claramente en el checkout.",
      },
      {
        h: "5. ENVÍOS",
        p: "Envío GRATIS en pedidos superiores a 35€ a España península y Portugal continental. Para pedidos inferiores, el coste es 4,90€. Plazos: 24-48h hábiles España península, 3-5 días Portugal, 5-7 días Baleares/Canarias/Ceuta/Melilla. No enviamos a apartados de correos.",
      },
      {
        h: "6. PRODUCTOS",
        p: "Los productos mostrados pueden agotarse o cambiar de especificaciones sin previo aviso. Las imágenes son orientativas. Los colores pueden variar según la configuración de tu pantalla. Todos los productos incluyen garantía oficial del fabricante de 2 a 3 años según la categoría.",
      },
      {
        h: "7. PROPIEDAD INTELECTUAL",
        p: "Todo el contenido de dropes.shop (logos, textos, imágenes, código) es titularidad de AliceLabs LLC o de sus proveedores. Queda prohibida cualquier reproducción, distribución o modificación sin autorización expresa por escrito.",
      },
      {
        h: "8. MODIFICACIONES",
        p: "AliceLabs LLC se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones serán efectivas desde su publicación en esta página. Se recomienda revisar periódicamente este documento.",
      },
      {
        h: "9. LEY APLICABLE",
        p: "Los presentes Términos se rigen por la legislación española y de la Unión Europea. Cualquier conflicto se resolverá ante los Juzgados y Tribunales de Madrid (España), sin perjuicio de la legislación de consumo aplicable al consumidor en su país de residencia.",
      },
    ],
  },

  devoluciones: {
    title: "POLÍTICA DE DEVOLUCIONES",
    sections: [
      {
        h: "1. PLAZO DE DEVOLUCIÓN",
        p: "Dispones de 30 días naturales desde la recepción del pedido para solicitar una devolución, conforme al Real Decreto Legislativo 1/2007 de Defensa de los Consumidores. No es necesario justificar el motivo: puedes devolver el producto aunque simplemente hayas cambiado de opinión.",
      },
      {
        h: "2. CONDICIONES DEL PRODUCTO",
        p: "El producto debe devolverse en su embalaje original, sin usar, con todas las etiquetas y accesorios incluidos. Productos con signos evidentes de uso, manchados, dañados o sin embalaje original podrán ser rechazados o tener un reembolso parcial según el estado. Los productos de higiene personal no se admiten devolución por motivos de salud.",
      },
      {
        h: "3. PROCEDIMIENTO",
        p: "Para iniciar una devolución escribe a soporte@dropes.shop con tu número de pedido y el motivo. Te enviaremos una etiqueta prepagada por email. Imprímela, pégala en el paquete y entrégalo en cualquier punto de Correos o SEUR. El envío de devolución es GRATIS para el cliente.",
      },
      {
        h: "4. REEMBOLSO",
        p: "Una vez recibido y revisado el producto en nuestro almacén, procesamos el reembolso en un máximo de 14 días naturales. El importe se abona al mismo método de pago utilizado en la compra: si pagaste contra reembolso, te pediremos un IBAN para transferencia. Recibirás email de confirmación del reembolso.",
      },
      {
        h: "5. PRODUCTOS DEFECTUOSOS",
        p: "Si recibes un producto defectuoso o incorrecto, escríbenos dentro de los 7 días siguientes a la recepción con fotos del estado del paquete y producto. Te enviaremos uno nuevo sin coste o te reembolsaremos íntegramente, según tu preferencia. Los gastos de envío corren a cargo de dropes.shop.",
      },
      {
        h: "6. EXCEPCIONES",
        p: "No se admiten devoluciones de productos personalizados, productos de higiene personal desprecintados, productos perecederos, productos de higiene íntima, ni productos digitales ya descargados. Tampoco se admiten devoluciones por errores en la dirección facilitada por el cliente.",
      },
      {
        h: "7. DERECHO DE DESISTIMIENTO",
        p: "Conforme al artículo 69 y siguientes de la Ley 3/2014, tienes derecho a desistir del contrato en el plazo de 30 días sin necesidad de justificación. dropes.shop amplía el plazo legal mínimo de 14 días a 30 días para tu tranquilidad.",
      },
    ],
  },

  envios: {
    title: "POLÍTICA DE ENVÍOS",
    sections: [
      {
        h: "1. ZONAS DE ENVÍO",
        p: "Realizamos envíos a: España península (gratis en pedidos +35€), Portugal continental (gratis en pedidos +35€), Baleares (9,90€), Canarias/Ceuta/Melilla (14,90€, sin IVA, posible arancel aduanero). No enviamos a apartados de correos ni a Andorra. Para envíos internacionales contactar soporte@dropes.shop.",
      },
      {
        h: "2. PLAZOS DE ENTREGA",
        p: "España península: 24-48 horas hábiles (la mayoría de pedidos llegan en 24h si se realiza antes de las 16h). Portugal continental: 3-5 días hábiles. Baleares: 4-6 días hábiles. Canarias/Ceuta/Melilla: 5-10 días hábiles. Los plazos pueden variar en festivos y época de Black Friday/Navidad.",
      },
      {
        h: "3. AGENCIAS DE TRANSPORTE",
        p: "Trabajamos con SEUR (España península), DHL (Portugal y urgente), Correos (Baleares, Canarias, Ceuta y Melilla) y GLS (pedidos pesados). Recibirás email con número de seguimiento el mismo día de la salida del paquete desde nuestro almacén de Madrid.",
      },
      {
        h: "4. SEGUIMIENTO",
        p: "Una vez tu pedido sale del almacén recibes un email con el enlace de seguimiento. También puedes rastrear tu envío desde el enlace 'Rastrear mi Envío' en el pie de página introduciendo tu número de pedido. Las actualizaciones de estado pueden tardar hasta 12 horas en aparecer en el sistema de la agencia.",
      },
      {
        h: "5. ENTREGA CONTRA REEMBOLSO",
        p: "El pago contra reembolso está disponible para España península y Portugal continental. El mensajero cobrará el importe en efectivo al entregar el paquete. Si no estás en casa en el momento de la entrega, el mensajero dejará un aviso y realizará un segundo intento al día siguiente. Tras dos intentos fallidos, el paquete vuelve al almacén y se reembolsa el pago si lo hubiera.",
      },
      {
        h: "6. DAÑOS EN TRANSPORTE",
        p: "Si el paquete llega dañado o abierto, debes indicarlo en el albarán del mensajero antes de firmar la recepción. Escríbenos a soporte@dropes.shop con fotos en un máximo de 48 horas y gestionamos un reenvío sin coste. Sin la anotación en el albarán no podemos responsabilizarnos del daño.",
      },
      {
        h: "7. ENVÍOS INTERNACIONALES",
        p: "Para envíos a otros países de la UE o fuera de Europa, contacta con soporte@dropes.shop indicando tu dirección. Calcularemos el coste y plazo personalizado. Los envíos internacionales pueden tener aranceles o tasas de aduana que corren a cargo del destinatario.",
      },
    ],
  },

  pagos: {
    title: "POLÍTICA DE PAGOS",
    sections: [
      {
        h: "1. MÉTODOS ACEPTADOS",
        p: "Aceptamos los siguientes métodos de pago: (a) Contra reembolso: pago en efectivo al recibir el paquete (España península y Portugal continental, recargo 2€); (b) Tarjeta de crédito/débito: Visa, Mastercard, American Express vía Stripe (3D Secure obligatorio); (c) Bizum: pago inmediato desde tu banco español; (d) PayPal: con protección al comprador incluida.",
      },
      {
        h: "2. SEGURIDAD",
        p: "Todas las transacciones se procesan a través de conexiones SSL con encriptación de 256-bit. dropes.shop NO almacena los datos completos de tu tarjeta: estos se guardan cifrados en los servidores PCI-DSS de Stripe o PayPal. Cumplimos con el protocolo 3D Secure (Verified by Visa, Mastercard SecureCode) para prevenir fraudes.",
      },
      {
        h: "3. MOMENTO DEL CARGO",
        p: "Tarjeta/Bizum/PayPal: el cargo se realiza en el momento de confirmar el pedido. Si pagas contra reembolso, el pago se realiza al recibir el paquete en efectivo (sin necesidad de pasar tarjeta al mensajero). El importe en la confirmación puede verse como 'autorizado' durante 1-2 días hasta que se confirma el envío.",
      },
      {
        h: "4. MONEDA",
        p: "Todos los precios mostrados en dropes.shop están en euros (€) con IVA incluido. Si pagas con tarjeta emitida fuera de la zona euro, tu banco puede aplicar un cargo por conversión de divisa que no depende de dropes.shop. Recomendamos consultar con tu banco antes de realizar el pago.",
      },
      {
        h: "5. FACTURAS",
        p: "Tras la confirmación del pedido recibes email con la factura en PDF. Si necesitas factura con datos de empresa, indícalos en el formulario de checkout en el campo 'Datos de facturación'. Las facturas se emiten en nombre de AliceLabs LLC. Para rectificaciones, escribe a soporte@dropes.shop.",
      },
      {
        h: "6. FRAUDE",
        p: "AliceLabs LLC utiliza sistemas de detección de fraude automatizados. Si tu pedido es marcado como sospechoso, podemos solicitar documentación adicional (DNI, justificante de la tarjeta) antes de proceder al envío. La negativa a facilitar esta información conllevará la cancelación del pedido y reembolso íntegro.",
      },
      {
        h: "7. PROMOCIONES Y CUPONES",
        p: "Los cupones descuento del VIP Club (10% bienvenida) y promociones flash se aplican en el carrito antes de pagar. No se admiten cupones acumulables. Si un cupón ha expirado o no es válido para los productos seleccionados, el sistema lo notificará. Los cupones no son canjeables por dinero efectivo.",
      },
    ],
  },

  garantia: {
    title: "GARANTÍA 3 AÑOS",
    sections: [
      {
        h: "1. COBERTURA",
        p: "Todos los productos vendidos en dropes.shop incluyen garantía oficial del fabricante de 2 años, extendida por AliceLabs LLC a 3 AÑOS desde la fecha de entrega. La garantía cubre defectos de fabricación, malfunction de componentes eléctricos y electrónicos, y vicios ocultos conforme a la legislación vigente.",
      },
      {
        h: "2. QUÉ CUBRE",
        p: "La garantía cubre: (a) reparación gratuita del producto; (b) sustitución por uno igual o equivalente; (c) devolución íntegra del importe si no es reparable. Los gastos de envío al servicio técnico corren a cargo de dropes.shop durante los primeros 2 años. La garantía no cubre desgaste natural ni daños por uso incorrecto.",
      },
      {
        h: "3. QUÉ NO CUBRE",
        p: "La garantía NO cubre: (a) daños por mal uso, golpes, caídas, humedad; (b) desgaste normal de la batería tras el primer año; (c) modificaciones o reparaciones por terceros no autorizados; (d) daños por conexiones a voltajes incorrectos; (e) productos sin factura o sin número de serie legible.",
      },
      {
        h: "4. CÓMO RECLAMAR",
        p: "Para hacer efectiva la garantía escribe a soporte@dropes.shop con: (a) número de pedido; (b) descripción del problema y fotos del defecto; (c) en su caso, video del mal funcionamiento. Te enviaremos instrucciones para enviar el producto al servicio técnico. El plazo de respuesta es de 48 horas hábiles.",
      },
      {
        h: "5. RESOLUCIÓN",
        p: "Tras recibir el producto en el servicio técnico, dispondremos de 30 días naturales para: (a) reparar y devolver; (b) sustituir por uno nuevo; (c) reembolsar el importe. Si el técnico certifica que el defecto no está cubierto por garantía, te informaremos con presupuesto previo antes de cualquier reparación de pago.",
      },
      {
        h: "6. GARANTÍA LEGAL",
        p: "Esta garantía es adicional y no sustituye a los derechos que te otorga el Real Decreto Legislativo 1/2007 de Defensa de los Consumidores, que establece un mínimo de 3 años para bienes de naturaleza duradera. dropes.shop cumple y mejora estos mínimos.",
      },
    ],
  },
};

// ─── Modal component ────────────────────────────────────────────────────
export function PolicyModal() {
  const [open, setOpen] = useState(false);
  const [policyKey, setPolicyKey] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a[data-policy]");
      if (link) {
        e.preventDefault();
        const key = link.getAttribute("data-policy");
        if (key && POLICIES[key]) {
          setPolicyKey(key);
          setOpen(true);
          document.body.style.overflow = "hidden";
        }
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      setPolicyKey(null);
    }
  }, [open]);

  if (!open || !policyKey) return null;
  const policy = POLICIES[policyKey];

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(10,10,10,0.7)",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
        padding: "40px 16px",
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#FAF9F5",
          border: "2.5px solid #0A0A0A",
          boxShadow: "12px 12px 0 #0A0A0A",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "#0A0A0A",
            color: "#FFDE00",
            padding: "24px 32px",
            borderBottom: "2.5px solid #0A0A0A",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Space Grotesk, monospace",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                opacity: 0.7,
                marginBottom: 4,
              }}
            >
              dropes.shop • Documento legal
            </div>
            <h2
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 900,
                fontSize: 32,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {policy.title}
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: 48,
              height: 48,
              background: "#FF1744",
              color: "white",
              border: "2.5px solid #0A0A0A",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 22,
              flexShrink: 0,
            }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "32px" }}>
          {policy.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <h3
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 900,
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  color: "#0A0A0A",
                  marginBottom: 8,
                  borderLeft: "4px solid #FF1744",
                  paddingLeft: 12,
                }}
              >
                {section.h}
              </h3>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#374151",
                  margin: 0,
                }}
              >
                {section.p}
              </p>
            </div>
          ))}

          {/* Footer */}
          <div
            style={{
              marginTop: 32,
              padding: 16,
              background: "#0A0A0A",
              color: "#FFDE00",
              fontFamily: "Space Grotesk, monospace",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textAlign: "center",
            }}
          >
            © 2026 AliceLabs LLC • dropes.shop — Última actualización: septiembre 2026
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
