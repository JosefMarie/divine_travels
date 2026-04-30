import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-neutral selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
