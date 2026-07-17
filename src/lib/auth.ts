import { cookies } from "next/headers";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHmac,
} from "node:crypto";
import { prisma } from "./prisma";

const COOKIE = "atlas_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// A dev fallback keeps local runs working without config. In production,
// ALWAYS set AUTH_SECRET so sessions can't be forged.
const SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "atlas-dev-insecure-secret-change-me";

// ── Password hashing (scrypt) ───────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, "hex");
  const test = scryptSync(password, salt, 64);
  return hashBuf.length === test.length && timingSafeEqual(hashBuf, test);
}

// ── Signed session token (HMAC) ─────────────────────────────────────────────

function sign(value: string): string {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

function createToken(userId: string): string {
  const payload = `${userId}.${Date.now()}`;
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(body)}`;
}

function readToken(token: string): string | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const payload = Buffer.from(body, "base64url").toString();
  const [userId] = payload.split(".");
  return userId || null;
}

// ── Session cookie helpers ──────────────────────────────────────────────────

export async function createSession(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, createToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return readToken(token);
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

/** Returns the signed-in user's id, or throws (callers run behind middleware). */
export async function requireUserId(): Promise<string> {
  const userId = await getSessionUserId();
  if (!userId) throw new Error("UNAUTHENTICATED");
  return userId;
}
