import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authorizedAdmin } from '@/lib/auth-token';
import { recordDelivery } from '@/lib/order-service';
export const runtime='nodejs';
export async function POST(req:Request) {
  if(!authorizedAdmin(req)) return NextResponse.json({ok:false,error:'Unauthorized'},{status:401});
  try {return NextResponse.json(await recordDelivery(db,await req.json()));}
  catch {return NextResponse.json({ok:false,error:'Entrega inválida o en conflicto. Verifica pedido, cantidades, referencia y evidencia.'},{status:409});}
}
