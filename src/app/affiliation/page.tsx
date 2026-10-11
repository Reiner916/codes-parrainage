import Link from "next/link";
import LegalLayout from "@/components/Legal/LegalLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Transparence sur l'affiliation",
  description:
    "Comment ce site se rémunère : liens de parrainage et d'affiliation, et pourquoi cela ne change rien pour vous.",
  path: "/affiliation",
});

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-3 text-xl font-bold text-black dark:text-white">
    {children}
  </h2>
);

export default function AffiliationPage() {
  return (
    <LegalLayout title="Transparence sur l'affiliation" updatedAt="8 juillet 2026">
      <section>
        <H2>Comment ce site se rémunère</H2>
        <p>
          Ce site est un annuaire gratuit de codes de parrainage. Pour rester
          gratuit, il utilise des liens de <strong>parrainage</strong> et d&apos;
          <strong>affiliation</strong>. Lorsque vous ouvrez un compte ou
          souscrivez à une offre via l&apos;un de ces liens, l&apos;éditeur du
          site et/ou vous-même pouvez percevoir une prime ou une commission.
        </p>
      </section>

      <section>
        <H2>Cela ne change rien pour vous</H2>
        <p>
          Ces liens n&apos;entraînent <strong>aucun surcoût</strong>. Le plus
          souvent, ils vous permettent au contraire de bénéficier d&apos;une
          prime de bienvenue réservée aux parrainages. Nous nous efforçons de
          référencer les offres les plus avantageuses, mais la présence
          d&apos;une offre ne constitue pas un conseil en investissement.
        </p>
      </section>

      <section>
        <H2>Des informations indicatives</H2>
        <p>
          Les primes, conditions et codes affichés sont donnés à titre
          indicatif et peuvent évoluer à tout moment. Ils ne sont pas
          contractuels : seules les conditions officielles de chaque partenaire
          font foi. Vérifiez-les toujours sur le site du partenaire avant de
          souscrire.
        </p>
        <p>
          Pour plus de détails, consultez nos{" "}
          <Link
            href="/mentions-legales"
            className="text-primary hover:underline"
          >
            mentions légales
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
