import SectionTitle from "@/components/Common/SectionTitle";
import LiquidCard from "@/components/ui/LiquidCard";

const points = [
  {
    title: "Codes vérifiés",
    text: "Chaque code est testé avant publication. On retire immédiatement les offres expirées.",
  },
  {
    title: "Mis à jour régulièrement",
    text: "Les primes évoluent souvent : on actualise les montants et les conditions en continu.",
  },
  {
    title: "100% gratuit",
    text: "Utiliser nos codes ne te coûte rien — au contraire, c'est toi qui touches la prime.",
  },
  {
    title: "Transparent",
    text: "Conditions, étapes et montants clairement affichés sur chaque fiche. Aucune mauvaise surprise.",
  },
];

const Trust = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Pourquoi nous faire confiance"
          paragraph="Un code de parrainage, c'est de l'argent réel. On met un point d'honneur à ne référencer que des offres fiables."
          center
          mb="60px"
        />
        <div className="flex flex-wrap justify-center gap-8">
          {points.map((point) => (
            <LiquidCard key={point.title} width={400} height={120} radius={28}>
              <div className="flex h-full items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/10 text-black dark:bg-white/15 dark:text-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-black/60 dark:text-white/70">
                    {point.text}
                  </p>
                </div>
              </div>
            </LiquidCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;
