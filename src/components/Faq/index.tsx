"use client";

import { useState } from "react";
import SectionTitle from "@/components/Common/SectionTitle";
import GlassPanel from "@/components/ui/GlassPanel";
import { faqs } from "@/data/faq";

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Questions fréquentes"
          paragraph="Tout ce qu'il faut savoir avant d'utiliser un code de parrainage."
          center
          mb="60px"
        />
        <div className="mx-auto max-w-[760px]">
          {faqs.map((faq, i) => (
            <GlassPanel key={i} radius={18} className="mb-4">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-base font-semibold text-black dark:text-white">
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 text-primary duration-300 ${
                    open === i ? "rotate-180" : ""
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {open === i && (
                <p className="px-6 pb-6 text-base leading-relaxed text-body-color">
                  {faq.a}
                </p>
              )}
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
