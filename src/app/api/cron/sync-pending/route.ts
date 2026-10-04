import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authorizedBearer } from '@/lib/auth-token';
import { dropeaV1CreateOrder, dropeaV2CreateOrder } from '@/lib/dropea-server';
export const runtime='nodejs';
export async function POST(req:Request) {
  if(!authorizedBearer(req,process.env.CRON_SECRET)) return NextResponse.json({ok:false,error:'Unauthorized'},{status:401});
  if(process.env.FULFILLMENT_ENABLED!=='true' || !['v1','v2'].includes(process.env.DROPEA_ORDER_API||'')) return NextResponse.json({ok:false,error:'Validate the provider contract and configure fulfillment first'},{status:503});
  const pending=await db.order.findMany({where:{status:'pending',syncAttempts:0,apiSource:'local'},include:{items:true},take:25,orderBy:{createdAt:'asc'}});
  const results: Array<{orderId:string;ok:boolean}>=[];
  for(const order of pending) {
    const claimed=await db.order.updateMany({where:{id:order.id,version:order.version,status:'pending',syncAttempts:0},data:{status:'syncing',version:{increment:1},syncAttempts:{increment:1}}});
    if(!claimed.count) continue;
    const customer={firstName:order.customerName.split(' ')[0],lastName:order.customerName.split(' ').slice(1).join(' '),email:order.customerEmail,phone:order.customerPhone,address:order.customerAddress,city:order.customerCity,zip:order.customerZip,country:order.customerCountry};
    const payload={customer,items:order.items.map(i=>({productId:i.productId,name:i.name,price:i.priceNow,quantity:i.quantity})),total:order.total,paymentMethod:order.paymentMethod};
    const v1=process.env.DROPEA_ORDER_API==='v1';
    const result=v1 ? await dropeaV1CreateOrder({...payload,shop:process.env.DROPEA_SHOP_ID}) : await dropeaV2CreateOrder({...payload,shopId:process.env.DROPEA_SHOP_ID});
    // An ambiguous timeout must NEVER cascade to a second API or repeat automatically.
    await db.order.updateMany({where:{id:order.id,version:order.version+1,status:'syncing'},data:{version:{increment:1},status:result.ok?'confirmed':'review_required',partnerOrderId:result.orderId||null,apiSource:v1?'dropea-v1':'dropea-v2',lastSyncError:result.ok?null:'Reconcile with provider before retrying'}});
    results.push({orderId:order.id,ok:result.ok});
  }
  return NextResponse.json({ok:true,results});
}

export const GET=POST; // Vercel cron uses GET, still authenticated.
