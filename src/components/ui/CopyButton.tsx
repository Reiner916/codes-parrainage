"use client";

import { useState } from "react";

const CopyButton = ({
  code,
  slug,
  className = "",
}: {
  code: string;
  /** Slug de l'offre, pour le tracking des copies (panel admin). */
  slug?: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard non dispo : on ignore silencieusement
    }

    // Tracking best-effort : ne bloque pas et n'échoue jamais côté visiteur.
    if (slug) {
      fetch("/api/track/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        keepalive: true,
      }).catch(() => {});
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copier le code ${code}`}
      className={`flex items-center justify-between gap-3 rounded-sm border border-dashed border-primary/40 bg-primary/5 px-4 py-3 duration-300 hover:bg-primary/10 ${className}`}
    >
      <span className="font-mono text-base font-semibold tracking-wider text-black dark:text-white">
        {code}
      </span>
      <span className="text-sm font-semibold text-primary">
        {copied ? "Copié !" : "Copier"}
      </span>
    </button>
  );
};

export default CopyButton;
