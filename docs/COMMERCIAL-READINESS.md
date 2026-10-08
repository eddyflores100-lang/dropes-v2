# Cierre comercial — DROPES

## Cambios y decisiones

La tienda anterior mostraba éxito después de un temporizador. Ahora tiene un catálogo React propio y un checkout conectado al servidor. Se retiraron de la página activa el HTML de otra marca y los mensajes de compra simulada. No se eliminaron fuentes/artefactos históricos sin revisar sus consumidores.

Las rutas web y MCP crean pedidos con la misma lógica. Las herramientas MCP privadas exigen sesión del afiliado correspondiente. Un código público de referido nunca autentica una cuenta. Las APIs administrativas exigen clave o sesión firmada; las mutaciones por cookie validan origen.

No hay envío automático de emails a leads. No presentar estados internos como comunicaciones enviadas. No invertir en tráfico antes de cerrar configuración y aceptación real.

## Antes de abrir pedidos

1. Confirmar identidad comercial, dirección, contacto, condiciones de envío/devolución, precio final e información obligatoria del vendedor. La página de ayuda es operativa; no constituye revisión jurídica.
2. Verificar derechos de catálogo, imágenes y precios. Actualizar stock y decidir disponibilidad. El catálogo actual estático no reserva existencias del proveedor; la solicitud requiere confirmación.
3. Copia y restauración de PostgreSQL ensayadas. Aplicar SQL aditivo en staging; validar recuentos; luego migrar producción con copia recuperable. La migración conserva comisiones antiguas en una tabla de auditoría y pone pedidos ambiguos en revisión. No supone que las comisiones históricas fueran entregadas.
4. Configurar secretos distintos (mínimo 32 caracteres). Retirar cualquier variable NEXT_PUBLIC_CRON_SECRET y rotar el secreto si se utilizó; estaba expuesto por el diseño anterior. Las claves reales no se incluyeron en esta revisión.
5. Validar con la documentación/cuenta del proveedor los endpoints, esquema de pedidos, catálogo, límites y semántica de respuestas. Las funciones existentes se conservan como adaptadores pendientes de esta comprobación externa.
6. Ejecutar pedido controlado: guardar, sincronizar, reconciliar en proveedor, entrega parcial, entrega final y devolución. No hacer pedidos reales sin acuerdo operativo.
7. Verificar bloqueo de órdenes/admin sin sesión y afiliados de otra cuenta. Aplicar límites de abuso en el hosting a login, registro, checkout y MCP.
8. Habilitar CHECKOUT_ENABLED solo cuando el operador pueda atender las solicitudes. Habilitar FULFILLMENT_ENABLED solo después de validar el adaptador elegido. Nunca habilitar fallback v1→v2 ante un timeout.

## Entregas y pagos

En `/admin/pedidos` confirmar tras reconciliar y aportar referencia del proveedor. En `/admin/entregas` elegir pedido, aportar evidencia verificable y registrar cantidades ACUMULADAS por línea. No usar un estado “entregado” enviado por cliente. El campo evidencia registra la referencia que verificó el operador, no realiza verificación automática del transportista.

La comisión usa centavos enteros para el cálculo y redondeo por pedido. El esquema heredado almacena importes Float; migrar a enteros/Decimal a escala mayor mediante conversión explícita, no silenciosa.

Los registros de pago están serializados por afiliado y son idempotentes. Una devolución después de un pago produce ajuste pendiente, no saldo disponible artificial ni borrado de historia. El registro no envía transferencias. Revisar saldos antes de mover dinero externamente.

## Catálogo y despliegue

El endpoint de catálogo prepara un JSON descargable para revisión. No escribe archivos del bundle en un servidor efímero. Publicar el JSON revisado mediante un nuevo despliegue; los descuentos y reseñas no se inventan durante la importación.

El job de sincronización procesa solo pedidos nuevos con cero intentos. Un proceso interrumpido puede dejar un pedido en syncing; tras 15 minutos se puede reconciliar desde Pedidos: comprobar su existencia en el proveedor, registrar evidencia y confirmar con la referencia del proveedor o cancelar únicamente si no queda un envío activo. La transición usa la versión del pedido para evitar sobrescribir otra operación. No existe reconciliación automática sin contrato de proveedor verificado.

## Límites pendientes de operación

Compra y entrega reales, identidad y condiciones definitivas del vendedor, credenciales de hosting/proveedor, validación del proveedor y protección de abuso en el hosting. El código y las pruebas no reemplazan estos pasos. Mantener el checkout cerrado hasta completarlos.
