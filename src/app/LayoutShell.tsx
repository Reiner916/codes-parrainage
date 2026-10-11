"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { usePathname } from "next/navigation";
import { Providers } from "./providers";

/**
 * Coquille client du site : gère le thème et masque le header/footer
 * public sur le panel admin (/admin). Isolée du layout racine pour que
 * ce dernier reste un composant serveur (nécessaire pour exporter
 * `metadata`).
 */
export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <Providers>
      {isAdmin ? (
        children
      ) : (
        <>
          {/* Fond aurora FIXE : refracté par le liquid glass, reflet vivant au scroll */}
          <div className="aurora-bg fixed inset-0 -z-10" aria-hidden="true" />
          <div className="relative">
            <Header />
            {children}
            <Footer />
          </div>
          <ScrollToTop />
        </>
      )}
    </Providers>
  );
}
