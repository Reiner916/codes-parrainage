import AllOffersView from "@/components/AllOffersView";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Toutes les offres de parrainage 2026 — Banque & Crypto",
  description:
    "Tous les codes de parrainage vérifiés : Revolut, N26, Boursorama, Sumeria, Coinbase, Trade Republic, Bitpanda. Primes de bienvenue à jour.",
  path: "/offres",
});

export default function OffresPage() {
  return <AllOffersView />;
}
