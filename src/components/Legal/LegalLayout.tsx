import Link from "next/link";

type LegalLayoutProps = {
  title: string;
  /** Date de dernière mise à jour, ex: "8 juillet 2026". */
  updatedAt?: string;
  children: React.ReactNode;
};

/**
 * Gabarit commun des pages légales (mentions légales, confidentialité,
 * cookies, affiliation). Reprend le style des autres pages du site :
 * section avec padding pour le header fixe + container centré.
 */
export default function LegalLayout({
  title,
  updatedAt,
  children,
}: LegalLayoutProps) {
  return (
    <section className="pb-16 pt-[120px] md:pb-20 md:pt-[150px] lg:pb-28 lg:pt-[180px]">
      <div className="container">
        {/* Fil d'ariane */}
        <div className="mb-8 text-sm text-body-color">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <span className="px-2">/</span>
          <span className="text-black dark:text-white">{title}</span>
        </div>

        <div className="mx-auto max-w-[820px]">
          <h1 className="mb-4 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            {title}
          </h1>
          {updatedAt && (
            <p className="mb-10 text-sm text-body-color dark:text-body-color-dark">
              Dernière mise à jour : {updatedAt}
            </p>
          )}

          <div className="legal-content space-y-6 text-base leading-relaxed text-body-color dark:text-body-color-dark">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
