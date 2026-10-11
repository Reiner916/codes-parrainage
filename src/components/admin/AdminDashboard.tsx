"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Category, Offer } from "@/types/offer";
import OfferForm from "./OfferForm";
import CategoryManager from "./CategoryManager";

type Stats = Record<string, { copies: number; lastCopiedAt?: string }>;

type Props = {
  initialOffers: Offer[];
  initialCategories: Category[];
  initialStats: Stats;
};

export default function AdminDashboard({
  initialOffers,
  initialCategories,
  initialStats,
}: Props) {
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [filter, setFilter] = useState<string>("all");

  // drag & drop
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // état du formulaire d'offre
  const [editing, setEditing] = useState<{
    offer: Partial<Offer> | null;
    originalSlug?: string;
  } | null>(null);

  async function refresh() {
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    if (res.ok) {
      const db = await res.json();
      setOffers(db.offers);
      setCategories(db.categories);
      setStats(db.stats ?? {});
    }
    router.refresh(); // rafraîchit aussi le site public (revalidate)
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  async function remove(slug: string, name: string) {
    if (!confirm(`Supprimer définitivement « ${name} » ?`)) return;
    await fetch(`/api/admin/offers/${slug}`, { method: "DELETE" });
    refresh();
  }

  async function quickPatch(offer: Offer, patch: Partial<Offer>) {
    await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...offer, ...patch, originalSlug: offer.slug }),
    });
    refresh();
  }

  function duplicate(offer: Offer) {
    const { slug, ...rest } = offer;
    setEditing({
      offer: { ...rest, name: `${offer.name} (copie)`, slug: "", popular: false },
      originalSlug: undefined,
    });
  }

  // Persiste le nouvel ordre des offres (glisser-déposer).
  async function persistOrder(next: Offer[]) {
    await fetch("/api/admin/offers/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs: next.map((o) => o.slug) }),
    });
    router.refresh();
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...offers];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    setOffers(next);
    setDragIndex(null);
    setOverIndex(null);
    persistOrder(next);
  }

  const catLabel = (slug: string) =>
    categories.find((c) => c.slug === slug)?.label ?? slug;

  const canReorder = filter === "all";
  const shown = offers.filter((o) => filter === "all" || o.category === filter);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* En-tête */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Admin — offres de parrainage
        </h1>
        <div className="flex gap-2">
          <a
            href="/"
            target="_blank"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
          >
            Voir le site ↗
          </a>
          <button
            onClick={() => setEditing({ offer: null })}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white dark:text-black"
          >
            + Nouvelle offre
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-3 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          Toutes ({offers.length})
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.slug}
            active={filter === c.slug}
            onClick={() => setFilter(c.slug)}
          >
            {c.icon} {c.label} ({offers.filter((o) => o.category === c.slug).length})
          </FilterChip>
        ))}
      </div>

      {/* Aide réordonnancement */}
      <p className="mb-4 text-xs text-body-color">
        {canReorder
          ? "↕ Glisse une offre par la poignée pour la réordonner (l'ordre s'applique au site)."
          : "↕ Pour réordonner, repasse sur l'onglet « Toutes »."}
      </p>

      {/* Liste des offres */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        {shown.length === 0 && (
          <p className="p-6 text-center text-sm text-body-color">Aucune offre.</p>
        )}
        {shown.map((o, index) => (
          <div
            key={o.slug}
            onDragOver={(e) => {
              if (!canReorder) return;
              e.preventDefault();
              setOverIndex(index);
            }}
            onDrop={() => canReorder && handleDrop(index)}
            className={`flex flex-wrap items-center gap-3 border-b border-gray-100 px-3 py-3 last:border-0 dark:border-gray-800 ${
              overIndex === index && dragIndex !== null
                ? "bg-primary/5 ring-1 ring-inset ring-primary/40"
                : ""
            } ${dragIndex === index ? "opacity-50" : ""}`}
          >
            {/* Poignée de drag */}
            <span
              draggable={canReorder}
              onDragStart={() => canReorder && setDragIndex(index)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`shrink-0 select-none text-lg ${
                canReorder
                  ? "cursor-grab text-body-color active:cursor-grabbing"
                  : "cursor-not-allowed text-gray-300 dark:text-gray-700"
              }`}
              title={canReorder ? "Glisser pour réordonner" : "Réordonnable dans « Toutes »"}
            >
              ⠿
            </span>

            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: o.color || "#191c1f" }}
            >
              {o.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.logo} alt="" className="h-9 w-9 rounded-lg object-contain" />
              ) : (
                o.name.charAt(0)
              )}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black dark:text-white">{o.name}</span>
                {o.popular && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                    TOP
                  </span>
                )}
                {o.hidden && (
                  <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    BROUILLON
                  </span>
                )}
              </div>
              {/* Méta avec édition rapide en ligne (prime + code) */}
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-body-color">
                <span>{catLabel(o.category)}</span>
                <span>·</span>
                <InlineField
                  value={o.reward}
                  placeholder="ajouter une prime"
                  onSave={(v) => quickPatch(o, { reward: v })}
                />
                <span>·</span>
                <InlineField
                  value={o.code}
                  placeholder="ajouter un code"
                  mono
                  onSave={(v) => quickPatch(o, { code: v })}
                />
              </div>
            </div>

            {/* Compteur de copies du code (tracking) */}
            <div
              className="flex shrink-0 flex-col items-center rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-800"
              title={
                stats[o.slug]?.lastCopiedAt
                  ? `Dernière copie : ${new Date(stats[o.slug].lastCopiedAt!).toLocaleString("fr-FR")}`
                  : "Aucune copie pour l'instant"
              }
            >
              <span className="text-sm font-bold text-black dark:text-white">
                {stats[o.slug]?.copies ?? 0}
              </span>
              <span className="text-[10px] uppercase tracking-wide text-body-color">copies</span>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => quickPatch(o, { popular: !o.popular })}
                className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700"
                title="Épingler / désépingler du top"
              >
                {o.popular ? "★ Top" : "☆ Top"}
              </button>
              <button
                onClick={() => quickPatch(o, { hidden: !o.hidden })}
                className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700"
              >
                {o.hidden ? "Publier" : "Masquer"}
              </button>
              <button
                onClick={() => setEditing({ offer: o, originalSlug: o.slug })}
                className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700"
              >
                Modifier
              </button>
              <button
                onClick={() => duplicate(o)}
                className="rounded border border-gray-200 px-2 py-1 dark:border-gray-700"
              >
                Dupliquer
              </button>
              <button
                onClick={() => remove(o.slug, o.name)}
                className="rounded border border-red-200 px-2 py-1 text-red-500 dark:border-red-900"
              >
                Suppr
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Catégories */}
      <CategoryManager categories={categories} offers={offers} onChanged={refresh} />

      {editing && (
        <OfferForm
          offer={editing.offer}
          originalSlug={editing.originalSlug}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

/** Champ éditable au clic (édition rapide en ligne). */
function InlineField({
  value,
  placeholder,
  mono = false,
  onSave,
}: {
  value: string;
  placeholder: string;
  mono?: boolean;
  onSave: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);

  useEffect(() => setVal(value), [value]);

  function commit() {
    setEditing(false);
    if (val.trim() !== (value || "").trim()) onSave(val.trim());
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setVal(value);
            setEditing(false);
          }
        }}
        className={`w-40 rounded border border-primary/40 bg-transparent px-1.5 py-0.5 text-xs text-black outline-none dark:text-white ${
          mono ? "font-mono" : ""
        }`}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      title="Cliquer pour modifier"
      className={`rounded px-1 text-left hover:bg-primary/10 ${
        mono ? "font-mono" : ""
      } ${value ? "" : "italic opacity-60"}`}
    >
      {value || placeholder}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-primary text-white dark:text-black"
          : "border border-gray-200 text-body-color dark:border-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
