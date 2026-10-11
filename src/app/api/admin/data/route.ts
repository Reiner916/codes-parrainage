import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { readStats } from "@/lib/stats";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const [db, stats] = await Promise.all([readDb(), readStats()]);
  return NextResponse.json({ ...db, stats });
}
