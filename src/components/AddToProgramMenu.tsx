"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ListPlus, Loader2 } from "lucide-react";
import { addExerciseToProgram, removeExerciseFromProgram } from "@/lib/actions";

export function AddToProgramMenu({
  exerciseId,
  programs,
  inPrograms,
}: {
  exerciseId: string;
  programs: { id: string; name: string; emoji: string }[];
  inPrograms: string[];
}) {
  const router = useRouter();
  const [member, setMember] = useState<Set<string>>(new Set(inPrograms));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(programId: string) {
    const isMember = member.has(programId);
    setPendingId(programId);
    startTransition(async () => {
      if (isMember) {
        await removeExerciseFromProgram({ programId, exerciseId });
        setMember((prev) => {
          const next = new Set(prev);
          next.delete(programId);
          return next;
        });
      } else {
        await addExerciseToProgram({ programId, exerciseId });
        setMember((prev) => new Set(prev).add(programId));
      }
      setPendingId(null);
      router.refresh();
    });
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <ListPlus className="h-5 w-5 text-[var(--color-accent)]" />
        <h2 className="font-bold">Lägg till i program</h2>
      </div>
      <div className="flex flex-col gap-2">
        {programs.map((p) => {
          const active = member.has(p.id);
          const loading = pendingId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              disabled={loading}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition-colors ${
                active
                  ? "border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.12)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[rgba(139,92,246,0.35)]"
              }`}
            >
              <span className="text-lg">{p.emoji}</span>
              <span className="flex-1 truncate">{p.name}</span>
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border transition-colors ${
                  active
                    ? "border-transparent bg-[var(--color-brand)] text-white"
                    : "border-[var(--color-border)] text-transparent"
                }`}
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--color-muted)]" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
