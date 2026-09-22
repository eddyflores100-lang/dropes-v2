import type { Metadata } from "next";
import { Inter_Tight, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dropes — Objetos de diseño, enviados a tu puerta",
  description:
    "Tienda de curaduría premium. Envío gratis en 24-48h a toda España y Portugal. Contra reembolso, tarjeta o Bizum. 30 días de devolución sin preguntas.",
  keywords: [
    "dropes", "tienda online", "diseño", "hogar", "envío gratis",
    "españa", "portugal", "contra reembolso", "curaduría",
  ],
  authors: [{ name: "Dropes" }],
  openGraph: {
    title: "Dropes — Objetos de diseño, enviados a tu puerta",
    description:
      "Tienda de curaduría premium. Envío gratis en 24-48h a España y Portugal.",
    url: "https://dropes.example.com",
    siteName: "Dropes",
    type: "website",
    locale: "es_ES",
  },
  alternates: { canonical: "https://dropes.example.com/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${fraunces.variable} ${mono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
