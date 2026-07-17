"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, Plus } from "lucide-react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PageHeader, EmptyState } from "@/components/ui";
import { CATEGORIES, DIFFICULTIES, BODY_PARTS } from "@/lib/utils";

type Exercise = React.ComponentProps<typeof ExerciseCard>["exercise"] & {
  difficulty: string;
  category: string;
  bodyPart: string;
  tags: string[];
};

export function LibraryClient({ exercises }: { exercises: Exercise[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [bodyPart, setBodyPart] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return exercises.filter((e) => {
      if (category !== "All" && e.category !== category) return false;
      if (difficulty !== "All" && e.difficulty !== difficulty) return false;
      if (bodyPart !== "All" && e.bodyPart !== bodyPart) return false;
      if (query) {
        const hay = (
          e.name +
          " " +
          e.description +
          " " +
          e.targetMuscles.join(" ") +
          " " +
          e.tags.join(" ")
        ).toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [exercises, q, category, difficulty, bodyPart]);

  const activeFilters =
    (category !== "All" ? 1 : 0) +
    (difficulty !== "All" ? 1 : 0) +
    (bodyPart !== "All" ? 1 : 0);

  const reset = () => {
    setCategory("All");
    setDifficulty("All");
    setBodyPart("All");
    setQ("");
  };

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader
        eyebrow="Library"
        title="Find your exercise"
        subtitle="Every move includes a video demonstration and coaching cues. Filter to build the perfect session."
        action={
          <Link
            href="/library/new"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" /> New exercise
          </Link>
        }
      />

      {/* Search + filter toggle */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search exercises, muscles, tags…"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-10 text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[rgba(139,92,246,0.5)]"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition-colors ${
              showFilters || activeFilters
                ? "border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.12)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilters > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="card animate-fade-up flex flex-col gap-4 p-4">
            <FilterRow label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
            <FilterRow label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
            <FilterRow label="Body part" options={BODY_PARTS} value={bodyPart} onChange={setBodyPart} />
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          <span className="font-semibold text-white">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "exercise" : "exercises"}
        </p>
        {(activeFilters > 0 || q) && (
          <button
            onClick={reset}
            className="text-xs font-semibold text-[var(--color-brand)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((e, i) => (
            <ExerciseCard key={e.slug} exercise={e} index={i} />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            icon={<Search className="h-6 w-6" />}
            title="No exercises found"
            description="Try adjusting your search or clearing the filters."
            action={
              <button
                onClick={reset}
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Clear filters
              </button>
            }
          />
        </div>
      )}
    </main>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              value === opt
                ? "border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.18)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
