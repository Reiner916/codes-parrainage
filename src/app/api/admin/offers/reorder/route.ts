import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { reorderOffers } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { slugs } = await req.json();
    if (!Array.isArray(slugs)) throw new Error("Liste de slugs invalide.");
    await reorderOffers(slugs);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
