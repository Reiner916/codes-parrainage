import SectionTitle from "@/components/Common/SectionTitle";
import LiquidCard from "@/components/ui/LiquidCard";

const steps = [
  {
    n: "1",
    title: "Choisis ton offre",
    text: "Parcours les banques, néobanques et plateformes crypto, et compare les primes de bienvenue.",
  },
  {
    n: "2",
    title: "Copie le code",
    text: "Récupère le code de parrainage vérifié en un clic, directement sur la fiche de l'offre.",
  },
  {
    n: "3",
    title: "Profite de ta prime",
    text: "Inscris-toi avec le code, remplis les conditions et touche ta prime. C'est tout.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="comment-ca-marche"
      className="scroll-mt-24 py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="Comment ça marche"
          paragraph="Toucher une prime de parrainage n'a jamais été aussi simple. Trois étapes suffisent."
          center
          mb="60px"
        />
        <div className="flex flex-wrap justify-center gap-8">
          {steps.map((step) => (
            <LiquidCard key={step.n} width={280} height={210} radius={28}>
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white dark:text-black">
                  {step.n}
                </div>
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-base leading-relaxed text-black/60 dark:text-white/70">
                  {step.text}
                </p>
              </div>
            </LiquidCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
