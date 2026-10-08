import test from 'node:test';
import assert from 'node:assert/strict';
const domain = await import('../src/lib/commerce.ts');
const catalog = [{id:'sku',name:'Producto',priceNow:'19.95',original_cost:'5',image:'',stock:4}];
test('server catalog overrides browser price and rejects unknown products', () => {
  assert.equal(typeof domain.priceCart, 'function');
  assert.equal(domain.priceCart([{id:'sku',quantity:2,priceNow:'0.01'}],catalog).total,39.90);
  assert.throws(()=>domain.priceCart([{id:'missing',quantity:1}],catalog));
});
test('rejects negative, fractional, duplicate and overstock quantities',()=>{
  assert.equal(typeof domain.priceCart, 'function');
  for(const quantity of [-1,0,1.2,5,NaN,Infinity,'2']) assert.throws(()=>domain.priceCart([{id:'sku',quantity}],catalog));
  assert.throws(()=>domain.priceCart([{id:'sku',quantity:1},{id:'sku',quantity:1}],catalog));
});
test('only verified delivered items earn commission, returns remove eligibility',()=>{
  assert.equal(typeof domain.earnedCommission, 'function');
  const items=[{priceNow:19.95,quantity:4,deliveredQuantity:2,returnedQuantity:0}];
  assert.equal(domain.earnedCommission(items,0.1),3.99);
  assert.equal(domain.earnedCommission([{...items[0],deliveredQuantity:0}],0.1),0);
  assert.equal(domain.earnedCommission([{...items[0],returnedQuantity:2}],0.1),0);
  assert.throws(()=>domain.earnedCommission([{...items[0],deliveredQuantity:5}],0.1));
});
test('delivery update is cumulative, monotonic and bounded by purchased quantities',()=>{
  assert.equal(typeof domain.applyDelivery, 'function');
  const items=[{id:'line',priceNow:10,quantity:3,deliveredQuantity:0,returnedQuantity:0}];
  const next=domain.applyDelivery(items,[{id:'line',deliveredQuantity:1,returnedQuantity:0}]);
  assert.equal(domain.earnedCommission(next,0.1),1);
  assert.deepEqual(domain.applyDelivery(next,[{id:'line',deliveredQuantity:1,returnedQuantity:0}]),next);
  assert.throws(()=>domain.applyDelivery(next,[{id:'line',deliveredQuantity:0,returnedQuantity:0}]));
  assert.throws(()=>domain.applyDelivery(items,[{id:'other',deliveredQuantity:1,returnedQuantity:0}]));
});
test('signed sessions reject raw IDs, tampering, expiry and wrong signing key', async()=>{
  const auth=await import('../src/lib/auth-token.ts');
  assert.equal(typeof auth.signSession,'function');
  const key='a'.repeat(40); const token=auth.signSession('agent-1',key,1000);
  assert.equal(auth.verifySession(token,key,1001),'agent-1');
  assert.equal(auth.verifySession('agent-1',key,1001),null);
  assert.equal(auth.verifySession(token+'x',key,1001),null);
  assert.equal(auth.verifySession(token,'b'.repeat(40),1001),null);
  assert.equal(auth.verifySession(token,key,1000+31*86400),null);
});

test('admin authentication rejects unauthenticated requests and cross-site cookie mutations', async()=>{
 const {authorizedAdmin,signSession}=await import('../src/lib/auth-token.ts');
 process.env.ADMIN_API_KEY='admin-secret-'.repeat(4);
 assert.equal(authorizedAdmin(new Request('https://shop.test/api/orders')),false);
 const shortToken=signSession('admin',process.env.ADMIN_API_KEY,1000,3600);
 const {verifySession}=await import('../src/lib/auth-token.ts');
 assert.equal(verifySession(shortToken,process.env.ADMIN_API_KEY,4600),null);
 const token=signSession('admin',process.env.ADMIN_API_KEY);
 assert.equal(authorizedAdmin(new Request('https://shop.test/api/orders',{method:'PATCH',headers:{cookie:`dropes_admin=${token}`,origin:'https://evil.test'}})),false);
 assert.equal(authorizedAdmin(new Request('https://shop.test/api/orders',{method:'PATCH',headers:{cookie:`dropes_admin=${token}`,origin:'https://shop.test'}})),true);
 delete process.env.ADMIN_API_KEY;
});

test('interrupted fulfillment needs a stale claim and provider evidence to reconcile',()=>{
 const at=new Date(1000000);
 assert.throws(()=>domain.validateReconciliation(at,'Provider checked: no active shipment',1000001));
 assert.throws(()=>domain.validateReconciliation(at,'',2000000));
 assert.equal(domain.validateReconciliation(at,'Provider checked: no active shipment',2000000),'Provider checked: no active shipment');
});
