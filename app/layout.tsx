import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Flight Logbook — Juan Manuel Cantone",
  description: "Private Pilot Flight Logbook Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-navy-900 text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
