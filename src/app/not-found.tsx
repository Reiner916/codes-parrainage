import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pb-16 pt-[120px] md:pb-20 md:pt-[150px] lg:pb-28 lg:pt-[180px]">
      <div className="container">
        <div className="mx-auto max-w-[600px] text-center">
          <p className="mb-4 text-6xl font-bold text-primary sm:text-7xl">404</p>
          <h1 className="mb-4 text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Page introuvable
          </h1>
          <p className="mb-9 text-base leading-relaxed text-body-color dark:text-body-color-dark">
            La page que vous cherchez n&apos;existe pas ou a été déplacée.
            Retrouvez tous les codes de parrainage vérifiés depuis l&apos;accueil.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="rounded-xs bg-primary px-8 py-3 text-base font-medium text-white duration-300 hover:bg-primary/90"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/offres"
              className="rounded-xs bg-black/5 px-8 py-3 text-base font-medium text-black duration-300 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              Voir toutes les offres
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
