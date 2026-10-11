import Link from "next/link";
import LegalLayout from "@/components/Legal/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de confidentialité",
  description:
    "Comment nous traitons vos données personnelles : données collectées, finalités, durée de conservation et vos droits (RGPD).",
  path: "/confidentialite",
});

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 text-xl font-bold text-black dark:text-white">
    {children}
  </h2>
);

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="8 juillet 2026">
      <section>
        <p>
          Cette politique explique quelles données personnelles sont traitées
          lorsque vous naviguez sur ce site, dans quel but, et quels sont vos
          droits conformément au Règlement général sur la protection des données
          (RGPD).
        </p>
      </section>

      <section>
        <H2>Responsable du traitement</H2>
        <p>
          Le responsable du traitement est l&apos;éditeur du site (voir les{" "}
          <Link
            href="/mentions-legales"
            className="text-primary hover:underline"
          >
            mentions légales
          </Link>
          ). Pour toute question relative à vos données :{" "}
          <a
            href="mailto:am.ch951@gmail.com"
            className="text-primary hover:underline"
          >
            am.ch951@gmail.com
          </a>
          .
        </p>
      </section>

      <section>
        <H2>Données collectées</H2>
        <p>
          Ce site ne nécessite pas de création de compte visiteur et ne collecte
          pas de nom, ni d&apos;adresse email des visiteurs. Sont traitées :
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Données de mesure d&apos;audience anonymisées</strong> :
            nombre de clics et de copies de codes de parrainage, afin de
            connaître les offres populaires et d&apos;améliorer le site.
          </li>
          <li>
            <strong>Données techniques</strong> susceptibles d&apos;être
            enregistrées par l&apos;hébergeur (adresse IP, journaux de
            connexion) à des fins de sécurité et de bon fonctionnement.
          </li>
        </ul>
        <p>
          [Si vous ajoutez un outil de statistiques (ex : Google Analytics,
          Plausible) ou un formulaire de contact, complétez cette section en
          conséquence.]
        </p>
      </section>

      <section>
        <H2>Finalités et base légale</H2>
        <p>
          Les données sont traitées pour mesurer l&apos;audience du site et en
          assurer la sécurité, sur la base de l&apos;intérêt légitime de
          l&apos;éditeur et/ou de votre consentement pour les traceurs non
          essentiels (voir la{" "}
          <Link href="/cookies" className="text-primary hover:underline">
            politique de cookies
          </Link>
          ).
        </p>
      </section>

      <section>
        <H2>Durée de conservation</H2>
        <p>
          Les données de mesure d&apos;audience sont conservées pour une durée
          n&apos;excédant pas 13 mois. Les journaux techniques
          sont conservés selon la politique de l&apos;hébergeur.
        </p>
      </section>

      <section>
        <H2>Partage des données</H2>
        <p>
          Vos données ne sont pas vendues. Elles peuvent être traitées par nos
          prestataires techniques (hébergeur, éventuel outil de statistiques)
          agissant en tant que sous-traitants.
        </p>
      </section>

      <section>
        <H2>Vos droits</H2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;
          effacement, de limitation et d&apos;opposition sur vos données. Pour
          les exercer, écrivez à{" "}
          <a
            href="mailto:am.ch951@gmail.com"
            className="text-primary hover:underline"
          >
            am.ch951@gmail.com
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL
          (
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </section>
    </LegalLayout>
  );
}
