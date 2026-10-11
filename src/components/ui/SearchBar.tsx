"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { offers } from "@/data/offers";
import GlassPanel from "./GlassPanel";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return offers
      .filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.tagline.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <GlassPanel radius={999}>
        <div className="flex items-center px-5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="mr-3 shrink-0 text-black/50 dark:text-white/70"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path
              d="M20 20l-3-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une application (Revolut, Coinbase…)"
            className="w-full bg-transparent py-3.5 text-base text-black outline-none placeholder:text-black/45 dark:text-white dark:placeholder:text-white/55"
          />
        </div>
      </GlassPanel>

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2">
          {/* Panneau OPAQUE (pas de transparence) pour ne pas laisser voir les
              chips "Populaire" derrière. Léger flou + ombre pour le relief. */}
          <div className="overflow-hidden rounded-[18px] border border-black/10 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0c0c16]/95">
            <div className="py-2 text-left">
              {results.map((o) => (
                <Link
                  key={o.slug}
                  href={`/offre/${o.slug}`}
                  className="flex items-center justify-between px-5 py-3 duration-200 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <span className="font-medium text-black dark:text-white">
                    {o.name}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {o.reward}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
