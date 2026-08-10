import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TruePass — One Link. Trusted Identity.",
  description:
    "Ton identité professionnelle en un seul lien. Crée ton TrustLink et partage ton passeport numérique.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL
      ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
      : "http://localhost:3000"
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-navy">
        {children}
      </body>
    </html>
  );
}
