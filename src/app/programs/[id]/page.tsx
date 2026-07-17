import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Layers, Clock } from "lucide-react";
import { getProgram } from "@/lib/queries";
import { ProgramExercises } from "@/components/ProgramExercises";
import { DeleteProgramButton } from "@/components/DeleteProgramButton";
import { relativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgram(id);
  if (!program) notFound();

  const totalSets = program.exercises.reduce((s, e) => s + e.sets, 0);
  const estMinutes = Math.max(5, Math.round(totalSets * 1.5));

  const items = program.exercises.map((pe) => ({
    exerciseId: pe.exercise.id,
    slug: pe.exercise.slug,
    name: pe.exercise.name,
    videoId: pe.exercise.videoId,
    category: pe.exercise.category,
    difficulty: pe.exercise.difficulty,
    sets: pe.sets,
    reps: pe.reps,
    lastLogged: pe.exercise.logs[0]?.performedAt.toISOString() ?? null,
  }));

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <Link
        href="/programs"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> All programs
      </Link>

      <div
        className="card animate-fade-up relative overflow-hidden p-6 sm:p-8"
        style={{
          background: `linear-gradient(120deg, ${program.color}1f, rgba(255,255,255,0.02))`,
        }}
      >
        <div
          className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-30 blur-3xl"
          style={{ background: program.color }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl shadow-lg"
              style={{
                background: `${program.color}30`,
                border: `1px solid ${program.color}55`,
              }}
            >
              {program.emoji}
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {program.name}
              </h1>
              <p className="mt-1.5 max-w-xl text-sm text-[var(--color-muted)]">
                {program.description}
              </p>
            </div>
          </div>
          {!program.isDefault && <DeleteProgramButton programId={program.id} />}
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <Stat icon={<Dumbbell className="h-4 w-4" />} label={`${program.exercises.length} exercises`} />
          <Stat icon={<Layers className="h-4 w-4" />} label={`${totalSets} sets`} />
          <Stat icon={<Clock className="h-4 w-4" />} label={`~${estMinutes} min`} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-4 text-lg font-bold">Exercises in this program</h2>
        <ProgramExercises programId={program.id} items={items} />
      </div>
    </main>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1.5 text-xs font-semibold">
      <span className="text-[var(--color-brand)]">{icon}</span>
      {label}
    </span>
  );
}
