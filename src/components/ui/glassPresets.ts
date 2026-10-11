/**
 * ─────────────────────────────────────────────────────────────
 *  PRESETS LIQUID GLASS — toute l'esthétique du verre se règle ICI.
 *  (props passées au composant <LiquidGlass>)
 * ─────────────────────────────────────────────────────────────
 */

/** Preset "CARTE" : reflets animés au survol, mais l'élément ne bouge pas
 *  (elasticity 0). Fort displacement + frosté. Pour les conteneurs/cartes. */
export const GLASS_CARD = {
  displacementScale: 100,
  blurAmount: 0.5,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0,
  cornerRadius: 32,
  mode: "standard" as const,
};

/** Preset "BOUTON" : vraiment animé, se penche/étire vers le curseur
 *  (elasticity 0.35), flou léger, pill arrondie. Pour les éléments cliquables. */
export const GLASS_BUTTON = {
  displacementScale: 64,
  blurAmount: 0.1,
  saturation: 130,
  aberrationIntensity: 2,
  elasticity: 0.35,
  cornerRadius: 100,
  mode: "standard" as const,
};
