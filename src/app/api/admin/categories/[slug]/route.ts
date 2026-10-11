import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { deleteCategory } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { slug } = await params;
    await deleteCategory(slug);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
