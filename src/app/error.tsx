"use client";

import { Database, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const looksLikeDb =
    /database|prisma|connect|DATABASE_URL|ECONNREFUSED|P10\d\d/i.test(
      error.message,
    );

  return (
    <main className="grid min-h-[70vh] place-items-center px-6">
      <div className="card max-w-lg p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[rgba(251,113,133,0.12)] text-[var(--color-rose)]">
          <Database className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold">
          {looksLikeDb ? "Databasen kan inte nås" : "Något gick fel"}
        </h1>
        {looksLikeDb ? (
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Atlas behöver en Postgres-databas. Sätt miljövariabeln{" "}
            <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[var(--color-brand)]">
              DATABASE_URL
            </code>{" "}
            (se README) och kör{" "}
            <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[var(--color-brand)]">
              npm run db:push
            </code>
            . Övningar och program seedas automatiskt vid första besöket.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Ett oväntat fel uppstod. Försök igen.
          </p>
        )}
        <button
          onClick={reset}
          className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          <RefreshCw className="h-4 w-4" /> Försök igen
        </button>
      </div>
    </main>
  );
}
