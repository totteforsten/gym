"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  Play,
} from "lucide-react";
import {
  removeExerciseFromProgram,
  updateProgramExercise,
} from "@/lib/actions";
import { youtubeThumb, categoryColor, relativeDate } from "@/lib/utils";

type Item = {
  exerciseId: string;
  slug: string;
  name: string;
  videoId: string;
  category: string;
  difficulty: string;
  sets: number;
  reps: number;
  lastLogged: string | null;
};

export function ProgramExercises({
  programId,
  items,
}: {
  programId: string;
  items: Item[];
}) {
  const [done, setDone] = useState<Set<string>>(new Set());

  if (items.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
        <p className="font-semibold">No exercises yet</p>
        <p className="max-w-sm text-sm text-[var(--color-muted)]">
          Browse the library and tap &ldquo;Add to program&rdquo; on any
          exercise to build this routine.
        </p>
        <Link
          href="/library"
          className="btn-primary mt-1 rounded-xl px-4 py-2 text-sm font-semibold"
        >
          Browse exercises
        </Link>
      </div>
    );
  }

  const completed = done.size;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <div>
      {/* Session progress bar */}
      <div className="card mb-4 flex items-center gap-4 p-4">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold">Session progress</span>
            <span className="text-[var(--color-muted)]">
              {completed}/{items.length} done
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        {completed > 0 && (
          <button
            onClick={() => setDone(new Set())}
            className="shrink-0 text-xs font-semibold text-[var(--color-muted)] hover:text-white"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <Row
            key={item.exerciseId}
            programId={programId}
            item={item}
            index={i}
            done={done.has(item.exerciseId)}
            toggleDone={() =>
              setDone((prev) => {
                const next = new Set(prev);
                if (next.has(item.exerciseId)) next.delete(item.exerciseId);
                else next.add(item.exerciseId);
                return next;
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  programId,
  item,
  index,
  done,
  toggleDone,
}: {
  programId: string;
  item: Item;
  index: number;
  done: boolean;
  toggleDone: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [sets, setSets] = useState(item.sets);
  const [reps, setReps] = useState(item.reps);

  function save(nextSets: number, nextReps: number) {
    setSets(nextSets);
    setReps(nextReps);
    startTransition(async () => {
      await updateProgramExercise({
        programId,
        exerciseId: item.exerciseId,
        sets: nextSets,
        reps: nextReps,
      });
    });
  }

  function remove() {
    startTransition(async () => {
      await removeExerciseFromProgram({ programId, exerciseId: item.exerciseId });
      router.refresh();
    });
  }

  return (
    <div
      className={`card animate-fade-up p-3 transition-opacity sm:p-4 ${
        done ? "opacity-60" : ""
      }`}
      style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleDone}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-colors ${
            done
              ? "border-transparent bg-[var(--color-mint)] text-black"
              : "border-[var(--color-border)] text-transparent hover:border-[var(--color-mint)]"
          }`}
          aria-label="Mark done"
        >
          <Check className="h-4 w-4" />
        </button>

        <Link href={`/exercise/${item.slug}`} className="group relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={youtubeThumb(item.videoId)}
            alt={item.name}
            className="h-14 w-20 rounded-lg object-cover sm:h-16 sm:w-24"
          />
          <span className="absolute inset-0 grid place-items-center rounded-lg bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <Play className="h-5 w-5 fill-white text-white" />
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/exercise/${item.slug}`}
            className="block truncate font-semibold transition-colors hover:text-[var(--color-brand)]"
          >
            {item.name}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-muted)]">
            <span style={{ color: categoryColor(item.category) }}>
              {item.category}
            </span>
            <span>·</span>
            <span>
              {item.lastLogged
                ? `Last ${relativeDate(item.lastLogged)}`
                : "Not logged"}
            </span>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Counter label="sets" value={sets} onChange={(v) => save(v, reps)} min={1} max={20} />
          <span className="text-[var(--color-muted)]">×</span>
          <Counter label="reps" value={reps} onChange={(v) => save(sets, v)} min={1} max={100} />
        </div>

        <button
          onClick={remove}
          disabled={pending}
          className="shrink-0 text-[var(--color-muted)] transition-colors hover:text-[var(--color-rose)]"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile counters */}
      <div className="mt-3 flex items-center gap-3 sm:hidden">
        <Counter label="sets" value={sets} onChange={(v) => save(v, reps)} min={1} max={20} />
        <span className="text-[var(--color-muted)]">×</span>
        <Counter label="reps" value={reps} onChange={(v) => save(sets, v)} min={1} max={100} />
        <Link
          href={`/exercise/${item.slug}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand)]"
        >
          Log <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function Counter({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-7 w-7 place-items-center text-[var(--color-muted)] hover:text-white"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-9 text-center text-sm font-bold tabular-nums">
        {value}
        <span className="ml-0.5 text-[9px] font-medium text-[var(--color-muted)]">
          {label}
        </span>
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-7 w-7 place-items-center text-[var(--color-muted)] hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
