import { notFound } from "next/navigation";
import { Metadata } from "next";
import CategoryView from "@/components/CategoryView";
import { categories, getCategory } from "@/data/offers";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategory(category);
  if (!meta) return { title: "Catégorie introuvable" };

  return buildMetadata({
    title: `Codes de parrainage ${meta.label} 2026 — vérifiés et à jour`,
    description: meta.description,
    path: `/${meta.slug}`,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const meta = getCategory(category);
  if (!meta) notFound();

  return <CategoryView category={category} />;
}
