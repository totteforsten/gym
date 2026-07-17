import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";
import { getPrograms } from "@/lib/queries";
import { PageHeader, Badge } from "@/components/ui";
import { CreateProgramButton } from "@/components/CreateProgramButton";
import { youtubeThumb } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader
        eyebrow="Programs"
        title="Your training programs"
        subtitle="Structured routines built from the exercise library. Follow the prebuilt hip rehab plans or design your own."
        action={<CreateProgramButton />}
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {programs.map((p, idx) => {
          const thumbs = p.exercises.slice(0, 4);
          return (
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
                  {thumbs.map((pe) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={pe.id}
                      src={youtubeThumb(pe.exercise.videoId)}
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
                    style={{ background: `${p.color}30`, border: `1px solid ${p.color}55` }}
                  >
                    {p.emoji}
                  </span>
                  {p.isDefault && (
                    <Badge className="border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.2)] text-white">
                      Recommended
                    </Badge>
                  )}
                </div>
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
                <div className="mt-4 flex items-center gap-3 text-xs text-[var(--color-muted)]">
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <Dumbbell className="h-4 w-4" style={{ color: p.color }} />
                    {p.exercises.length} exercises
                  </span>
                  <span>·</span>
                  <span>
                    {p.exercises.reduce((s, e) => s + e.sets, 0)} total sets
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
