import { createHash } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { priceCart, applyDelivery, earnedCommission } from './commerce';

const customerSchema=z.object({
  first_name:z.string().trim().min(1).max(80),last_name:z.string().trim().min(1).max(100),
  email:z.string().trim().email().max(254).transform(x=>x.toLowerCase()),
  phone:z.string().trim().min(6).max(30),address:z.string().trim().min(5).max(200),
  city:z.string().trim().min(1).max(100),zip:z.string().trim().min(3).max(15),country:z.enum(['ES','PT'])
});
const orderSchema=z.object({customer:customerSchema,items:z.array(z.object({id:z.string().min(1).max(100),quantity:z.number().int().min(1).max(20)})).min(1).max(50),paymentMethod:z.literal('cod'),expectedTotal:z.number().finite().positive().optional()});
export function checkoutResponse(order:{id:string;total:number;status:string;commissionEarned:number}) {
  return {ok:true,orderId:order.id,total:order.total,status:order.status,commissionEarned:order.commissionEarned};
}
export async function createCheckout(db:PrismaClient,input:unknown,key:string,agentId:string|null,catalog:Parameters<typeof priceCart>[1]) {
  if(!/^[a-zA-Z0-9_-]{20,100}$/.test(key)) throw new Error('Identificador de pedido inválido.');
  const parsed=orderSchema.parse(input);
  const normalized={...parsed,items:[...parsed.items].sort((a,b)=>a.id.localeCompare(b.id)),agentId};
  const requestHash=createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
  const existing=await db.order.findUnique({where:{checkoutKey:key}});
  if(existing) {
    if(existing.requestHash!==requestHash) throw new Error('Este identificador pertenece a otro pedido.');
    return checkoutResponse(existing);
  }
  const priced=priceCart(parsed.items,catalog);
  if(parsed.expectedTotal !== undefined && Math.round(parsed.expectedTotal*100)!==Math.round(priced.total*100)) throw new Error("El precio del catálogo ha cambiado. Actualiza la cesta.");
  const customer=parsed.customer;
  const agent=agentId ? await db.agent.findFirst({where:{id:agentId,status:'active'}}):null;
  try {
    const order=await db.order.create({data:{checkoutKey:key,requestHash,customerName:`${customer.first_name} ${customer.last_name}`,customerEmail:customer.email,customerPhone:customer.phone,customerAddress:customer.address,customerCity:customer.city,customerZip:customer.zip,customerCountry:customer.country,total:priced.total,paymentMethod:'cod',status:'pending',apiSource:'local',agentId:agent?.id,agentCode:agent?.agentCode,commissionRate:0.1,commissionEarned:0,items:{create:priced.items}}});
    return checkoutResponse(order);
  } catch(error) {
    // A concurrent request with the same key may have committed first.
    const order=await db.order.findUnique({where:{checkoutKey:key}});
    if(order?.requestHash===requestHash) return checkoutResponse(order);
    throw error;
  }
}
const deliverySchema=z.object({orderId:z.string().min(1),eventKey:z.string().min(8).max(150),evidence:z.string().trim().min(10).max(1000),items:z.array(z.object({id:z.string(),deliveredQuantity:z.number().int().nonnegative(),returnedQuantity:z.number().int().nonnegative()})).min(1).max(50)});
export async function recordDelivery(db:PrismaClient,input:unknown) {
  const data=deliverySchema.parse(input);
  const payload=JSON.stringify({...data,items:[...data.items].sort((a,b)=>a.id.localeCompare(b.id))});
  return db.$transaction(async tx=>{
    const prior=await tx.deliveryEvent.findUnique({where:{eventKey:data.eventKey}});
    if(prior) {
      if(prior.payload!==payload) throw new Error('Event key reused for different evidence');
      return {ok:true,replayed:true};
    }
    const order=await tx.order.findUnique({where:{id:data.orderId},include:{items:true}});
    if(!order) throw new Error('Order not found');
    if(order.agentId) await tx.agent.update({where:{id:order.agentId},data:{payoutVersion:{increment:1}}});
    if(['pending','syncing','review_required','failed','cancelled'].includes(order.status)) throw new Error('Reconcile and confirm the order before recording delivery');
    const items=applyDelivery(order.items,data.items);
    const commission=order.agentId ? earnedCommission(items,order.commissionRate):0;
    const allReturned=items.every(i=>i.returnedQuantity===i.quantity);
    const allDelivered=items.every(i=>i.deliveredQuantity===i.quantity);
    const anyDelivered=items.some(i=>i.deliveredQuantity>0);
    if(!anyDelivered) throw new Error('No delivered items');
    const status=allReturned?'returned':allDelivered?'delivered':'partially_delivered';
    const claim=await tx.order.updateMany({where:{id:order.id,version:order.version},data:{version:{increment:1},status,commissionEarned:commission}});
    if(claim.count!==1) throw new Error('Concurrent order update; retry with the same event key');
    for(const i of items) await tx.orderItem.update({where:{id:i.id},data:{deliveredQuantity:i.deliveredQuantity,returnedQuantity:i.returnedQuantity}});
    await tx.deliveryEvent.create({data:{eventKey:data.eventKey,orderId:order.id,evidence:data.evidence,payload}});
    // Totals are derived from delivery records, never from browser totals or old counters.
    return {ok:true,status,commissionEarned:commission};
  });
}
export async function commissionBalance(db:PrismaClient,agentId:string) {
  const orders=await db.order.findMany({where:{agentId},include:{items:true}});
  const earnedCents=orders.reduce((s,o)=>s+Math.round(earnedCommission(o.items,o.commissionRate)*100),0);
  const reserved=await db.agentPayout.aggregate({where:{agentId,status:{in:['pending','paid']}},_sum:{amount:true}});
  return {totalEarned:earnedCents/100,available:Math.max(0,earnedCents-Math.round((reserved._sum.amount||0)*100))/100,adjustmentDue:Math.max(0,Math.round((reserved._sum.amount||0)*100)-earnedCents)/100};
}

export async function recordPayout(db:PrismaClient,input:unknown) {
 const data=z.object({agentId:z.string().min(1),payoutKey:z.string().min(12).max(150),reference:z.string().trim().min(5).max(200),amount:z.number().positive().finite()}).parse(input);
 const cents=Math.round(data.amount*100);
 if(Math.abs(data.amount*100-cents)>0.000001) throw new Error('Use two decimal places');
 return db.$transaction(async tx=>{
  await tx.agent.update({where:{id:data.agentId},data:{payoutVersion:{increment:1}}});
  const prior=await tx.agentPayout.findUnique({where:{payoutKey:data.payoutKey}});
  if(prior){if(prior.agentId!==data.agentId || prior.amount!==data.amount || prior.reference!==data.reference)throw new Error('Payout key conflict');return {ok:true,replayed:true,payoutId:prior.id};}
  const orders=await tx.order.findMany({where:{agentId:data.agentId},include:{items:true}});
  const earned=orders.reduce((s,o)=>s+Math.round(earnedCommission(o.items,o.commissionRate)*100),0);
  const used=await tx.agentPayout.aggregate({where:{agentId:data.agentId,status:{in:['paid','pending']}},_sum:{amount:true}});
  if(cents>earned-Math.round((used._sum.amount||0)*100))throw new Error('Insufficient verified delivery commission');
  const payout=await tx.agentPayout.create({data:{agentId:data.agentId,payoutKey:data.payoutKey,reference:data.reference,amount:cents/100,currency:'EUR',status:'paid'}});
  return {ok:true,payoutId:payout.id};
 });
}
