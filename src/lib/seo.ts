import type { Metadata } from "next";

/** URL publique du site. À définir dans .env.local (NEXT_PUBLIC_SITE_URL)
 *  le jour de la mise en ligne. Fallback = localhost en dev. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "Codes Parrainage";

export const defaultDescription =
  "Trouve les meilleurs codes de parrainage du moment (banque, néobanque, crypto). Codes vérifiés, primes à jour : touche ta prime de bienvenue.";

/** URL absolue à partir d'un chemin relatif. */
export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

type BuildMeta = {
  title: string;
  description?: string;
  /** chemin relatif de la page, ex: "/offre/revolut" */
  path?: string;
  /** ne pas indexer (ex: pages admin) */
  noindex?: boolean;
};

/**
 * Construit un objet Metadata complet (canonical + Open Graph + Twitter).
 * L'image de partage est fournie automatiquement par app/opengraph-image.tsx.
 */
/** Image de partage générée par la route /og (1200×630). */
const ogImage = {
  url: absoluteUrl("/og"),
  width: 1200,
  height: 630,
  alt: "Codes de parrainage vérifiés — banque, néobanque & crypto",
};

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
  noindex = false,
}: BuildMeta): Metadata {
  const url = absoluteUrl(path);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      siteName,
      title,
      description,
      locale: "fr_FR",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
