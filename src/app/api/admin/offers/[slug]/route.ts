import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { deleteOffer } from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { slug } = await params;
  await deleteOffer(slug);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
