"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createProgram } from "@/lib/actions";

const EMOJIS = ["🏋️", "🦵", "🔥", "🌿", "💪", "🏃", "🧘", "⚡", "🤸", "🍑"];
const COLORS = ["#8b5cf6", "#22d3ee", "#34d399", "#fbbf24", "#fb7185", "#6366f1"];
const GOAL_OPTIONS = [
  "Bygg muskler",
  "Bränn kalorier",
  "Rehab",
  "Rörlighet",
  "Kondition",
];

export function CreateProgramButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);

  function submit() {
    if (!name.trim()) return;
    startTransition(async () => {
      const p = await createProgram({ name, description, emoji, color, goal });
      setOpen(false);
      setName("");
      setDescription("");
      router.push(`/programs/${p.id}`);
      router.refresh();
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
      >
        <Plus className="h-4 w-4" /> Nytt program
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="card animate-fade-up max-h-[90vh] w-full max-w-md overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Skapa ett program</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--color-muted)] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Namn
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.ex. Återhämtning efter löpning"
              autoFocus
              className="mb-4 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm outline-none focus:border-[rgba(139,92,246,0.5)]"
            />

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Beskrivning
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vad är programmet till för?"
              rows={2}
              className="mb-4 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm outline-none focus:border-[rgba(139,92,246,0.5)]"
            />

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Mål
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    goal === g
                      ? "border-[rgba(139,92,246,0.6)] bg-[rgba(139,92,246,0.18)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Ikon
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`grid h-10 w-10 place-items-center rounded-xl border text-lg transition-colors ${
                    emoji === e
                      ? "border-[rgba(139,92,246,0.6)] bg-[rgba(139,92,246,0.15)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface-2)]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>

            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Färg
            </label>
            <div className="mb-6 flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-full border-2 transition-transform ${
                    color === c ? "scale-110 border-white" : "border-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>

            <button
              onClick={submit}
              disabled={pending || !name.trim()}
              className="btn-primary w-full rounded-xl py-3 text-sm font-bold disabled:opacity-50"
            >
              {pending ? "Skapar…" : "Skapa program"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
