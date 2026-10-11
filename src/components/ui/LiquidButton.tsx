"use client";

import { ReactNode } from "react";
import LiquidGlass from "@/components/LiquidGlass";
import { GLASS_BUTTON } from "./glassPresets";

/**
 * Bouton/pill avec le VRAI <LiquidGlass> (preset BOUTON, suit le curseur).
 * Pattern "fantôme" pour la mise en page en flux. Passe `onClick` pour activer
 * les effets de survol/clic de la lib, ou enveloppe-le dans un <Link>.
 */
const LiquidButton = ({
  children,
  onClick,
  padding = "12px 28px",
  radius = GLASS_BUTTON.cornerRadius,
  className = "",
  disableHoverGlow = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  padding?: string;
  radius?: number;
  className?: string;
  disableHoverGlow?: boolean;
}) => {
  const inner = (
    <span className="inline-flex items-center justify-center whitespace-nowrap text-black dark:text-white">
      {children}
    </span>
  );

  return (
    <span className={`relative inline-flex align-middle ${className}`}>
      {/* fantôme : dimensions */}
      <span
        className="invisible inline-flex"
        style={{ padding }}
        aria-hidden="true"
      >
        {inner}
      </span>
      {/* vrai liquid glass — onClick toujours défini pour activer les effets
          de survol + le "press" (rétrécissement au clic maintenu) de la lib */}
      <LiquidGlass
        {...GLASS_BUTTON}
        cornerRadius={radius}
        padding={padding}
        onClick={onClick ?? (() => {})}
        disableHoverGlow={disableHoverGlow}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      >
        {inner}
      </LiquidGlass>
    </span>
  );
};

export default LiquidButton;
