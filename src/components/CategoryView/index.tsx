import Link from "next/link";
import OfferCard from "@/components/ui/OfferCard";
import { getCategory, getOffersByCategory } from "@/data/offers";
import { CategorySlug } from "@/types/offer";

const CategoryView = ({ category }: { category: CategorySlug }) => {
  const meta = getCategory(category);
  const offers = getOffersByCategory(category);

  if (!meta) return null;

  return (
    <section className="pb-16 pt-[120px] md:pb-20 md:pt-[150px] lg:pb-28 lg:pt-[180px]">
      <div className="container">
        {/* fil d'ariane */}
        <div className="mb-6 text-sm text-body-color">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span className="px-2">/</span>
          <span className="text-black dark:text-white">{meta.label}</span>
        </div>

        <div className="mb-12 max-w-[700px]">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-body-color sm:text-base">
              Codes de parrainage
            </span>
            <span className="flex items-center gap-3">
              <span>{meta.icon}</span>
              {meta.label}
            </span>
          </h1>
          <p className="text-base leading-relaxed text-body-color md:text-lg">
            {meta.description}
          </p>
        </div>

        {/* flex-wrap centré (cartes largeur fixe 300px) → écart horizontal
            serré comme la home, au lieu d'une grille qui étire les colonnes. */}
        <div className="flex flex-wrap justify-center gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryView;
