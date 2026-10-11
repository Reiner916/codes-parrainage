import type { MetadataRoute } from "next";
import { categories, offers } from "@/data/offers";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Pages fixes
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/offres"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // Pages catégories
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Pages offre (les pages qui rapportent → priorité haute)
  const offerPages: MetadataRoute.Sitemap = offers.map((o) => ({
    url: absoluteUrl(`/offre/${o.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...offerPages];
}
