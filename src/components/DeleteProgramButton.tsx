"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProgram } from "@/lib/actions";

export function DeleteProgramButton({ programId }: { programId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteProgram(programId);
      router.push("/programs");
      router.refresh();
    });
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={pending}
          className="rounded-xl border border-[rgba(251,113,133,0.4)] bg-[rgba(251,113,133,0.12)] px-3 py-2 text-xs font-semibold text-[var(--color-rose)]"
        >
          {pending ? "Tar bort…" : "Bekräfta borttagning"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)]"
        >
          Avbryt
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:border-[rgba(251,113,133,0.4)] hover:text-[var(--color-rose)]"
    >
      <Trash2 className="h-3.5 w-3.5" /> Ta bort
    </button>
  );
}
