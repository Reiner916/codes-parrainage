import Link from "next/link";
import SectionTitle from "@/components/Common/SectionTitle";
import OfferCard from "@/components/ui/OfferCard";
import LiquidButton from "@/components/ui/LiquidButton";
import { popularOffers } from "@/data/offers";

const TopOffers = () => {
  // Offres épinglées en "top offre" depuis l'admin, triées par ordre.
  const offers = popularOffers();

  return (
    <section id="offres" className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Top offres du moment"
          paragraph="Les codes de parrainage les plus populaires et les plus généreux, vérifiés par nos soins."
          center
          mb="60px"
        />
        <div className="flex flex-wrap justify-center gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer.slug} offer={offer} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/offres" className="inline-flex">
            <LiquidButton padding="14px 32px">
              <span className="text-base font-semibold">Voir toutes les offres</span>
            </LiquidButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopOffers;
