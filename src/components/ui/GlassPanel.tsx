"use client";

import {
  CSSProperties,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { displacementMap } from "@/components/LiquidGlass/utils";

/**
 * GlassPanel = EXACTEMENT le rendu de la pill du hero (composant LiquidGlass),
 * mais EN FLUX (sans le centrage forcé top/left 50% + translate de la lib).
 * On reprend ses balises exactes : filtre SVG de déformation par instance,
 * couche "warp" (backdrop + filter url) et les 2 couches de bord lumineux.
 * Déformation visible sur Chromium (Chrome/Edge/Opera).
 */

// Aligné sur le preset CARTE (displacement 100, blur ~20px, saturation 140)
const DISPLACE = 100; // displacementScale
const AB = 2; // aberrationIntensity
const SAT = 140; // saturation
const BLUR = 18; // px (≈ blurAmount 0.5 du preset carte)

const GlassFilter = ({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) => (
  <svg style={{ position: "absolute", width, height }} aria-hidden="true">
    <defs>
      <filter
        id={id}
        x="-35%"
        y="-35%"
        width="170%"
        height="170%"
        colorInterpolationFilters="sRGB"
      >
        <feImage
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="DISPLACEMENT_MAP"
          href={displacementMap}
          preserveAspectRatio="xMidYMid slice"
        />
        <feColorMatrix
          in="DISPLACEMENT_MAP"
          type="matrix"
          values="0.3 0.3 0.3 0 0
                  0.3 0.3 0.3 0 0
                  0.3 0.3 0.3 0 0
                  0 0 0 1 0"
          result="EDGE_INTENSITY"
        />
        <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
          <feFuncA type="discrete" tableValues={`0 ${AB * 0.05} 1`} />
        </feComponentTransfer>
        <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={DISPLACE * -1}
          xChannelSelector="R"
          yChannelSelector="B"
          result="RED_DISPLACED"
        />
        <feColorMatrix
          in="RED_DISPLACED"
          type="matrix"
          values="1 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="RED_CHANNEL"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={DISPLACE * (-1 - AB * 0.05)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="GREEN_DISPLACED"
        />
        <feColorMatrix
          in="GREEN_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                  0 1 0 0 0
                  0 0 0 0 0
                  0 0 0 1 0"
          result="GREEN_CHANNEL"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={DISPLACE * (-1 - AB * 0.1)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="BLUE_DISPLACED"
        />
        <feColorMatrix
          in="BLUE_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 1 0 0
                  0 0 0 1 0"
          result="BLUE_CHANNEL"
        />
        <feBlend
          in="GREEN_CHANNEL"
          in2="BLUE_CHANNEL"
          mode="screen"
          result="GB_COMBINED"
        />
        <feBlend
          in="RED_CHANNEL"
          in2="GB_COMBINED"
          mode="screen"
          result="RGB_COMBINED"
        />
        <feGaussianBlur
          in="RGB_COMBINED"
          stdDeviation={Math.max(0.1, 0.5 - AB * 0.1)}
          result="ABERRATED_BLURRED"
        />
        <feComposite
          in="ABERRATED_BLURRED"
          in2="EDGE_MASK"
          operator="in"
          result="EDGE_ABERRATION"
        />
        <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feComposite
          in="CENTER_ORIGINAL"
          in2="INVERTED_MASK"
          operator="in"
          result="CENTER_CLEAN"
        />
        <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
      </filter>
    </defs>
  </svg>
);

type Props = {
  children: ReactNode;
  className?: string;
  radius?: number;
  style?: CSSProperties;
};

const GlassPanel = ({ children, className = "", radius = 24, style }: Props) => {
  const filterId = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setSize({ width: el.offsetWidth, height: el.offsetHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Preset CARTE : pas de "penchement" vers le curseur (elasticity 0).
  // Le survol active seulement la déformation/réfraction.
  const handleEnter = () => setHover(true);
  const handleLeave = () => setHover(false);

  const isFirefox =
    typeof navigator !== "undefined" &&
    navigator.userAgent.toLowerCase().includes("firefox");

  const ringBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    padding: "1.5px",
    pointerEvents: "none",
    WebkitMask:
      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    boxShadow:
      "0 0 0 0.5px rgba(255,255,255,0.5) inset, 0 1px 3px rgba(255,255,255,0.25) inset, 0 1px 4px rgba(0,0,0,0.35)",
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative ${className}`}
      style={{ borderRadius: radius, ...style }}
    >
      {hover && (
        <GlassFilter id={filterId} width={size.width} height={size.height} />
      )}

      {/* boîte de verre (clippée) : warp déformé + teinte */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          borderRadius: radius,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            // Déformation appliquée UNIQUEMENT au survol (perf : 1 filtre à la fois)
            filter: hover && !isFirefox ? `url(#${filterId})` : undefined,
            backdropFilter: `blur(${BLUR}px) saturate(${SAT}%)`,
            WebkitBackdropFilter: `blur(${BLUR}px) saturate(${SAT}%)`,
          }}
        />
        <span className="absolute inset-0 bg-white/55 dark:bg-white/[0.04]" />
      </div>

      {/* contenu net */}
      <div className="relative z-[1] h-full">{children}</div>

      {/* couche de bord 1 (exacte lib) */}
      <span
        style={{
          ...ringBase,
          mixBlendMode: "screen",
          opacity: 0.5,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.12) 33%, rgba(255,255,255,0.4) 66%, rgba(255,255,255,0.0) 100%)",
        }}
      />
      {/* couche de bord 2 (exacte lib) */}
      <span
        style={{
          ...ringBase,
          mixBlendMode: "overlay",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.32) 33%, rgba(255,255,255,0.6) 66%, rgba(255,255,255,0.0) 100%)",
        }}
      />
    </div>
  );
};

export default GlassPanel;
