import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: {
    default: "Futebolista — Futebol brasileiro em um só lugar",
    template: "%s · Futebolista"
  },
  description:
    "Tabelas, rodadas e estatísticas do futebol brasileiro (Séries A, B, C e D). Atualizado rodada a rodada, sem apostas — só futebol de verdade.",
  keywords: [
    "brasileirão",
    "tabela brasileirão",
    "série a",
    "série b",
    "série c",
    "série d",
    "futebol brasileiro",
    "classificação",
    "rodada"
  ]
};

export const viewport: Viewport = {
  themeColor: "#0b1510"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
