import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthed } from "@/lib/auth";
import { slugify } from "@/lib/db";

const LOGO_DIR = path.join(process.cwd(), "public", "images", "logos");
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const nameHint = (form.get("name") as string) || "logo";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté (PNG, JPG, WEBP ou SVG)." },
      { status: 400 },
    );
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop lourd (max 2 Mo)." }, { status: 400 });
  }

  const ext = EXT[file.type];
  const base = slugify(nameHint) || "logo";
  const filename = `${base}-${Date.now()}.${ext}`;

  await fs.mkdir(LOGO_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(LOGO_DIR, filename), buffer);

  return NextResponse.json({ ok: true, path: `/images/logos/${filename}` });
}
