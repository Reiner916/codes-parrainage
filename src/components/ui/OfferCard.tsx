import Link from "next/link";
import { Offer } from "@/types/offer";
import BrandBadge from "./BrandBadge";
import LiquidCard from "./LiquidCard";

const OfferCard = ({ offer }: { offer: Offer }) => {
  return (
    <Link href={`/offre/${offer.slug}`} className="inline-flex">
      <LiquidCard width={300} height={204} radius={28}>
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-center gap-4">
            <BrandBadge offer={offer} />
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">{offer.name}</h3>
              <p className="truncate text-sm text-black/55 dark:text-white/60">
                {offer.tagline}
              </p>
            </div>
          </div>

          <p className="text-2xl font-bold">{offer.reward}</p>

          <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/15">
            <span className="text-xs text-black/50 dark:text-white/55">
              Vérifié · {offer.verifiedAt}
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold">
              Voir le code
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </LiquidCard>
    </Link>
  );
};

export default OfferCard;
