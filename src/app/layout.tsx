import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

// Plus Jakarta Sans 900 not available in Google Fonts variable; use 800 as max
// In CSS we use font-black (900) which maps to 800 via font-synthesis

export const metadata: Metadata = {
  title: "DROPEA® — Bold Editorial High-Impact Shop",
  description:
    "Tienda de productos virales con envío gratis 24/48h a España y Portugal. Pago contra reembolso disponible. 30 días de prueba garantizados.",
  keywords: ["dropea", "tienda online", "contra reembolso", "envío gratis", "españa", "portugal"],
  authors: [{ name: "Dropea" }],
  openGraph: {
    title: "DROPEA® — Bold Editorial High-Impact Shop",
    description:
      "Productos virales con envío gratis 24/48h. Pago contra reembolso disponible.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${grotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
