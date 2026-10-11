"use client";

import { useState } from "react";
import { Category, Offer } from "@/types/offer";

type Props = {
  categories: Category[];
  offers: Offer[];
  onChanged: () => void;
};

const input =
  "rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white";

export default function CategoryManager({ categories, offers, onChanged }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<{ slug?: string; label: string; icon: string; description: string }>({
    label: "",
    icon: "🏷️",
    description: "",
  });
  const [error, setError] = useState("");

  async function save() {
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, originalSlug: draft.slug }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setDraft({ label: "", icon: "🏷️", description: "" });
      onChanged();
    } else setError(data.error || "Erreur.");
  }

  async function remove(slug: string, label: string) {
    if (!confirm(`Supprimer la catégorie « ${label} » ?`)) return;
    const res = await fetch(`/api/admin/categories/${slug}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) onChanged();
    else setError(data.error || "Erreur.");
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-black dark:text-white">
          Catégories ({categories.length})
        </span>
        <span className="text-body-color">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          {/* Liste */}
          <div className="space-y-2">
            {categories.map((c) => (
              <div
                key={c.slug}
                className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
              >
                <span className="text-lg">{c.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-black dark:text-white">{c.label}</div>
                  <div className="text-xs text-body-color">
                    /{c.slug} · {offers.filter((o) => o.category === c.slug).length} offre(s)
                  </div>
                </div>
                <button
                  onClick={() => setDraft({ slug: c.slug, label: c.label, icon: c.icon, description: c.description })}
                  className="rounded border border-gray-200 px-2 py-1 text-xs dark:border-gray-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => remove(c.slug, c.label)}
                  className="rounded border border-red-200 px-2 py-1 text-xs text-red-500 dark:border-red-900"
                >
                  Suppr
                </button>
              </div>
            ))}
          </div>

          {/* Formulaire ajout / édition */}
          <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#0f1620]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-body-color">
              {draft.slug ? "Modifier la catégorie" : "Nouvelle catégorie"}
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                className={input + " w-16 text-center"}
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                placeholder="🏦"
              />
              <input
                className={input + " flex-1"}
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="Libellé (ex: Banque & Néobanque)"
              />
            </div>
            <input
              className={input + " mt-2 w-full"}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Phrase d'intro de la page catégorie"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <div className="mt-3 flex gap-2">
              <button
                onClick={save}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white dark:text-black"
              >
                {draft.slug ? "Enregistrer" : "Ajouter"}
              </button>
              {draft.slug && (
                <button
                  onClick={() => setDraft({ label: "", icon: "🏷️", description: "" })}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
