"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { signIn, signUp, type AuthResult } from "@/lib/auth-actions";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const action = isSignup ? signUp : signIn;
      const res: AuthResult = await action(formData);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      const from = params.get("from");
      router.push(from && from.startsWith("/") ? from : "/");
      router.refresh();
    });
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] shadow-xl shadow-[rgba(139,92,246,0.45)]">
            <Activity className="h-7 w-7 text-white" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
            {isSignup ? "Skapa ditt konto" : "Välkommen tillbaka"}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-muted)]">
            {isSignup
              ? "Börja följa din rehab och träning med Atlas."
              : "Logga in för att fortsätta din träning."}
          </p>
        </div>

        <form onSubmit={onSubmit} className="card flex flex-col gap-4 p-6">
          {isSignup && (
            <AuthField
              icon={<UserIcon className="h-4 w-4" />}
              name="name"
              type="text"
              placeholder="Ditt namn"
              autoComplete="name"
            />
          )}
          <AuthField
            icon={<Mail className="h-4 w-4" />}
            name="email"
            type="email"
            placeholder="du@email.se"
            autoComplete="email"
          />
          <AuthField
            icon={<Lock className="h-4 w-4" />}
            name="password"
            type="password"
            placeholder={isSignup ? "Välj ett lösenord (8+ tecken)" : "Lösenord"}
            autoComplete={isSignup ? "new-password" : "current-password"}
          />

          {error && (
            <p className="rounded-xl border border-[rgba(251,113,133,0.3)] bg-[rgba(251,113,133,0.1)] px-3 py-2 text-sm font-medium text-[var(--color-rose)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-60"
          >
            {pending
              ? "Vänta…"
              : isSignup
                ? "Skapa konto"
                : "Logga in"}
            {!pending && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--color-muted)]">
          {isSignup ? "Har du redan ett konto?" : "Ny på Atlas?"}{" "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-[var(--color-brand)] hover:underline"
          >
            {isSignup ? "Logga in" : "Skapa ett konto"}
          </Link>
        </p>
      </div>
    </main>
  );
}

function AuthField({
  icon,
  ...props
}: {
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
        {icon}
      </span>
      <input
        {...props}
        required
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-3 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[rgba(139,92,246,0.5)]"
      />
    </div>
  );
}
