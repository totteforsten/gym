import {
  Flame,
  Dumbbell,
  CalendarCheck,
  Trophy,
  Target,
  HeartPulse,
  LogOut,
} from "lucide-react";
import { getProfile, getDashboardStats } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/lib/auth-actions";
import { PageHeader } from "@/components/ui";
import { ProfileForm } from "@/components/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [profile, stats, user] = await Promise.all([
    getProfile(),
    getDashboardStats(),
    getCurrentUser(),
  ]);

  const bmi =
    profile.heightCm > 0
      ? (profile.weightKg / Math.pow(profile.heightCm / 100, 2)).toFixed(1)
      : "—";

  const achievements = [
    { icon: "🏁", label: "Första steget", desc: "Logga ditt första pass", unlocked: stats.totalSessions >= 1 },
    { icon: "🔥", label: "På gång", desc: "3 dagars svit", unlocked: stats.streak >= 3 },
    { icon: "💪", label: "Ihärdig", desc: "10 pass totalt", unlocked: stats.totalSessions >= 10 },
    { icon: "🎯", label: "Utforskare", desc: "Logga 5 övningar", unlocked: stats.exercisesTracked >= 5 },
    { icon: "📉", label: "Läkning", desc: "Minska veckans smärta", unlocked: stats.avgPain7d != null && stats.avgPainPrev7d != null && stats.avgPain7d < stats.avgPainPrev7d },
    { icon: "🏆", label: "Tusenklubben", desc: "1 000 reps totalt", unlocked: stats.totalReps >= 1000 },
    { icon: "⚡", label: "Kaloribrännare", desc: "Bränn 1 000 kcal", unlocked: stats.totalKcal >= 1000 },
    { icon: "📅", label: "Veckohjälte", desc: "Nå ditt veckomål", unlocked: stats.thisWeekSessions >= stats.weeklyTarget },
  ];

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <PageHeader
        eyebrow="Profil"
        title="Din profil"
        subtitle={user?.email ? `Inloggad som ${user.email}` : "Ställ in dina mål och se dina samlade prestationer."}
        action={
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm font-semibold text-[var(--color-muted)] transition-colors hover:border-[rgba(251,113,133,0.4)] hover:text-[var(--color-rose)]"
            >
              <LogOut className="h-4 w-4" /> Logga ut
            </button>
          </form>
        }
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Left: identity + edit */}
        <div className="flex flex-col gap-6">
          <div className="card relative overflow-hidden p-6 text-center">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(139,92,246,0.25)] to-transparent" />
            <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-4xl font-extrabold text-white shadow-xl shadow-[rgba(139,92,246,0.4)]">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="relative mt-4 text-xl font-extrabold">{profile.name}</h2>
            <p className="relative text-sm text-[var(--color-brand)]">{profile.goal}</p>

            <div className="relative mt-6 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-5">
              <MiniStat label="Längd" value={`${profile.heightCm}cm`} />
              <MiniStat label="Vikt" value={`${profile.weightKg}kg`} />
              <MiniStat label="BMI" value={bmi} />
            </div>
          </div>

          <ProfileForm
            profile={{
              name: profile.name,
              goal: profile.goal,
              weeklyTarget: profile.weeklyTarget,
              heightCm: profile.heightCm,
              weightKg: profile.weightKg,
            }}
          />
        </div>

        {/* Right: stats + achievements */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
              Statistik totalt
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatTile icon={<CalendarCheck className="h-5 w-5" />} label="Pass" value={stats.totalSessions} accent="var(--color-brand)" />
              <StatTile icon={<Dumbbell className="h-5 w-5" />} label="Totala reps" value={stats.totalReps.toLocaleString("sv-SE")} accent="var(--color-accent)" />
              <StatTile icon={<Flame className="h-5 w-5" />} label="Kcal brända" value={`~${stats.totalKcal.toLocaleString("sv-SE")}`} accent="var(--color-rose)" />
              <StatTile icon={<Target className="h-5 w-5" />} label="Övningar" value={stats.exercisesTracked} accent="var(--color-mint)" />
              <StatTile icon={<HeartPulse className="h-5 w-5" />} label="Snittsmärta" value={stats.avgPain7d != null ? `${stats.avgPain7d}` : "—"} accent="var(--color-amber)" />
              <StatTile icon={<Trophy className="h-5 w-5" />} label="Set" value={stats.totalSets} accent="var(--color-brand-2)" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
              Prestationer
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {achievements.map((a) => (
                <div
                  key={a.label}
                  className={`card p-4 text-center transition-all ${
                    a.unlocked ? "" : "opacity-40 grayscale"
                  }`}
                >
                  <div className="text-3xl">{a.icon}</div>
                  <p className="mt-2 text-sm font-bold">{a.label}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </p>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="card p-4">
      <span
        className="grid h-9 w-9 place-items-center rounded-lg"
        style={{ background: `${accent}20`, color: accent }}
      >
        {icon}
      </span>
      <p className="mt-3 text-2xl font-extrabold tabular-nums">{value}</p>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
    </div>
  );
}
