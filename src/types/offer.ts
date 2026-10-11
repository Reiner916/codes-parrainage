/** Slug de catégorie. Libre (string) pour pouvoir créer des catégories
 *  depuis le panel admin sans toucher au code. */
export type CategorySlug = string;

export type Offer = {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Courte accroche affichée sous le nom */
  tagline: string;
  /** La prime mise en avant, ex: "Jusqu'à 100€ offerts" */
  reward: string;
  /** Le code de parrainage à copier */
  code: string;
  /** Lien d'inscription / parrainage */
  ctaUrl: string;
  /** Couleur de marque (pour le badge logo) */
  color: string;
  /** Logo optionnel (chemin dans /public). Sinon initiale colorée. */
  logo?: string;
  /** true = logo "app-icon" (a déjà son fond) → affiché plein cadre sur une tuile
   *  de la couleur de marque. false/absent = logo transparent → tuile blanche. */
  logoFill?: boolean;
  /** Étapes pour profiter de l'offre */
  steps: string[];
  /** Conditions à remplir */
  conditions: string[];
  /** Paragraphe descriptif (SEO + confiance) */
  details: string;
  /** Date de dernière vérification, ex: "Juin 2026" */
  verifiedAt: string;
  /** Mise en avant en page d'accueil ("épinglé en top offre") */
  popular?: boolean;
  /** Ordre d'affichage dans "Top offres" (plus petit = plus haut) */
  order?: number;
  /** Brouillon : masqué du site public, visible seulement dans l'admin */
  hidden?: boolean;
};

export type Category = {
  slug: CategorySlug;
  label: string;
  /** Phrase d'intro de la page catégorie */
  description: string;
  /** Emoji / pictogramme léger */
  icon: string;
};
