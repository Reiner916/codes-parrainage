import { NextRequest, NextResponse } from "next/server";
import { incrementCopy } from "@/lib/stats";

/** Endpoint PUBLIC : appelé quand un visiteur copie un code de parrainage.
 *  Ne renvoie aucune donnée sensible — sert juste à compter. */
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    await incrementCopy(String(slug || ""));
  } catch {
    // tracking best-effort : on n'échoue jamais côté visiteur
  }
  return NextResponse.json({ ok: true });
}
