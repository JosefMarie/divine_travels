import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const phitagate = localFont({
  src: "./fonts/Phitagate-Regular.otf",
  variable: "--font-brand",
});

const gebuk = localFont({
  src: "./fonts/Gebuk-Regular.ttf",
  variable: "--font-heading",
});

const bingo = localFont({
  src: "./fonts/BingoRegular-aYJ8m.otf",
  variable: "--font-body",
});

const zighead = localFont({
  src: "./fonts/Zighead.otf",
  variable: "--font-technical",
});

const voyage = localFont({
  src: "./fonts/Voyage.otf",
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "Divine's Destinations | Technical Luxury Travel",
  description: "A technical exploration of the world's most curated landscapes. Documenting the intersection of elite luxury and geographic precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${phitagate.variable} ${gebuk.variable} ${bingo.variable} ${zighead.variable} ${voyage.variable} antialiased`}>
      <body className="min-h-screen bg-neutral selection:bg-primary/20 selection:text-primary font-body">
        {children}
      </body>
    </html>
  );
}

