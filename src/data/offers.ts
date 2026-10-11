import { Category, Offer } from "@/types/offer";
import db from "./db.json";

/**
 * ─────────────────────────────────────────────────────────────
 *  LE CERVEAU DU SITE
 *  Tout (accueil, pages catégories, pages offre, recherche) s'affiche
 *  à partir de ces données. La source de vérité est `src/data/db.json`,
 *  édité via le panel admin (/admin) — plus besoin de toucher au code.
 *
 *  Ce fichier ne fait que LIRE db.json et exposer les helpers.
 *  L'écriture se fait côté serveur (src/lib/db.ts + routes /api/admin).
 * ─────────────────────────────────────────────────────────────
 */

const data = db as { categories: Category[]; offers: Offer[] };

export const categories: Category[] = data.categories;

/** Offres visibles sur le site public (les brouillons `hidden` sont exclus). */
export const offers: Offer[] = data.offers.filter((o) => !o.hidden);

// ───────────────── Helpers ─────────────────
export const getOffer = (slug: string) =>
  offers.find((o) => o.slug === slug);

export const getOffersByCategory = (category: string) =>
  offers.filter((o) => o.category === category);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

/** Offres épinglées en "Top offres", dans l'ordre du tableau (réordonnable
 *  par glisser-déposer depuis le panel admin). */
export const popularOffers = () => offers.filter((o) => o.popular);
