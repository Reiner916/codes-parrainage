import { cookies } from "next/headers";
import crypto from "crypto";

/** Mot de passe défini dans .env.local (ADMIN_PASSWORD). Pas de valeur
 *  par défaut : si la variable est absente, l'accès admin est bloqué. */
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

/** Valeurs placeholder à refuser (mot de passe non configuré). */
const WEAK_PASSWORDS = new Set(["", "admin", "change-moi-stp", "password"]);

/** Vrai si le mot de passe admin a bien été personnalisé. */
export function isAdminConfigured(): boolean {
  return !WEAK_PASSWORDS.has(ADMIN_PASSWORD) && ADMIN_PASSWORD.length >= 8;
}

export const SESSION_COOKIE = "admin_session";

/** Jeton de session = hash du mot de passe. Changer le mot de passe
 *  invalide automatiquement les sessions existantes. */
export function sessionToken(): string {
  return crypto
    .createHash("sha256")
    .update(`parrainage::${ADMIN_PASSWORD}`)
    .digest("hex");
}

/** Comparaison à temps constant pour éviter les attaques temporelles. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(pw: string): boolean {
  // Tant que le mot de passe n'est pas configuré, aucune connexion possible.
  if (!isAdminConfigured()) return false;
  return typeof pw === "string" && safeEqual(pw, ADMIN_PASSWORD);
}

/** Vrai si la requête courante a un cookie de session valide. */
export async function isAuthed(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return typeof token === "string" && safeEqual(token, sessionToken());
}
