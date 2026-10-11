import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { upsertCategory } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { originalSlug, ...category } = body;
    const result = await upsertCategory(category, originalSlug);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, slug: result.slug });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
