import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Dumbbell,
  Target,
  Layers,
  ListOrdered,
  History,
} from "lucide-react";
import { getExerciseBySlug, getPrograms } from "@/lib/queries";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Badge } from "@/components/ui";
import { LogWorkoutForm } from "@/components/LogWorkoutForm";
import { AddToProgramMenu } from "@/components/AddToProgramMenu";
import { ExerciseHistory } from "@/components/ExerciseHistory";
import { difficultyColor, categoryColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [exercise, programs] = await Promise.all([
    getExerciseBySlug(slug),
    getPrograms(),
  ]);
  if (!exercise) notFound();

  const inPrograms = new Set(exercise.programItems.map((pi) => pi.programId));
  const logs = exercise.logs.map((l) => ({
    id: l.id,
    performedAt: l.performedAt.toISOString(),
    sets: l.sets,
    reps: l.reps,
    weight: l.weight,
    painLevel: l.painLevel,
    rpe: l.rpe,
    notes: l.notes,
  }));

  const bestSet = logs.reduce(
    (best, l) => (l.weight > (best?.weight ?? -1) ? l : best),
    logs[0],
  );

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <Link
        href="/library"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to library
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: `${categoryColor(exercise.category)}22`,
                  color: categoryColor(exercise.category),
                  border: `1px solid ${categoryColor(exercise.category)}44`,
                }}
              >
                {exercise.category}
              </span>
              <Badge className={difficultyColor(exercise.difficulty)}>
                {exercise.difficulty}
              </Badge>
              {exercise.isRehab && (
                <Badge className="border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.15)] text-[var(--color-brand)]">
                  Rehab
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {exercise.name}
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--color-muted)]">
              {exercise.description}
            </p>
          </div>

          <VideoPlayer videoId={exercise.videoId} name={exercise.name} />

          {/* Meta cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetaCard icon={<Dumbbell className="h-4 w-4" />} label="Equipment" value={exercise.equipment} />
            <MetaCard icon={<Target className="h-4 w-4" />} label="Body part" value={exercise.bodyPart} />
            <MetaCard icon={<Layers className="h-4 w-4" />} label="Suggested" value={`${exercise.defaultSets}×${exercise.defaultReps}`} />
            <MetaCard icon={<History className="h-4 w-4" />} label="Times logged" value={String(logs.length)} />
          </div>

          {/* Instructions */}
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-[var(--color-brand)]" />
              <h2 className="text-lg font-bold">How to perform</h2>
            </div>
            <ol className="flex flex-col gap-4">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(139,92,246,0.15)] text-sm font-bold text-[var(--color-brand)]">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-relaxed text-[var(--color-fg)]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-5">
              <span className="text-xs font-semibold text-[var(--color-muted)]">
                Targets:
              </span>
              {exercise.targetMuscles.map((m) => (
                <span key={m} className="chip px-2.5 py-0.5 text-xs">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* History */}
          <ExerciseHistory logs={logs} bestWeight={bestSet?.weight ?? 0} />
        </div>

        {/* Right column — sticky action panel */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <div className="flex flex-col gap-4">
            <LogWorkoutForm
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              defaultSets={exercise.defaultSets}
              defaultReps={exercise.defaultReps}
              isRehab={exercise.isRehab}
            />
            <AddToProgramMenu
              exerciseId={exercise.id}
              programs={programs.map((p) => ({
                id: p.id,
                name: p.name,
                emoji: p.emoji,
              }))}
              inPrograms={Array.from(inPrograms)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-3.5">
      <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 truncate text-sm font-bold">{value}</p>
    </div>
  );
}
