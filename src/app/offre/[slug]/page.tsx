import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BrandBadge from "@/components/ui/BrandBadge";
import CopyButton from "@/components/ui/CopyButton";
import { getCategory, getOffer, offers } from "@/data/offers";
import { absoluteUrl, buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return offers.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return { title: "Offre introuvable" };

  return buildMetadata({
    title: `Code parrainage ${offer.name} — ${offer.reward} (${offer.verifiedAt})`,
    description: `${offer.name} : ${offer.reward}. ${offer.details}`,
    path: `/offre/${offer.slug}`,
  });
}

export default async function OfferPage({ params }: Params) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();

  const category = getCategory(offer.category);

  // Fil d'ariane structuré (schema.org) → "miettes" affichées par Google.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
      ...(category
        ? [{ "@type": "ListItem", position: 2, name: category.label, item: absoluteUrl(`/${offer.category}`) }]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: offer.name,
        item: absoluteUrl(`/offre/${offer.slug}`),
      },
    ],
  };

  return (
    <section className="pb-16 pt-[120px] md:pb-20 md:pt-[150px] lg:pb-28 lg:pt-[180px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container">
        {/* fil d'ariane */}
        <div className="mb-8 text-sm text-body-color">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span className="px-2">/</span>
          <Link href={`/${offer.category}`} className="hover:text-primary">
            {category?.label}
          </Link>
          <span className="px-2">/</span>
          <span className="text-black dark:text-white">{offer.name}</span>
        </div>

        <div className="-mx-4 flex flex-wrap">
          {/* Colonne principale */}
          <div className="w-full px-4 lg:w-8/12">
            <div className="mb-8 flex items-center gap-5">
              <BrandBadge offer={offer} size={72} />
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white sm:text-4xl">
                  Code parrainage {offer.name}
                </h1>
                <p className="mt-1 text-base text-body-color">{offer.tagline}</p>
              </div>
            </div>

            <p className="mb-10 text-base leading-relaxed text-body-color md:text-lg">
              {offer.details}
            </p>

            <h2 className="mb-5 text-2xl font-bold text-black dark:text-white">
              Comment profiter de l'offre
            </h2>
            <ol className="mb-10 space-y-4">
              {offer.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white dark:text-black">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-base text-body-color">{step}</span>
                </li>
              ))}
            </ol>

            <h2 className="mb-5 text-2xl font-bold text-black dark:text-white">
              Conditions
            </h2>
            <ul className="space-y-3">
              {offer.conditions.map((cond, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-body-color">
                  <span className="mt-1 text-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                  {cond}
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne latérale : la carte action (sticky) */}
          <div className="w-full px-4 lg:w-4/12">
            <div className="sticky top-28 rounded-2xl bg-white p-8 shadow-one dark:card-glass">
              <p className="mb-1 text-sm text-body-color">Prime de bienvenue</p>
              <p className="mb-6 text-3xl font-bold text-primary">
                {offer.reward}
              </p>

              <p className="mb-2 text-sm font-medium text-black dark:text-white">
                Ton code de parrainage
              </p>
              <CopyButton code={offer.code} slug={offer.slug} className="mb-6 w-full" />

              <a
                href={offer.ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mb-4 block rounded-full bg-primary px-6 py-4 text-center text-base font-semibold text-white duration-300 hover:bg-primary/90 dark:text-black"
              >
                J'en profite →
              </a>

              <p className="flex items-center justify-center gap-1.5 text-xs text-body-color">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                Code vérifié · {offer.verifiedAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
