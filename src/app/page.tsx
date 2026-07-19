import Link from "next/link";
import {
  Flame,
  Dumbbell,
  HeartPulse,
  Target,
  ArrowRight,
  CalendarCheck,
  Sparkles,
} from "lucide-react";
import { getDashboardStats, getRecentLogs, getPrograms, getProfile } from "@/lib/queries";
import { StatCard } from "@/components/StatCard";
import { VolumeChart, PainTrendChart, CategoryDonut } from "@/components/Charts";
import { SectionTitle, Badge } from "@/components/ui";
import { ExerciseCard } from "@/components/ExerciseCard";
import { relativeDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recent, programs, profile] = await Promise.all([
    getDashboardStats(),
    getRecentLogs(6),
    getPrograms(),
    getProfile(),
  ]);

  const focus = programs.find((p) => p.isDefault) ?? programs[0];
  const painDelta =
    stats.avgPain7d != null && stats.avgPainPrev7d != null
      ? Math.round((stats.avgPain7d - stats.avgPainPrev7d) * 10) / 10
      : null;
  const weekPct = Math.min(
    100,
    Math.round((stats.thisWeekSessions / Math.max(1, stats.weeklyTarget)) * 100),
  );

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      {/* Hero */}
      <section className="card animate-fade-up relative overflow-hidden p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.35),transparent_60%)]" />
        <div className="absolute right-24 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.25),transparent_60%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="border-[rgba(139,92,246,0.35)] bg-[rgba(139,92,246,0.14)] text-[var(--color-brand)]">
              <Sparkles className="h-3 w-3" /> {greeting()}
            </Badge>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Välkommen tillbaka,{" "}
              <span className="gradient-text">{profile.name}</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-[var(--color-muted)]">
              {profile.goal} · Du har tränat{" "}
              <span className="font-semibold text-white">
                {stats.thisWeekSessions}/{stats.weeklyTarget}
              </span>{" "}
              dagar denna vecka. Håll flytet uppe.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {focus && (
                <Link
                  href={`/programs/${focus.id}`}
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
                >
                  Starta {focus.emoji} {focus.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[rgba(139,92,246,0.4)]"
              >
                Bläddra bland övningar
              </Link>
            </div>
          </div>

          {/* Weekly ring */}
          <div className="flex items-center gap-5">
            <WeeklyRing pct={weekPct} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
                Veckomål
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {stats.thisWeekSessions}
                <span className="text-base font-semibold text-[var(--color-muted)]">
                  {" "}
                  / {stats.weeklyTarget}
                </span>
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-muted)]">
                <Flame className="h-3.5 w-3.5 text-[var(--color-amber)]" />
                {stats.streak} dagars svit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          index={0}
          icon={<CalendarCheck className="h-5 w-5" />}
          label="Antal pass"
          value={stats.totalSessions}
          hint={`${stats.totalSets} set loggade`}
          accent="var(--color-brand)"
        />
        <StatCard
          index={1}
          icon={<Dumbbell className="h-5 w-5" />}
          label="Totala reps"
          value={stats.totalReps.toLocaleString("sv-SE")}
          hint="över alla övningar"
          accent="var(--color-accent)"
        />
        <StatCard
          index={2}
          icon={<HeartPulse className="h-5 w-5" />}
          label="Snittsmärta (7d)"
          value={stats.avgPain7d != null ? `${stats.avgPain7d}/10` : "—"}
          hint={painDelta != null ? "mot förra veckan" : "logga för att följa"}
          trend={painDelta != null ? { value: painDelta, goodWhenDown: true } : undefined}
          accent="var(--color-mint)"
        />
        <StatCard
          index={3}
          icon={<Target className="h-5 w-5" />}
          label="Övningar loggade"
          value={`${stats.exercisesTracked}/${stats.totalExercises}`}
          hint="i din övningsbank"
          accent="var(--color-amber)"
        />
      </section>

      {/* Charts */}
      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card animate-fade-up p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Träningsvolym</h2>
              <p className="text-xs text-[var(--color-muted)]">
                Utförda reps · senaste 14 dagarna
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-[var(--color-rose)]">
                ~{stats.totalKcal.toLocaleString("sv-SE")}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                kcal brända
              </p>
            </div>
          </div>
          <VolumeChart data={stats.volumeByDay} />
        </div>
        <div className="card animate-fade-up p-5">
          <h2 className="font-bold">Fördelning</h2>
          <p className="mb-4 text-xs text-[var(--color-muted)]">Set per kategori</p>
          {stats.categoryBreakdown.length ? (
            <CategoryDonut data={stats.categoryBreakdown} />
          ) : (
            <p className="py-8 text-center text-sm text-[var(--color-muted)]">
              Logga ett pass för att se din fördelning.
            </p>
          )}
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="card animate-fade-up p-5 lg:col-span-2">
          <div className="mb-2">
            <h2 className="font-bold">Smärttrend</h2>
            <p className="text-xs text-[var(--color-muted)]">
              Lägre är bättre · din återhämtningssignal
            </p>
          </div>
          {stats.painTrend.length ? (
            <PainTrendChart data={stats.painTrend} />
          ) : (
            <p className="py-16 text-center text-sm text-[var(--color-muted)]">
              Ingen smärtdata än — logga ett rehabpass för att börja följa din
              återhämtning.
            </p>
          )}
        </div>

        {/* Senaste aktivitet */}
        <div className="card animate-fade-up p-5">
          <h2 className="mb-4 font-bold">Senaste aktivitet</h2>
          {recent.length ? (
            <ul className="flex flex-col gap-3">
              {recent.map((log) => (
                <li key={log.id} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-surface-2)] text-sm">
                    💪
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {log.exercise.name}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {log.sets}×{log.reps} · smärta {log.painLevel}/10
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--color-muted)]">
                    {relativeDate(log.performedAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--color-muted)]">
              Dina loggade pass visas här.
            </p>
          )}
        </div>
      </section>

      {/* Fokusprogram */}
      {focus && (
        <section className="mt-8">
          <SectionTitle
            title="Fortsätt ditt program"
            href="/programs"
            linkLabel="Alla program"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {focus.exercises.slice(0, 4).map((pe, i) => (
              <ExerciseCard key={pe.id} exercise={pe.exercise} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "God morgon";
  if (h < 18) return "God eftermiddag";
  return "God kväll";
}

function WeeklyRing({ pct }: { pct: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#1e2230" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-lg font-extrabold">{pct}%</span>
      </div>
    </div>
  );
}
