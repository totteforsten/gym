import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-brand)]">
          <Dumbbell className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold">Inget här</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Den här sidan tog en vilodag. Nu tar vi dig tillbaka till träningen.
        </p>
        <Link
          href="/"
          className="btn-primary mt-6 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Till översikten
        </Link>
      </div>
    </main>
  );
}
