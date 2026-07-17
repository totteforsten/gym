import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-brand)]">
          <Dumbbell className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold">Nothing here</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          That page took a rest day. Let&apos;s get you back to training.
        </p>
        <Link
          href="/"
          className="btn-primary mt-6 inline-flex rounded-xl px-5 py-2.5 text-sm font-semibold"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
