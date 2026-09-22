import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "DROPEA® — Bold Editorial High-Impact Shop",
  description:
    "Tienda de productos virales con envío gratis 24/48h a España y Portugal. Pago contra reembolso disponible. 30 días de prueba garantizados.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
