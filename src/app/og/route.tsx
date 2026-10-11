import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";

export const contentType = "image/png";

// Police Inter (celle du site) chargée localement pour Satori.
const fontDir = path.join(process.cwd(), "public", "fonts");
const interRegular = readFileSync(path.join(fontDir, "Inter-Regular.ttf"));
const interBold = readFileSync(path.join(fontDir, "Inter-Bold.ttf"));

// Image d'aperçu de partage (1200×630), référencée par le helper SEO
// pour TOUTES les pages. Reprend la DA du site : fond sombre + aurora
// indigo/violet/magenta + Inter + pills en verre.
export function GET() {
  // Marques mises en avant (ordre populaire) + un chip qui montre qu'il y a plus.
  const brands = ["Revolut", "Boursorama", "Coinbase"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          backgroundColor: "#06060e",
          backgroundImage:
            "radial-gradient(1000px circle at 88% 8%, rgba(178,66,200,0.55), transparent 60%), radial-gradient(1000px circle at 6% 96%, rgba(70,92,255,0.50), transparent 58%), radial-gradient(700px circle at 50% 50%, rgba(120,80,220,0.16), transparent 70%)",
          fontFamily: "Inter",
          color: "#ffffff",
        }}
      >
        {/* Titre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 94,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -3,
          }}
        >
          <div style={{ display: "flex" }}>Les meilleurs codes</div>
          <div style={{ display: "flex" }}>de parrainage.</div>
        </div>

        {/* Sous-titre */}
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 34,
            fontWeight: 400,
            color: "rgba(255,255,255,0.70)",
          }}
        >
          Banque · Néobanque · Crypto — ta prime de bienvenue, à jour.
        </div>

        {/* Rangée de pills marques + chip "plus" */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 54 }}>
          {brands.map((b) => (
            <div
              key={b}
              style={{
                display: "flex",
                padding: "15px 30px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.16)",
                fontSize: 29,
                fontWeight: 500,
                color: "rgba(255,255,255,0.90)",
              }}
            >
              {b}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              padding: "15px 30px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.92)",
              fontSize: 29,
              fontWeight: 700,
              color: "#06060e",
              whiteSpace: "nowrap",
            }}
          >
            + d'autres
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 800, style: "normal" },
      ],
    },
  );
}
