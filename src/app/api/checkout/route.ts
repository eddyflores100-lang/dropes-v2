import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import products from '@/data/products.json';
import { createCheckout } from '@/lib/order-service';
import { getAgentRefFromCookie, resolveAgentByCode } from '@/lib/dropea-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET() { return NextResponse.json({paymentMethods:['cod'],commissionEligibility:'verified_delivery_only'}); }
export async function POST(req:Request) {
  if(process.env.CHECKOUT_ENABLED!=='true') return NextResponse.json({ok:false,error:'Los pedidos aún no están habilitados. Contacta con la tienda.'},{status:503});
  try {
    if(Number(req.headers.get('content-length')||0)>32000) return NextResponse.json({ok:false,error:'Pedido demasiado grande'},{status:413});
    const raw=await req.text(); if(raw.length>32000) return NextResponse.json({ok:false,error:'Pedido demasiado grande'},{status:413});
    const body=JSON.parse(raw);
    const ref=typeof body.referralCode==="string" && body.referralCode.length<40 ? body.referralCode : await getAgentRefFromCookie();
    const agent=await resolveAgentByCode(ref);
    const result=await createCheckout(db,body,req.headers.get('idempotency-key')||'',agent?.id||null,products);
    return NextResponse.json(result,{status:201});
  } catch(error) {
    if(error instanceof SyntaxError || (error instanceof Error && (error.name==='ZodError' || !error.name.startsWith('Prisma')))) return NextResponse.json({ok:false,error:'Revisa los datos, cantidades y productos del pedido. Si cambiaste la cesta, inicia un pedido nuevo.'},{status:400});
    return NextResponse.json({ok:false,error:'No pudimos guardar el pedido. Conservamos tu cesta para que puedas reintentar.'},{status:503});
  }
}
