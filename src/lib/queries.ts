import { prisma } from "./prisma";
import { ensureSeeded, ensureUserData } from "./seed";
import { requireUserId } from "./auth";

// All reads go through here so the DB is guaranteed seeded before first use.
// User-scoped reads pull the signed-in user's id from the session cookie.

export async function getExercises(filters?: {
  q?: string;
  category?: string;
  difficulty?: string;
  bodyPart?: string;
}) {
  await ensureSeeded();
  const exercises = await prisma.exercise.findMany({
    orderBy: [{ isRehab: "desc" }, { name: "asc" }],
    include: { _count: { select: { logs: true } } },
  });

  let filtered = exercises;
  if (filters?.q) {
    const q = filters.q.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.targetMuscles.some((m) => m.toLowerCase().includes(q)),
    );
  }
  if (filters?.category && filters.category !== "All")
    filtered = filtered.filter((e) => e.category === filters.category);
  if (filters?.difficulty && filters.difficulty !== "All")
    filtered = filtered.filter((e) => e.difficulty === filters.difficulty);
  if (filters?.bodyPart && filters.bodyPart !== "All")
    filtered = filtered.filter((e) => e.bodyPart === filters.bodyPart);

  return filtered;
}

export async function getExerciseBySlug(slug: string) {
  await ensureSeeded();
  const userId = await requireUserId();
  return prisma.exercise.findUnique({
    where: { slug },
    include: {
      logs: {
        where: { userId },
        orderBy: { performedAt: "desc" },
        take: 50,
      },
      programItems: {
        where: { program: { userId } },
        include: { program: true },
      },
    },
  });
}

export async function getPrograms() {
  const userId = await requireUserId();
  await ensureUserData(userId);
  return prisma.program.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: true },
      },
    },
  });
}

export async function getProgram(id: string) {
  const userId = await requireUserId();
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: {
          exercise: {
            include: {
              logs: {
                where: { userId },
                orderBy: { performedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
  // Don't leak another user's program.
  if (!program || program.userId !== userId) return null;
  return program;
}

export async function getProfile() {
  const userId = await requireUserId();
  await ensureUserData(userId);
  return prisma.profile.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

export async function getRecentLogs(take = 8) {
  const userId = await requireUserId();
  return prisma.workoutLog.findMany({
    where: { userId },
    orderBy: { performedAt: "desc" },
    take,
    include: { exercise: true },
  });
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export type DashboardStats = {
  totalSessions: number;
  totalSets: number;
  totalReps: number;
  thisWeekSessions: number;
  weeklyTarget: number;
  streak: number;
  avgPain7d: number | null;
  avgPainPrev7d: number | null;
  exercisesTracked: number;
  totalExercises: number;
  volumeByDay: { date: string; label: string; sessions: number; reps: number }[];
  painTrend: { date: string; label: string; pain: number }[];
  categoryBreakdown: { name: string; value: number }[];
};

export type ExerciseProgress = {
  id: string;
  slug: string;
  name: string;
  videoId: string;
  category: string;
  isRehab: boolean;
  sessions: number;
  totalVolume: number;
  bestWeight: number;
  lastPain: number | null;
  firstPain: number | null;
  lastPerformed: string | null;
  spark: { reps: number }[];
};

export async function getExerciseProgress(): Promise<ExerciseProgress[]> {
  await ensureSeeded();
  const userId = await requireUserId();
  const exercises = await prisma.exercise.findMany({
    where: { logs: { some: { userId } } },
    include: {
      logs: { where: { userId }, orderBy: { performedAt: "asc" } },
    },
  });

  return exercises
    .map((e) => {
      const logs = e.logs;
      const spark = logs.slice(-8).map((l) => ({ reps: l.sets * l.reps }));
      return {
        id: e.id,
        slug: e.slug,
        name: e.name,
        videoId: e.videoId,
        category: e.category,
        isRehab: e.isRehab,
        sessions: logs.length,
        totalVolume: logs.reduce((s, l) => s + l.sets * l.reps, 0),
        bestWeight: logs.reduce((m, l) => Math.max(m, l.weight), 0),
        lastPain: logs.length ? logs[logs.length - 1].painLevel : null,
        firstPain: logs.length ? logs[0].painLevel : null,
        lastPerformed: logs.length
          ? logs[logs.length - 1].performedAt.toISOString()
          : null,
        spark,
      };
    })
    .sort((a, b) =>
      (b.lastPerformed ?? "").localeCompare(a.lastPerformed ?? ""),
    );
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await ensureSeeded();
  const userId = await requireUserId();
  const [logs, profile, totalExercises] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { userId },
      orderBy: { performedAt: "asc" },
      include: { exercise: true },
    }),
    getProfile(),
    prisma.exercise.count(),
  ]);

  const now = new Date();
  const today = startOfDay(now);
  const dayMs = 86400000;

  // Distinct training days
  const dayKeys = new Set(
    logs.map((l) => startOfDay(l.performedAt).toISOString()),
  );

  // Sessions = distinct days
  const totalSessions = dayKeys.size;
  const totalSets = logs.reduce((s, l) => s + l.sets, 0);
  const totalReps = logs.reduce((s, l) => s + l.sets * l.reps, 0);

  // This week (last 7 days)
  const weekAgo = new Date(today.getTime() - 6 * dayMs);
  const thisWeekDays = new Set(
    logs
      .filter((l) => l.performedAt >= weekAgo)
      .map((l) => startOfDay(l.performedAt).toISOString()),
  );

  // Streak: consecutive days back from today (or yesterday) with a log
  let streak = 0;
  let cursor = today;
  if (!dayKeys.has(cursor.toISOString())) {
    cursor = new Date(cursor.getTime() - dayMs); // allow streak if trained yesterday
  }
  while (dayKeys.has(cursor.toISOString())) {
    streak++;
    cursor = new Date(cursor.getTime() - dayMs);
  }

  // Pain averages
  const painWindow = (from: Date, to: Date) => {
    const inWindow = logs.filter(
      (l) => l.performedAt >= from && l.performedAt < to,
    );
    if (inWindow.length === 0) return null;
    return (
      Math.round(
        (inWindow.reduce((s, l) => s + l.painLevel, 0) / inWindow.length) * 10,
      ) / 10
    );
  };
  const avgPain7d = painWindow(new Date(today.getTime() - 6 * dayMs), new Date(now.getTime() + dayMs));
  const avgPainPrev7d = painWindow(
    new Date(today.getTime() - 13 * dayMs),
    new Date(today.getTime() - 6 * dayMs),
  );

  // Volume by day (last 14 days)
  const volumeByDay: DashboardStats["volumeByDay"] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today.getTime() - i * dayMs);
    const key = d.toISOString();
    const dayLogs = logs.filter(
      (l) => startOfDay(l.performedAt).toISOString() === key,
    );
    volumeByDay.push({
      date: key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sessions: dayLogs.length > 0 ? 1 : 0,
      reps: dayLogs.reduce((s, l) => s + l.sets * l.reps, 0),
    });
  }

  // Pain trend (per training day, last 10 sessions)
  const painByDay = new Map<string, { sum: number; n: number; date: Date }>();
  for (const l of logs) {
    const key = startOfDay(l.performedAt).toISOString();
    const cur = painByDay.get(key) ?? { sum: 0, n: 0, date: startOfDay(l.performedAt) };
    cur.sum += l.painLevel;
    cur.n += 1;
    painByDay.set(key, cur);
  }
  const painTrend = Array.from(painByDay.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-10)
    .map((v) => ({
      date: v.date.toISOString(),
      label: v.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      pain: Math.round((v.sum / v.n) * 10) / 10,
    }));

  // Category breakdown by sets
  const catMap = new Map<string, number>();
  for (const l of logs) {
    catMap.set(l.exercise.category, (catMap.get(l.exercise.category) ?? 0) + l.sets);
  }
  const categoryBreakdown = Array.from(catMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  const exercisesTracked = new Set(logs.map((l) => l.exerciseId)).size;

  return {
    totalSessions,
    totalSets,
    totalReps,
    thisWeekSessions: thisWeekDays.size,
    weeklyTarget: profile.weeklyTarget,
    streak,
    avgPain7d,
    avgPainPrev7d,
    exercisesTracked,
    totalExercises,
    volumeByDay,
    painTrend,
    categoryBreakdown,
  };
}
