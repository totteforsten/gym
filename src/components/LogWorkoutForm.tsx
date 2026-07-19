"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Minus, Plus, PlusCircle } from "lucide-react";
import { logWorkout } from "@/lib/actions";

export function LogWorkoutForm({
  exerciseId,
  exerciseName,
  defaultSets,
  defaultReps,
  isRehab,
}: {
  exerciseId: string;
  exerciseName: string;
  defaultSets: number;
  defaultReps: number;
  isRehab: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const [sets, setSets] = useState(defaultSets);
  const [reps, setReps] = useState(defaultReps);
  const [weight, setWeight] = useState(0);
  const [pain, setPain] = useState(0);
  const [rpe, setRpe] = useState(5);
  const [notes, setNotes] = useState("");

  function submit() {
    startTransition(async () => {
      await logWorkout({
        exerciseId,
        sets,
        reps,
        weight,
        painLevel: pain,
        rpe,
        notes,
      });
      setDone(true);
      setNotes("");
      router.refresh();
      setTimeout(() => setDone(false), 2200);
    });
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-[var(--color-brand)]" />
        <h2 className="font-bold">Logga ett set</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stepper label="Set" value={sets} setValue={setSets} min={1} max={20} />
        <Stepper label="Reps" value={reps} setValue={setReps} min={1} max={100} />
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          Vikt (kg) · valfritt
        </label>
        <input
          type="number"
          min={0}
          step={0.5}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm outline-none focus:border-[rgba(139,92,246,0.5)]"
        />
      </div>

      {isRehab && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Smärtnivå
            </label>
            <span
              className="text-sm font-bold tabular-nums"
              style={{ color: painColor(pain) }}
            >
              {pain}/10
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={pain}
            onChange={(e) => setPain(Number(e.target.value))}
            className="range-slider w-full"
            style={{ accentColor: painColor(pain) }}
          />
          <div className="mt-1 flex justify-between text-[10px] text-[var(--color-muted)]">
            <span>Ingen smärta</span>
            <span>Svår</span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Ansträngning (RPE)
          </label>
          <span className="text-sm font-bold tabular-nums text-[var(--color-accent)]">
            {rpe}/10
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={rpe}
          onChange={(e) => setRpe(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: "#22d3ee" }}
        />
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Anteckningar (hur kändes det?)"
        rows={2}
        className="mt-4 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm outline-none placeholder:text-[var(--color-muted)] focus:border-[rgba(139,92,246,0.5)]"
      />

      <button
        onClick={submit}
        disabled={pending}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
          done
            ? "bg-[rgba(52,211,153,0.15)] text-[var(--color-mint)]"
            : "btn-primary text-white"
        } ${pending ? "opacity-70" : ""}`}
      >
        {done ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Loggat!
          </>
        ) : pending ? (
          "Sparar…"
        ) : (
          `Logga ${exerciseName.split(" ")[0]}`
        )}
      </button>
    </div>
  );
}

function Stepper({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
        <button
          onClick={() => setValue(Math.max(min, value - 1))}
          className="grid h-10 w-10 place-items-center text-[var(--color-muted)] transition-colors hover:text-white"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="flex-1 text-center text-sm font-bold tabular-nums">
          {value}
        </span>
        <button
          onClick={() => setValue(Math.min(max, value + 1))}
          className="grid h-10 w-10 place-items-center text-[var(--color-muted)] transition-colors hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function painColor(p: number) {
  if (p <= 2) return "#34d399";
  if (p <= 5) return "#fbbf24";
  return "#fb7185";
}
