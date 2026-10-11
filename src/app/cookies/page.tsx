import Link from "next/link";
import LegalLayout from "@/components/Legal/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de cookies",
  description:
    "Quels cookies et traceurs sont utilisés sur ce site, à quoi ils servent et comment gérer votre consentement.",
  path: "/cookies",
});

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 text-xl font-bold text-black dark:text-white">
    {children}
  </h2>
);

export default function CookiesPage() {
  return (
    <LegalLayout title="Politique de cookies" updatedAt="8 juillet 2026">
      <section>
        <p>
          Un cookie est un petit fichier déposé sur votre appareil lors de la
          visite d&apos;un site. Cette page décrit les cookies et traceurs
          utilisés sur ce site.
        </p>
      </section>

      <section>
        <H2>Cookies strictement nécessaires</H2>
        <p>
          Ces cookies sont indispensables au fonctionnement du site et ne
          nécessitent pas votre consentement. Ils incluent notamment le cookie
          de session de l&apos;espace d&apos;administration et la mémorisation de
          vos préférences d&apos;affichage (ex : thème clair/sombre).
        </p>
      </section>

      <section>
        <H2>Cookies de mesure d&apos;audience</H2>
        <p>
          [À compléter si vous ajoutez un outil de statistiques. Si l&apos;outil
          est configuré sans cookie et de façon anonyme, précisez-le. Sinon, ces
          cookies ne sont déposés qu&apos;après votre consentement.]
        </p>
      </section>

      <section>
        <H2>Cookies tiers (parrainage / affiliation)</H2>
        <p>
          Lorsque vous cliquez sur un lien vers un partenaire, ce dernier peut
          déposer ses propres cookies afin d&apos;attribuer le parrainage ou
          l&apos;affiliation. Ces cookies sont régis par la politique de
          confidentialité du partenaire concerné.
        </p>
      </section>

      <section>
        <H2>Gérer vos cookies</H2>
        <p>
          Vous pouvez à tout moment configurer votre navigateur pour accepter ou
          refuser les cookies, ou les supprimer. [Si vous mettez en place un
          bandeau de consentement, indiquez ici comment modifier vos choix.]
        </p>
        <p>
          Pour en savoir plus sur le traitement de vos données, consultez notre{" "}
          <Link
            href="/confidentialite"
            className="text-primary hover:underline"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
