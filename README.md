# DROPES — tienda y programa de afiliados

Tienda en español para España y Portugal, con catálogo, búsqueda, cesta, solicitudes contra reembolso, panel de afiliados y registro de entregas verificadas.

## Regla comercial

**Solo los productos entregados y verificados generan comisión pagable.** La tasa actual es el 10% del precio de venta de esos productos. Solicitar, confirmar, cobrar o enviar un pedido no acredita comisión. Una entrega parcial habilita únicamente las unidades entregadas. Las devoluciones ajustan el saldo, incluidos pagos históricos pendientes de reconciliar.

## Desarrollo

Node 24, npm y PostgreSQL. `npm ci`, copiar `.env.example` a `.env`, configurar la base y ejecutar `npx prisma generate`. Para una base NUEVA: `npx prisma db push`. Después `npm run dev`.

No ejecutar `db push --accept-data-loss` en producción. Para una base existente leer [la migración](docs/migrations/2026-10-03-commerce.sql) y [la guía de operación](docs/COMMERCIAL-READINESS.md).

- `npm test`: pruebas de negocio con base SQLite temporal aislada y cliente generado; no toca PostgreSQL de producción.
- `npm run typecheck`: comprobación TypeScript estricta.
- `npm run build`: compilación de producción, sin ocultar errores de tipos.
- GitHub Actions ejecuta también las pruebas de pedidos sobre PostgreSQL 16 efímero.

## Flujo real

1. La cesta manda identificadores y cantidades. El servidor resuelve precios del catálogo y valida el total presentado.
2. Una clave de idempotencia conserva el pedido frente a un reintento de red.
3. La solicitud se guarda localmente antes de cualquier envío al proveedor; la UI solo muestra éxito cuando recibe una referencia real.
4. El trabajo autenticado de fulfillment toma el pedido una sola vez. No alterna APIs ni reintenta una respuesta ambigua: la deja para reconciliación.
5. Un administrador registra evidencia y cantidades acumuladas de entrega. Un afiliado no puede hacerlo.
6. El saldo se calcula a partir de las entregas, no de contadores históricos. Un registro de pago exige saldo suficiente y referencia de transferencia.

## Rutas

`/` tienda · `/ayuda` atención · `/agentes` programa · `/admin/pedidos` pedidos · `/admin/entregas` entregas y pagos · `/admin/productos` exportación de catálogo.

El acceso administrativo utiliza una cookie firmada y requiere `ADMIN_API_KEY`. Las claves permanecen en el servidor. Las sesiones antiguas basadas en un ID dejan de ser válidas.

## Estado de publicación

La implementación puede compilarse y probarse sin conectar una cuenta del proveedor. Eso no certifica una integración real con Dropea. Checkout y fulfillment permanecen cerrados por configuración hasta completar la lista de aceptación. El registro de pagos **no transfiere dinero**; documenta transferencias externas realizadas por el operador.

No hay cobro con tarjeta implementado. No se prometen emails automáticos, plazos de transporte garantizados, reseñas verificadas ni existencias en tiempo real sin una fuente operativa que los respalde.
