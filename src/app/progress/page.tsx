import Link from "next/link";
import { Activity, TrendingDown, TrendingUp, Dumbbell } from "lucide-react";
import { getDashboardStats, getExerciseProgress } from "@/lib/queries";
import { VolumeChart, PainTrendChart, MiniBars } from "@/components/Charts";
import { PageHeader, EmptyState, Badge } from "@/components/ui";
import { youtubeThumb, categoryColor, relativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const [stats, progress] = await Promise.all([
    getDashboardStats(),
    getExerciseProgress(),
  ]);

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader
        eyebrow="Progress"
        title="Track your recovery"
        subtitle="Every logged set builds the picture. Watch your volume climb and your pain levels fall."
      />

      {/* Overview charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold">Training volume</h2>
          <p className="mb-2 text-xs text-[var(--color-muted)]">
            Reps · last 14 days
          </p>
          <VolumeChart data={stats.volumeByDay} />
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Pain trend</h2>
          <p className="mb-2 text-xs text-[var(--color-muted)]">
            Average per session · lower is better
          </p>
          {stats.painTrend.length ? (
            <PainTrendChart data={stats.painTrend} />
          ) : (
            <p className="grid h-[220px] place-items-center text-sm text-[var(--color-muted)]">
              Log a rehab session to track pain.
            </p>
          )}
        </div>
      </div>

      {/* Per-exercise progress */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Exercise breakdown</h2>
        {progress.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-6 w-6" />}
            title="No progress logged yet"
            description="Head to any exercise and log your first set. Your tracked exercises will show up here with trends and personal records."
            action={
              <Link
                href="/library"
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Browse exercises
              </Link>
            }
          />
        ) : (
          <div className="grid gap-3">
            {progress.map((p, i) => {
              const painDelta =
                p.firstPain != null && p.lastPain != null
                  ? p.lastPain - p.firstPain
                  : null;
              return (
                <Link
                  key={p.id}
                  href={`/exercise/${p.slug}`}
                  className="card card-hover animate-fade-up flex items-center gap-4 p-3 sm:p-4"
                  style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={youtubeThumb(p.videoId)}
                    alt={p.name}
                    className="hidden h-14 w-20 rounded-lg object-cover sm:block"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                      <span style={{ color: categoryColor(p.category) }}>
                        {p.category}
                      </span>
                      <span>·</span>
                      <span>{p.sessions} sessions</span>
                      <span>·</span>
                      <span>
                        {p.lastPerformed ? relativeDate(p.lastPerformed) : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="hidden w-24 sm:block">
                    <MiniBars data={p.spark} />
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-extrabold tabular-nums">
                      {p.totalVolume.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                      total reps
                    </p>
                  </div>

                  {p.isRehab && painDelta != null && (
                    <Badge
                      className={
                        painDelta <= 0
                          ? "border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.12)] text-[var(--color-mint)]"
                          : "border-[rgba(251,113,133,0.3)] bg-[rgba(251,113,133,0.12)] text-[var(--color-rose)]"
                      }
                    >
                      {painDelta <= 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      pain {painDelta > 0 ? "+" : ""}
                      {painDelta}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
