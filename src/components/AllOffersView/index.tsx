import Link from "next/link";
import OfferCard from "@/components/ui/OfferCard";
import { categories, getOffersByCategory } from "@/data/offers";

const AllOffersView = () => {
  return (
    <section className="pb-16 pt-[120px] md:pb-20 md:pt-[150px] lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="mb-6 text-sm text-body-color">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span className="px-2">/</span>
          <span className="text-black dark:text-white">Toutes les offres</span>
        </div>

        <div className="mb-12 max-w-[700px]">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
            Toutes les offres de parrainage
          </h1>
          <p className="text-base leading-relaxed text-body-color md:text-lg">
            Tous nos codes de parrainage vérifiés, banques et crypto réunis.
            Choisis une offre et profite de ta prime de bienvenue.
          </p>
        </div>

        {categories.map((cat) => {
          const offers = getOffersByCategory(cat.slug);
          if (offers.length === 0) return null;
          return (
            <div key={cat.slug} className="mb-14">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </h2>
              </div>
              {/* flex-wrap centré (cartes largeur fixe) → écart horizontal
                  serré, comme les pages catégories. */}
              <div className="flex flex-wrap justify-center gap-6">
                {offers.map((offer) => (
                  <OfferCard key={offer.slug} offer={offer} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AllOffersView;
