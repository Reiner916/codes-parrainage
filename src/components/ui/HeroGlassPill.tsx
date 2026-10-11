"use client";

import LiquidButton from "@/components/ui/LiquidButton";

/** Pill décorative du hero — preset BOUTON (suit le curseur). */
const HeroGlassPill = () => {
  return (
    <div className="mt-10 hidden justify-center sm:flex">
      <LiquidButton padding="14px 30px">
        <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
          <span className="text-base">✦</span>
          Codes vérifiés &amp; primes à jour — Juin 2026
        </span>
      </LiquidButton>
    </div>
  );
};

export default HeroGlassPill;
