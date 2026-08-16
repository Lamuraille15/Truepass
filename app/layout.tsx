import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TruePass — Votre identité. Votre confiance.",
  description:
    "Permettre à chacun de prouver qui il est, ce qu'il sait faire et ce qui l'a accompli.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL
      ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
      : "http://localhost:3000"
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} min-h-screen bg-white text-gelap`}>
        {children}
      </body>
    </html>
  );
}
