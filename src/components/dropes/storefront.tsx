'use client';
import {useEffect,useMemo,useState} from 'react';
import products from '@/data/products.json';
import {useCart} from '@/lib/cart-store';
import styles from './storefront.module.css';
export function Storefront(){
 const [query,setQuery]=useState(''); const [category,setCategory]=useState('Todos');
 const [limit,setLimit]=useState(12); const [ready,setReady]=useState(false);
 const count=useCart(s=>s.items.reduce((n,i)=>n+i.quantity,0));
 useEffect(()=>{setReady(true);const ref=new URLSearchParams(location.search).get('ref');if(ref && /^DROPES-[A-Z0-9]{4,20}$/.test(ref))sessionStorage.setItem('dropes-ref',ref);},[]);
 const visible=useMemo(()=>products.filter(p=>(category==='Todos'||p.category===category)&&p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())),[query,category]);
 return <main className={styles.shop}>
  <div className={styles.strip}>ESPAÑA · PORTUGAL &nbsp; / &nbsp; PAGO CONTRA REEMBOLSO</div>
  <header className={styles.header}><a href="/" className={styles.logo}>DROPES<span>®</span></a><nav aria-label="Principal"><a href="#catalogo">Productos</a><a href="/agentes">Afiliados</a><a href="/ayuda">Ayuda</a><button data-open-cart>Cesta ({ready?count:0})</button></nav></header>
  <section className={styles.hero}><div><p className={styles.eyebrow}>TU CASA. TU RITMO.</p><h1>Pequeños cambios.<br/><em>Más comodidad.</em></h1><p>Encuentra accesorios para tu hogar, cocina y día a día. Elige tus productos y solicita tu pedido sin pagar por adelantado.</p><a className={styles.cta} href="#catalogo">EXPLORAR PRODUCTOS ↗</a></div><aside><span>ASÍ DE SIMPLE</span><ol><li>Elige lo que necesitas.</li><li>Solicita tu pedido.</li><li>Confirmamos disponibilidad y entrega.</li><li>Paga cuando lo recibas.</li></ol><a href="/ayuda">Consulta las condiciones →</a></aside></section>
  <section id="catalogo" className={styles.catalog}><div className={styles.catalogHeading}><div><p className={styles.eyebrow}>ENCUENTRA TU PRÓXIMO FAVORITO</p><h2>El catálogo.</h2></div><label>Buscar productos<input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12)}} placeholder="Cocina, auriculares, hogar…"/></label></div>
  <div className={styles.categories} aria-label="Categorías">{['Todos',...new Set(products.map(p=>p.category))].map(c=><button aria-pressed={category===c} key={c} onClick={()=>{setCategory(c);setLimit(12)}}>{c}</button>)}</div>
  <p>{visible.length} productos · Precios en euros</p>
  <div className={styles.grid}>{visible.slice(0,limit).map(p=><article key={p.id} className={styles.card}><div className={styles.image}><img src={p.image} alt={p.name} loading="lazy" referrerPolicy="no-referrer"/></div><small>{p.category}</small><h3>{p.name}</h3><div className={styles.buy}><strong>{Number(p.priceNow).toFixed(2).replace('.',',')} €</strong><button data-product-id={p.id} aria-label={`Añadir ${p.name}`}>Añadir +</button></div></article>)}</div>
  {!visible.length&&<p role="status">No encontramos productos. Prueba otra búsqueda o categoría.</p>}
  {visible.length>limit&&<button className={styles.more} onClick={()=>setLimit(limit+12)}>VER MÁS PRODUCTOS ↓</button>}</section>
  <section className={styles.affiliate}><div><p className={styles.eyebrow}>COMPARTE LO QUE TE GUSTA</p><h2>Recomienda. Acompaña.<br/>Gana por entregas reales.</h2><p>El 10% del valor de los productos entregados y verificados. Las solicitudes, envíos y cancelaciones no generan una comisión pagable.</p></div><a className={styles.cta} href="/agentes/registro">CONOCER EL PROGRAMA ↗</a></section>
  <footer className={styles.footer}><strong>DROPES · AliceLabs</strong><a href="/ayuda">Pedidos y atención</a><a href="/agentes/login">Acceso afiliados</a><span>Disponibilidad y entrega sujetas a confirmación.</span></footer>
 </main>
}
