"use client";

import { useEffect } from "react";

/**
 * Scrolle vers la section ciblée par le #hash de l'URL à l'arrivée sur la page.
 * Next.js (App Router) ne le fait pas quand on arrive depuis une AUTRE page
 * (ex: /banque → /#faq) : il charge l'accueil mais reste tout en haut.
 * On réessaie quelques fois car la page (liquid glass) est lourde à monter.
 */
const HashScroll = () => {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.slice(1));

      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < 12) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };

      // léger délai initial (laisse le layout se poser) puis retries
      setTimeout(() => tryScroll(), 60);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
};

export default HashScroll;
