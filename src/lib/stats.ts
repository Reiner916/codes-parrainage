import { promises as fs } from "fs";
import path from "path";

const STATS_PATH = path.join(process.cwd(), "src", "data", "stats.json");

export type OfferStat = { copies: number; lastCopiedAt?: string };
export type Stats = Record<string, OfferStat>;

export async function readStats(): Promise<Stats> {
  try {
    const raw = await fs.readFile(STATS_PATH, "utf8");
    return JSON.parse(raw) as Stats;
  } catch {
    // Fichier absent au premier lancement → stats vides.
    return {};
  }
}

async function writeStats(stats: Stats): Promise<void> {
  await fs.writeFile(STATS_PATH, JSON.stringify(stats, null, 2) + "\n", "utf8");
}

/** Incrémente le compteur de copies d'une offre (tracking côté public). */
export async function incrementCopy(slug: string): Promise<void> {
  if (!slug) return;
  const stats = await readStats();
  const current = stats[slug] ?? { copies: 0 };
  stats[slug] = {
    copies: current.copies + 1,
    lastCopiedAt: new Date().toISOString(),
  };
  await writeStats(stats);
}
