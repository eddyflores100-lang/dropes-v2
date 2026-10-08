/** Amounts are computed in integer cents; only trusted delivery quantities earn commission. */
export type DeliveryItem = { id?: string; priceNow: number; quantity: number; deliveredQuantity: number; returnedQuantity: number };
export function priceCart(input: unknown, catalog: readonly {id:string;name:string;priceNow:string;image?:string;original_cost?:string;stock?:number}[]) {
  if (!Array.isArray(input) || !input.length || input.length > 50) throw new Error('La cesta debe contener entre 1 y 50 productos.');
  const seen = new Set<string>();
  const items = input.map(raw => {
    if (!raw || typeof raw.id !== 'string' || seen.has(raw.id)) throw new Error('Producto inválido o duplicado.');
    seen.add(raw.id);
    const p = catalog.find(p => p.id === raw.id);
    if (!p) throw new Error('Producto no disponible.');
    const quantity = raw.quantity;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20 || (p.stock !== undefined && quantity > p.stock)) throw new Error('Cantidad no disponible.');
    const cents = Math.round(Number(p.priceNow.replace(',', '.')) * 100);
    if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 10000000) throw new Error('Precio no disponible.');
    return {productId:p.id,name:p.name,priceNow:cents/100,quantity,image:p.image || null};
  });
  const total = items.reduce((sum,p)=>sum+Math.round(p.priceNow*100)*p.quantity,0)/100;
  return {items,total};
}
export function earnedCommission(items: readonly DeliveryItem[], rate:number) {
  if (!Number.isFinite(rate) || rate < 0 || rate > 1) throw new Error('Invalid commission rate');
  let cents=0;
  for(const i of items) {
    if (![i.quantity,i.deliveredQuantity,i.returnedQuantity].every(Number.isSafeInteger) || i.quantity < 1 || i.deliveredQuantity < 0 || i.deliveredQuantity > i.quantity || i.returnedQuantity < 0 || i.returnedQuantity > i.deliveredQuantity || !Number.isFinite(i.priceNow) || i.priceNow <= 0) throw new Error('Invalid delivery quantities');
    cents += Math.round(i.priceNow*100)*(i.deliveredQuantity-i.returnedQuantity);
  }
  return Math.round(cents*rate)/100;
}
export function applyDelivery<T extends DeliveryItem>(items: readonly T[], updates: unknown): T[] {
  if (!Array.isArray(updates) || !updates.length || updates.length > items.length) throw new Error('Delivery items required');
  const seen=new Set<string>();
  const result=items.map(i=>({...i}));
  for(const update of updates) {
    if (!update || typeof update.id !== 'string' || seen.has(update.id)) throw new Error('Invalid delivery item');
    seen.add(update.id);
    const i=result.find(i=>i.id===update.id);
    if (!i || !Number.isSafeInteger(update.deliveredQuantity) || !Number.isSafeInteger(update.returnedQuantity) || update.deliveredQuantity < i.deliveredQuantity || update.returnedQuantity < i.returnedQuantity) throw new Error('Delivery cannot move backwards');
    i.deliveredQuantity=update.deliveredQuantity; i.returnedQuantity=update.returnedQuantity;
  }
  earnedCommission(result,0.1);
  return result;
}

export function validateReconciliation(updatedAt:Date, evidence:unknown, now=Date.now()) {
  if(now-updatedAt.getTime()<15*60*1000) throw new Error('Espera 15 minutos desde el inicio del envío antes de reconciliar.');
  if(typeof evidence!=='string' || evidence.trim().length<10 || evidence.length>1000) throw new Error('Registra la evidencia de la comprobación con el proveedor (10–1000 caracteres).');
  return evidence.trim();
}
