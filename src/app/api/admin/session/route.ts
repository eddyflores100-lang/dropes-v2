import {NextResponse} from 'next/server';
import {authorizedAdmin,authorizedBearer,signSession} from '@/lib/auth-token';
export async function GET(req:Request){return NextResponse.json({ok:authorizedAdmin(req)},{status:authorizedAdmin(req)?200:401});}
export async function POST(req:Request){
 if(!authorizedBearer(req,process.env.ADMIN_API_KEY))return NextResponse.json({ok:false},{status:401});
 const response=NextResponse.json({ok:true});
 response.cookies.set('dropes_admin',signSession('admin',process.env.ADMIN_API_KEY!,undefined,3600),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:3600});
 return response;
}
export async function DELETE(req:Request){
 if(!authorizedAdmin(req))return NextResponse.json({ok:false},{status:401});
 const res=NextResponse.json({ok:true});res.cookies.delete('dropes_admin');return res;
}
