import Image from "next/image";
import { Offer } from "@/types/offer";

const BrandBadge = ({
  offer,
  size = 56,
}: {
  offer: Pick<Offer, "name" | "color" | "logo" | "logoFill">;
  size?: number;
}) => {
  // Logo "app-icon" : il a déjà son fond → tuile à la couleur de marque, plein cadre
  if (offer.logo && offer.logoFill) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-2xl"
        style={{ width: size, height: size, backgroundColor: offer.color }}
      >
        <Image
          src={offer.logo}
          alt={`Logo ${offer.name}`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // Logo sur fond transparent → tuile blanche
  if (offer.logo) {
    return (
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
        style={{ width: size, height: size }}
      >
        <Image
          src={offer.logo}
          alt={`Logo ${offer.name}`}
          width={size}
          height={size}
          className="h-full w-full object-contain p-2"
        />
      </div>
    );
  }

  // Repli : initiale sur fond de marque (façon app-icon)
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        backgroundColor: offer.color,
      }}
    >
      {offer.name.charAt(0)}
    </div>
  );
};

export default BrandBadge;
