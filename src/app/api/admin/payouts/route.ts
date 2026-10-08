import {NextResponse} from 'next/server';
import {authorizedAdmin} from '@/lib/auth-token';
import {db} from '@/lib/db';
import {recordPayout} from '@/lib/order-service';
export async function POST(req:Request){
 if(!authorizedAdmin(req))return NextResponse.json({ok:false,error:'Unauthorized'},{status:401});
 try{return NextResponse.json(await recordPayout(db,await req.json()));}catch{return NextResponse.json({ok:false,error:'Pago rechazado: comprueba saldo por entregas, referencia y duplicados.'},{status:409});}
}
