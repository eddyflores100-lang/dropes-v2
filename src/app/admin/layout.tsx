'use client';
import {useEffect,useState} from 'react';
export default function AdminLayout({children}:{children:React.ReactNode}){
 const [allowed,setAllowed]=useState(false);const [key,setKey]=useState('');const [error,setError]=useState('');
 useEffect(()=>{fetch('/api/admin/session').then(r=>setAllowed(r.ok)).catch(()=>setError('No se pudo verificar el acceso'));},[]);
 if(allowed)return <><div style={{padding:12,background:'#edfc65',color:'#111'}}><button onClick={async()=>{await fetch('/api/admin/session',{method:'DELETE'});setAllowed(false)}}>Cerrar sesión administrativa</button> · <a href="/admin/entregas">Entregas y comisiones</a></div>{children}</>;
 return <main style={{maxWidth:440,margin:'80px auto',padding:24}}><h1>Administración DROPES</h1><p>Introduce tu clave administrativa. Nunca uses una clave pública de frontend.</p><form onSubmit={async e=>{e.preventDefault();const r=await fetch('/api/admin/session',{method:'POST',headers:{Authorization:`Bearer ${key}`}});setKey('');setAllowed(r.ok);if(!r.ok)setError('Acceso no autorizado');}}><label>Clave administrativa<input type="password" autoComplete="off" required value={key} onChange={e=>setKey(e.target.value)} style={{display:'block',padding:12,border:'1px solid',width:'100%'}}/></label><button style={{marginTop:20,padding:12}}>Entrar</button><p role="alert">{error}</p></form></main>
}
