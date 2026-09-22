import fs from "node:fs";
import path from "node:path";
import { CartInteractions } from "@/components/dropes/cart-interactions";

// Server component: sirve el HTML original TAL CUAL (copia exacta).
// El componente CartInteractions (client) se engancha a los botones existentes.
export default function Home() {
  const htmlPath = path.join(process.cwd(), "public", "dropea-original.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        suppressHydrationWarning
      />
      <CartInteractions />
    </>
  );
}
