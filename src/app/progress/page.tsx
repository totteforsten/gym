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
        eyebrow="Framsteg"
        title="Följ din utveckling"
        subtitle="Varje loggat set bygger bilden. Se din volym stiga och dina smärtnivåer falla."
      />

      {/* Översiktsdiagram */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold">Träningsvolym</h2>
          <p className="mb-2 text-xs text-[var(--color-muted)]">
            Reps · senaste 14 dagarna
          </p>
          <VolumeChart data={stats.volumeByDay} />
        </div>
        <div className="card p-5">
          <h2 className="font-bold">Smärttrend</h2>
          <p className="mb-2 text-xs text-[var(--color-muted)]">
            Snitt per pass · lägre är bättre
          </p>
          {stats.painTrend.length ? (
            <PainTrendChart data={stats.painTrend} />
          ) : (
            <p className="grid h-[220px] place-items-center text-sm text-[var(--color-muted)]">
              Logga ett rehabpass för att följa smärtan.
            </p>
          )}
        </div>
      </div>

      {/* Framsteg per övning */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Fördelning per övning</h2>
        {progress.length === 0 ? (
          <EmptyState
            icon={<Activity className="h-6 w-6" />}
            title="Inga framsteg loggade än"
            description="Gå till valfri övning och logga ditt första set. Dina loggade övningar dyker upp här med trender och personliga rekord."
            action={
              <Link
                href="/library"
                className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Bläddra bland övningar
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
                      <span>{p.sessions} pass</span>
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
                      totala reps
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
                      smärta {painDelta > 0 ? "+" : ""}
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
