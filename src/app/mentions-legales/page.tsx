import Link from "next/link";
import LegalLayout from "@/components/Legal/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mentions légales",
  description:
    "Mentions légales du site : éditeur, hébergeur, propriété intellectuelle et transparence sur les liens de parrainage et d'affiliation.",
  path: "/mentions-legales",
});

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 text-xl font-bold text-black dark:text-white">
    {children}
  </h2>
);

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="8 juillet 2026">
      <section>
        <H2>Éditeur du site</H2>
        <p>
          Le présent site est édité par <strong>Amir Chouchane</strong>.
          <br />
          Email de contact :{" "}
          <a
            href="mailto:am.ch951@gmail.com"
            className="text-primary hover:underline"
          >
            am.ch951@gmail.com
          </a>
        </p>
      </section>

      <section>
        <H2>Directeur de la publication</H2>
        <p>Amir Chouchane</p>
      </section>

      <section>
        <H2>Hébergeur</H2>
        <p>
          Le site est hébergé par <strong>[NOM DE L&apos;HÉBERGEUR]</strong>.
          <br />
          Adresse : [ADRESSE DE L&apos;HÉBERGEUR]
          <br />
          Téléphone : [TÉLÉPHONE DE L&apos;HÉBERGEUR]
        </p>
      </section>

      <section>
        <H2>Transparence — liens de parrainage et d&apos;affiliation</H2>
        <p>
          Ce site est un annuaire de codes de parrainage. Il peut contenir des
          liens de <strong>parrainage</strong> et d&apos;
          <strong>affiliation</strong> : lorsqu&apos;un visiteur ouvre un compte
          ou souscrit via l&apos;un de ces liens, l&apos;éditeur du site et/ou le
          visiteur peuvent percevoir une prime ou une commission, sans surcoût
          pour le visiteur.
        </p>
        <p>
          Les informations (primes, conditions, codes) sont fournies à titre
          indicatif et peuvent évoluer. Elles ne sont pas contractuelles :
          seules les conditions officielles de chaque partenaire font foi. Nous
          vous invitons à les vérifier sur le site du partenaire avant toute
          souscription.
        </p>
      </section>

      <section>
        <H2>Propriété intellectuelle</H2>
        <p>
          L&apos;ensemble des contenus présents sur ce site (textes, mise en
          page, logo) est protégé par le droit de la propriété intellectuelle.
          Les marques, logos et noms de produits cités appartiennent à leurs
          propriétaires respectifs et sont utilisés à des fins d&apos;
          information.
        </p>
      </section>

      <section>
        <H2>Données personnelles &amp; cookies</H2>
        <p>
          Le traitement de vos données est détaillé dans notre{" "}
          <Link
            href="/confidentialite"
            className="text-primary hover:underline"
          >
            politique de confidentialité
          </Link>{" "}
          et notre{" "}
          <Link href="/cookies" className="text-primary hover:underline">
            politique de cookies
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
