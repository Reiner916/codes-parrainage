"use client";

import { useState } from "react";
import { Category, Offer } from "@/types/offer";

type Props = {
  offer: Partial<Offer> | null; // null = création
  originalSlug?: string; // présent = édition
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
};

const input =
  "w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-black outline-none focus:border-primary dark:border-gray-700 dark:text-white";
const label = "mb-1 block text-xs font-semibold uppercase tracking-wide text-body-color";

export default function OfferForm({
  offer,
  originalSlug,
  categories,
  onClose,
  onSaved,
}: Props) {
  const [form, setForm] = useState<Partial<Offer>>({
    name: "",
    slug: "",
    category: categories[0]?.slug ?? "",
    tagline: "",
    reward: "",
    code: "",
    ctaUrl: "",
    color: "#191c1f",
    logo: "",
    logoFill: false,
    details: "",
    verifiedAt: "",
    steps: [""],
    conditions: [""],
    popular: false,
    hidden: false,
    ...(offer ?? {}),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof Offer>(key: K, value: Offer[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ── listes dynamiques (steps / conditions) ──
  const updateList = (key: "steps" | "conditions", i: number, value: string) => {
    const arr = [...(form[key] ?? [])];
    arr[i] = value;
    set(key, arr);
  };
  const addItem = (key: "steps" | "conditions") =>
    set(key, [...(form[key] ?? []), ""]);
  const removeItem = (key: "steps" | "conditions", i: number) =>
    set(
      key,
      (form[key] ?? []).filter((_, j) => j !== i),
    );

  async function uploadLogo(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", form.name || "logo");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) set("logo", data.path);
    else setError(data.error || "Upload échoué.");
  }

  async function save() {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, originalSlug }),
    });
    setSaving(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) onSaved();
    else setError(data.error || "Enregistrement échoué.");
  }

  const initial = (form.name || "?").charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-[#121a22]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {originalSlug ? "Modifier l'offre" : "Nouvelle offre"}
          </h2>
          <button onClick={onClose} className="text-2xl text-body-color hover:text-black dark:hover:text-white">
            ×
          </button>
        </div>

        {/* ───────── APERÇU EN DIRECT ───────── */}
        <div className="mb-6 rounded-xl border border-dashed border-gray-300 p-3 dark:border-gray-700">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-body-color">
            Aperçu de la carte
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 dark:bg-[#0f1620]">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl text-lg font-bold text-white"
              style={{ background: form.logoFill ? form.color : "#ffffff" }}
            >
              {form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logo}
                  alt=""
                  className="h-14 w-14 object-contain"
                  style={{ objectFit: form.logoFill ? "cover" : "contain" }}
                />
              ) : (
                <span style={{ color: form.logoFill ? "#fff" : form.color }}>{initial}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-bold text-black dark:text-white">
                  {form.name || "Nom de l'offre"}
                </span>
                {form.popular && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                    TOP
                  </span>
                )}
              </div>
              <div className="truncate text-xs text-body-color">
                {form.tagline || "Accroche de l'offre"}
              </div>
              <div className="mt-1 text-sm font-bold text-primary">
                {form.reward || "Prime"}
              </div>
            </div>
          </div>
        </div>

        {/* ───────── BLOC 1 : LA CARTE ───────── */}
        <SectionTitle n="1" title="La carte" subtitle="Ce qui s'affiche sur la vignette de l'offre" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nom *</label>
            <input className={input} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Revolut" />
          </div>
          <div>
            <label className={label}>Slug (URL) — auto si vide</label>
            <input className={input} value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="revolut" />
          </div>

          <div>
            <label className={label}>Catégorie *</label>
            <select className={input} value={form.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Prime (texte)</label>
            <input className={input} value={form.reward ?? ""} onChange={(e) => set("reward", e.target.value)} placeholder="Jusqu'à 100€ offerts" />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Accroche</label>
            <input className={input} value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="La néobanque la plus populaire" />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Logo</label>
            <div className="flex flex-wrap items-center gap-3">
              <input className={input + " flex-1"} value={form.logo ?? ""} onChange={(e) => set("logo", e.target.value)} placeholder="/images/logos/revolut.png" />
              <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
                {uploading ? "Envoi…" : "Uploader"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                />
              </label>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-body-color">
              <input type="checkbox" checked={!!form.logoFill} onChange={(e) => set("logoFill", e.target.checked)} />
              Logo plein cadre (icône d'app avec son propre fond)
            </label>
          </div>

          <div>
            <label className={label}>Couleur de marque</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.color ?? "#191c1f"} onChange={(e) => set("color", e.target.value)} className="h-9 w-12 rounded border border-gray-200 dark:border-gray-700" />
              <input className={input} value={form.color ?? ""} onChange={(e) => set("color", e.target.value)} />
            </div>
          </div>

          <div className="flex items-end gap-5 pb-1">
            <label className="flex items-center gap-2 text-sm text-black dark:text-white">
              <input type="checkbox" checked={!!form.popular} onChange={(e) => set("popular", e.target.checked)} />
              Épinglé « Top offre »
            </label>
            <label className="flex items-center gap-2 text-sm text-black dark:text-white">
              <input type="checkbox" checked={!!form.hidden} onChange={(e) => set("hidden", e.target.checked)} />
              Brouillon
            </label>
          </div>
        </div>

        {/* ───────── BLOC 2 : LA PAGE DE L'OFFRE ───────── */}
        <div className="mt-8">
          <SectionTitle n="2" title="La page de l'offre" subtitle="Le contenu affiché quand on clique sur la carte" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Code parrainage</label>
            <input className={input} value={form.code ?? ""} onChange={(e) => set("code", e.target.value)} placeholder="PARRAINREVOLUT" />
          </div>
          <div>
            <label className={label}>Lien (CTA)</label>
            <input className={input} value={form.ctaUrl ?? ""} onChange={(e) => set("ctaUrl", e.target.value)} placeholder="https://revolut.com" />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Date de vérification</label>
            <input className={input + " sm:w-1/2"} value={form.verifiedAt ?? ""} onChange={(e) => set("verifiedAt", e.target.value)} placeholder="Juin 2026" />
          </div>

          <div className="sm:col-span-2">
            <label className={label}>Description (SEO)</label>
            <textarea className={input + " min-h-[80px]"} value={form.details ?? ""} onChange={(e) => set("details", e.target.value)} />
          </div>

          {/* Étapes */}
          <div className="sm:col-span-2">
            <label className={label}>Étapes</label>
            {(form.steps ?? []).map((s, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input className={input} value={s} onChange={(e) => updateList("steps", i, e.target.value)} placeholder={`Étape ${i + 1}`} />
                <button type="button" onClick={() => removeItem("steps", i)} className="rounded-lg border border-gray-200 px-3 text-body-color dark:border-gray-700">−</button>
              </div>
            ))}
            <button type="button" onClick={() => addItem("steps")} className="text-sm font-medium text-primary">+ Ajouter une étape</button>
          </div>

          {/* Conditions */}
          <div className="sm:col-span-2">
            <label className={label}>Conditions</label>
            {(form.conditions ?? []).map((s, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input className={input} value={s} onChange={(e) => updateList("conditions", i, e.target.value)} placeholder={`Condition ${i + 1}`} />
                <button type="button" onClick={() => removeItem("conditions", i)} className="rounded-lg border border-gray-200 px-3 text-body-color dark:border-gray-700">−</button>
              </div>
            ))}
            <button type="button" onClick={() => addItem("conditions")} className="text-sm font-medium text-primary">+ Ajouter une condition</button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm dark:border-gray-700">
            Annuler
          </button>
          <button onClick={save} disabled={saving} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 dark:text-black">
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ n, title, subtitle }: { n: string; title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white dark:text-black">
        {n}
      </span>
      <div>
        <div className="font-bold text-black dark:text-white">{title}</div>
        <div className="text-xs text-body-color">{subtitle}</div>
      </div>
    </div>
  );
}
