"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { ensureUserData } from "./seed";
import {
  hashPassword,
  verifyPassword,
  createSession,
  clearSession,
} from "./auth";

export type AuthResult = { error: string } | { ok: true };

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Turns a raw DB/Prisma exception into a message that explains the fix. */
function describeDbError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  // Table/column missing → schema was never applied on this database.
  if (/P2021|P2022|does not exist|relation .* does not/i.test(msg)) {
    return "The database schema isn't set up yet. Run `prisma db push` against your DATABASE_URL (the Vercel build does this automatically) and try again.";
  }
  // Prepared-statement clash → a pooled (pgbouncer) URL used without the flag.
  if (/prepared statement|bind message|ConnectorError/i.test(msg)) {
    return "Database connection error. If you're using a pooled connection string, add `?pgbouncer=true&connection_limit=1`, or use the direct connection URL.";
  }
  // Can't reach the database at all.
  if (/P1001|P1000|P1017|ECONNREFUSED|ENOTFOUND|Can't reach|timed out/i.test(msg)) {
    return "Can't reach the database. Check that DATABASE_URL is set correctly in your Vercel project.";
  }
  return "Something went wrong creating your account. Please try again.";
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!validEmail(email)) return { error: "Please enter a valid email." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return {
        error: "An account with that email already exists. Try signing in.",
      };

    const user = await prisma.user.create({
      data: { email, name, password: hashPassword(password) },
    });

    await ensureUserData(user.id);
    await createSession(user.id);
    return { ok: true };
  } catch (err) {
    console.error("signUp failed:", err);
    return { error: describeDbError(err) };
  }
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!validEmail(email)) return { error: "Please enter a valid email." };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.password))
      return { error: "Incorrect email or password." };

    await ensureUserData(user.id);
    await createSession(user.id);
    return { ok: true };
  } catch (err) {
    console.error("signIn failed:", err);
    return { error: describeDbError(err) };
  }
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect("/login");
}
