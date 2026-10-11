import { promises as fs } from "fs";
import path from "path";
import { Category, Offer } from "@/types/offer";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

export type Db = { categories: Category[]; offers: Offer[] };

export async function readDb(): Promise<Db> {
  const raw = await fs.readFile(DB_PATH, "utf8");
  const db = JSON.parse(raw) as Db;
  db.categories ??= [];
  db.offers ??= [];
  return db;
}

export async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2) + "\n", "utf8");
}

const LOGO_PREFIX = "/images/logos/";

/**
 * Supprime un fichier logo s'il est devenu orphelin (plus aucune offre ne le
 * référence) et qu'il vit bien dans le dossier des logos. Best-effort : ne
 * fait jamais échouer l'opération appelante.
 */
async function deleteLogoIfOrphan(logoPath: string | undefined, db: Db): Promise<void> {
  if (!logoPath || !logoPath.startsWith(LOGO_PREFIX)) return;
  if (db.offers.some((o) => o.logo === logoPath)) return; // encore utilisé ailleurs
  try {
    const abs = path.join(process.cwd(), "public", logoPath.replace(/^\//, ""));
    await fs.unlink(abs);
  } catch {
    // fichier déjà absent ou non supprimable → on ignore (best-effort)
  }
}

/** Transforme un texte en slug URL : "Trade Republic" → "trade-republic". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(base: string, taken: string[]): string {
  let slug = base || "offre";
  let n = 2;
  while (taken.includes(slug)) slug = `${base}-${n++}`;
  return slug;
}

/**
 * Crée ou met à jour une offre.
 * @param originalSlug slug d'origine si on édite (permet de renommer le slug).
 * @returns le slug final de l'offre enregistrée.
 */
export async function upsertOffer(
  input: Partial<Offer>,
  originalSlug?: string,
): Promise<{ slug: string }> {
  const db = await readDb();

  // Validation minimale
  const name = (input.name || "").trim();
  if (!name) throw new Error("Le nom est obligatoire.");
  if (!input.category) throw new Error("La catégorie est obligatoire.");

  const idx = originalSlug
    ? db.offers.findIndex((o) => o.slug === originalSlug)
    : -1;
  const isEdit = idx >= 0;

  // Slug : fourni, sinon dérivé du nom. Unicité garantie (hors offre éditée).
  const others = db.offers
    .filter((_, i) => i !== idx)
    .map((o) => o.slug);
  const wanted = slugify(input.slug || name);
  const slug = others.includes(wanted) ? uniqueSlug(wanted, others) : wanted;

  const clean = (arr?: string[]) =>
    (arr || []).map((s) => s.trim()).filter(Boolean);

  const offer: Offer = {
    slug,
    name,
    category: input.category,
    tagline: (input.tagline || "").trim(),
    reward: (input.reward || "").trim(),
    code: (input.code || "").trim(),
    ctaUrl: (input.ctaUrl || "").trim(),
    color: (input.color || "#191c1f").trim(),
    logo: input.logo?.trim() || undefined,
    logoFill: input.logoFill || undefined,
    steps: clean(input.steps),
    conditions: clean(input.conditions),
    details: (input.details || "").trim(),
    verifiedAt: (input.verifiedAt || "").trim(),
    popular: input.popular || undefined,
    hidden: input.hidden || undefined,
  };

  const previousLogo = isEdit ? db.offers[idx].logo : undefined;

  if (isEdit) db.offers[idx] = offer;
  else db.offers.push(offer);

  await writeDb(db);

  // Nettoyage : si le logo a changé, on supprime l'ancien fichier s'il est orphelin.
  if (isEdit && previousLogo && previousLogo !== offer.logo) {
    await deleteLogoIfOrphan(previousLogo, db);
  }

  return { slug };
}

export async function deleteOffer(slug: string): Promise<void> {
  const db = await readDb();
  const removed = db.offers.find((o) => o.slug === slug);
  db.offers = db.offers.filter((o) => o.slug !== slug);
  await writeDb(db);

  // Nettoyage du logo de l'offre supprimée s'il n'est plus utilisé ailleurs.
  await deleteLogoIfOrphan(removed?.logo, db);
}

/**
 * Réordonne les offres selon la liste de slugs fournie (glisser-déposer).
 * Les offres absentes de la liste (sécurité) sont conservées à la fin.
 */
export async function reorderOffers(slugs: string[]): Promise<void> {
  const db = await readDb();
  const bySlug = new Map(db.offers.map((o) => [o.slug, o]));
  const reordered = slugs
    .map((s) => bySlug.get(s))
    .filter((o): o is Offer => Boolean(o));
  for (const o of db.offers) {
    if (!slugs.includes(o.slug)) reordered.push(o);
  }
  db.offers = reordered;
  await writeDb(db);
}

export async function upsertCategory(
  input: Partial<Category>,
  originalSlug?: string,
): Promise<{ slug: string }> {
  const db = await readDb();

  const label = (input.label || "").trim();
  if (!label) throw new Error("Le libellé de la catégorie est obligatoire.");

  const idx = originalSlug
    ? db.categories.findIndex((c) => c.slug === originalSlug)
    : -1;
  const isEdit = idx >= 0;

  const others = db.categories
    .filter((_, i) => i !== idx)
    .map((c) => c.slug);
  const wanted = slugify(input.slug || label);
  const slug = others.includes(wanted) ? uniqueSlug(wanted, others) : wanted;

  const category: Category = {
    slug,
    label,
    description: (input.description || "").trim(),
    icon: (input.icon || "🏷️").trim(),
  };

  if (isEdit) {
    db.categories[idx] = category;
    // Si le slug de catégorie a changé, on réaffecte les offres concernées.
    if (originalSlug && originalSlug !== slug) {
      db.offers = db.offers.map((o) =>
        o.category === originalSlug ? { ...o, category: slug } : o,
      );
    }
  } else {
    db.categories.push(category);
  }

  await writeDb(db);
  return { slug };
}

export async function deleteCategory(slug: string): Promise<void> {
  const db = await readDb();
  const used = db.offers.some((o) => o.category === slug);
  if (used)
    throw new Error(
      "Cette catégorie contient des offres : déplace-les ou supprime-les d'abord.",
    );
  db.categories = db.categories.filter((c) => c.slug !== slug);
  await writeDb(db);
}
