import AppLogos from "@/components/AppLogos";
import HashScroll from "@/components/Common/HashScroll";
import ScrollUp from "@/components/Common/ScrollUp";
import Faq from "@/components/Faq";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import TopOffers from "@/components/TopOffers";
import Trust from "@/components/Trust";
import { faqs } from "@/data/faq";
import { absoluteUrl, buildMetadata, siteName, siteUrl } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Codes de parrainage 2026 — Banque, Néobanque & Crypto",
  description:
    "Trouve les meilleurs codes de parrainage du moment : Revolut, N26, Boursorama, Sumeria, Coinbase, Trade Republic, Bitpanda. Codes vérifiés et primes à jour.",
  path: "/",
});

// Données structurées (schema.org) : aide Google à comprendre le site + la FAQ.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: absoluteUrl("/offres?q={query}"),
        },
        "query-input": "required name=query",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: siteName,
      url: siteUrl,
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollUp />
      <HashScroll />
      <Hero />
      <TopOffers />
      <AppLogos />
      <HowItWorks />
      <Trust />
      <Faq />
    </>
  );
}
