import Link from "next/link";
import BrandBadge from "@/components/ui/BrandBadge";
import { offers } from "@/data/offers";

const AppLogos = () => {
  return (
    <section className="py-12">
      <div className="container">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-body-color">
          Les applications référencées
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {offers.map((offer) => (
            <Link
              key={offer.slug}
              href={`/offre/${offer.slug}`}
              className="flex items-center gap-3 opacity-80 duration-300 hover:opacity-100"
              title={offer.name}
            >
              <BrandBadge offer={offer} size={40} />
              <span className="text-sm font-medium text-black dark:text-white">
                {offer.name}
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center text-base font-medium text-body-color">
          … et bien plus encore
        </p>
      </div>
    </section>
  );
};

export default AppLogos;
