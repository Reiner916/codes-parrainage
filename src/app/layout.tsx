import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutShell from "./LayoutShell";
import { defaultDescription, siteName, siteUrl } from "@/lib/seo";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Codes de parrainage vérifiés (banque & crypto)`,
    template: `%s — ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "fr_FR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="fr">
      <head />
      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
