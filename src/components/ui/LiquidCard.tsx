"use client";

import { ReactNode } from "react";
import LiquidGlass from "@/components/LiquidGlass";
import { GLASS_CARD } from "./glassPresets";

/**
 * Carte avec le VRAI <LiquidGlass> (preset CARTE). Pattern "fantôme" : un clone
 * invisible donne les dimensions au wrapper, le glass se superpose centré.
 * width + height FIXES → toutes les cartes ont la même taille (cohérence).
 */
const PAD = "24px";

const LiquidCard = ({
  children,
  width = 300,
  height,
  radius = GLASS_CARD.cornerRadius,
  className = "",
}: {
  children: ReactNode;
  width?: number;
  height?: number;
  radius?: number;
  className?: string;
}) => {
  const inner = (
    <div
      style={{ width, height }}
      className="flex h-full flex-col text-black dark:text-white"
    >
      {children}
    </div>
  );

  return (
    <div className={`relative inline-flex align-top ${className}`}>
      {/* fantôme : donne les dimensions exactes au wrapper */}
      <div className="invisible" style={{ padding: PAD }} aria-hidden="true">
        {inner}
      </div>
      {/* vrai liquid glass, centré sur le fantôme */}
      <LiquidGlass
        {...GLASS_CARD}
        cornerRadius={radius}
        padding={PAD}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      >
        {inner}
      </LiquidGlass>
    </div>
  );
};

export default LiquidCard;
