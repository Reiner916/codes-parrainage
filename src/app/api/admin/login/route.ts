import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkPassword,
  isAdminConfigured,
  sessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));

  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Accès admin non configuré. Définis un mot de passe fort dans ADMIN_PASSWORD (.env.local) puis redémarre le serveur.",
      },
      { status: 503 },
    );
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
  });

  return NextResponse.json({ ok: true });
}
