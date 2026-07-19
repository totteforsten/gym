"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Dumbbell, Flame } from "lucide-react";
import { PageHeader, Badge } from "@/components/ui";
import { CreateProgramButton } from "@/components/CreateProgramButton";
import { youtubeThumb, goalColor, GOALS } from "@/lib/utils";

type Program = {
  id: string;
  name: string;
  description: string;
  color: string;
  emoji: string;
  goal: string;
  isDefault: boolean;
  exerciseCount: number;
  totalSets: number;
  kcal: number;
  thumbs: { id: string; videoId: string }[];
};

export function ProgramsClient({ programs }: { programs: Program[] }) {
  const [goal, setGoal] = useState("Alla");

  const filtered = useMemo(
    () => (goal === "Alla" ? programs : programs.filter((p) => p.goal === goal)),
    [programs, goal],
  );

  // Only show goal chips that actually exist among the programs (+ "Alla").
  const availableGoals = GOALS.filter(
    (g) => g === "Alla" || programs.some((p) => p.goal === g),
  );

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader
        eyebrow="Program"
        title="Dina träningsprogram"
        subtitle="Strukturerade rutiner byggda av övningsbanken. Följ de färdiga programmen eller skapa egna – filtrera på ditt mål."
        action={<CreateProgramButton />}
      />

      {/* Goal filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {availableGoals.map((g) => {
          const active = goal === g;
          const color = g === "Alla" ? "#8b5cf6" : goalColor(g);
          return (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "text-white"
                  : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-white"
              }`}
              style={
                active
                  ? { background: `${color}26`, borderColor: `${color}66` }
                  : undefined
              }
            >
              {g}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {filtered.map((p, idx) => (
          <Link
            key={p.id}
            href={`/programs/${p.id}`}
            className="card card-hover group animate-fade-up overflow-hidden"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div
              className="relative h-28 overflow-hidden"
              style={{
                background: `linear-gradient(120deg, ${p.color}33, ${p.color}0a)`,
              }}
            >
              <div className="absolute inset-0 flex items-center gap-1 opacity-40">
                {p.thumbs.map((pe) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={pe.id}
                    src={youtubeThumb(pe.videoId)}
                    alt=""
                    className="h-full w-1/4 object-cover"
                  />
                ))}
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent, var(--color-surface))`,
                }}
              />
              <div className="absolute left-5 top-5 flex items-center gap-3">
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl text-2xl shadow-lg"
                  style={{
                    background: `${p.color}30`,
                    border: `1px solid ${p.color}55`,
                  }}
                >
                  {p.emoji}
                </span>
                {p.isDefault && (
                  <Badge className="border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.2)] text-white">
                    Rekommenderas
                  </Badge>
                )}
              </div>
              <span
                className="absolute right-4 top-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur"
                style={{
                  background: `${goalColor(p.goal)}22`,
                  color: goalColor(p.goal),
                  border: `1px solid ${goalColor(p.goal)}44`,
                }}
              >
                {p.goal}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight transition-colors group-hover:text-[var(--color-brand)]">
                  {p.name}
                </h3>
                <ArrowRight className="h-5 w-5 shrink-0 text-[var(--color-muted)] transition-transform group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-muted)]">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Dumbbell className="h-4 w-4" style={{ color: p.color }} />
                  {p.exerciseCount} övningar
                </span>
                <span>·</span>
                <span>{p.totalSets} set</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-rose)]">
                  <Flame className="h-3.5 w-3.5" />~{p.kcal} kcal
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
