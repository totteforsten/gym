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

export async function signUp(formData: FormData): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Please enter your name." };
  if (!validEmail(email)) return { error: "Please enter a valid email." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return { error: "An account with that email already exists. Try signing in." };

  const user = await prisma.user.create({
    data: { email, name, password: hashPassword(password) },
  });

  await ensureUserData(user.id);
  await createSession(user.id);
  return { ok: true };
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!validEmail(email)) return { error: "Please enter a valid email." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.password))
    return { error: "Incorrect email or password." };

  await ensureUserData(user.id);
  await createSession(user.id);
  return { ok: true };
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect("/login");
}
