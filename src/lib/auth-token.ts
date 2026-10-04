import { createHmac, timingSafeEqual } from 'node:crypto';
export function signSession(id:string, secret:string, now=Math.floor(Date.now()/1000), lifetimeSeconds=30*86400) {
  if(secret.length<32) throw new Error('SESSION_SECRET must contain at least 32 characters');
  const body=Buffer.from(JSON.stringify({sub:id,exp:now+lifetimeSeconds})).toString('base64url');
  return `${body}.${createHmac('sha256',secret).update(body).digest('base64url')}`;
}
export function verifySession(token:string,secret:string,now=Math.floor(Date.now()/1000)):string|null {
  if(secret.length<32 || token.length>2048) return null;
  try {
    const [body,signature,extra]=token.split('.');
    if(!body||!signature||extra) return null;
    const expected=createHmac('sha256',secret).update(body).digest();
    const actual=Buffer.from(signature,'base64url');
    if(actual.length!==expected.length || !timingSafeEqual(actual,expected)) return null;
    const value=JSON.parse(Buffer.from(body,'base64url').toString());
    return typeof value.sub==='string' && Number.isSafeInteger(value.exp) && value.exp>now ? value.sub : null;
  } catch {return null;}
}
export function authorizedBearer(req:Request, secret:string|undefined) {
  if(!secret || secret.length<32) return false;
  const actual=Buffer.from(req.headers.get('authorization')||'');
  const expected=Buffer.from(`Bearer ${secret}`);
  return actual.length===expected.length && timingSafeEqual(actual,expected);
}
export function authorizedAdmin(req:Request) {
  if(authorizedBearer(req,process.env.ADMIN_API_KEY)) return true;
  const token=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('dropes_admin='))?.slice('dropes_admin='.length);
  if(!token || verifySession(token,process.env.ADMIN_API_KEY||'')!=='admin') return false;
  if(!['GET','HEAD'].includes(req.method) && req.headers.get('origin')!==new URL(req.url).origin) return false;
  return true;
}
