import Link from "next/link";
import SearchBar from "@/components/ui/SearchBar";
import HeroGlassPill from "@/components/ui/HeroGlassPill";
import LiquidButton from "@/components/ui/LiquidButton";

const Hero = () => {
  return (
    <section
      id="home"
      className="pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
    >
      {/* Section transparente, SANS z-index/overflow : sinon le backdrop-filter
          du liquid glass ne refracte plus l'aurora fixe placée derrière (les
          boutons auraient un contour blanc au lieu de la couleur du fond). */}
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[820px] text-center">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-sm font-medium text-black backdrop-blur-md dark:border-white/15 dark:bg-white/10 dark:text-white">
                💸 Plus de 7 offres de parrainage vérifiées
              </span>
              <h1 className="mb-5 text-3xl font-bold leading-tight text-black drop-shadow-lg sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight dark:text-white">
                Les meilleurs codes de parrainage, vérifiés et à jour
              </h1>
              <p className="mb-10 text-base leading-relaxed! text-black/70 drop-shadow sm:text-lg md:text-xl dark:text-white/75">
                Banques, néobanques et plateformes crypto : trouve en quelques
                secondes le code et la prime de bienvenue qui te font gagner de
                l&apos;argent à l&apos;inscription.
              </p>

              <SearchBar />

              <HeroGlassPill />

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span className="text-sm text-black/55 dark:text-white/55">
                  Populaire :
                </span>
                {[
                  { slug: "revolut", name: "Revolut" },
                  { slug: "boursorama", name: "Boursorama" },
                  { slug: "n26", name: "N26" },
                  { slug: "coinbase", name: "Coinbase" },
                ].map((app) => (
                  <Link
                    key={app.slug}
                    href={`/offre/${app.slug}`}
                    className="inline-flex"
                  >
                    <LiquidButton padding="9px 20px">
                      <span className="text-sm font-medium">{app.name}</span>
                    </LiquidButton>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
