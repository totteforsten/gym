import { prisma } from "./prisma";
import { EXERCISES } from "@/data/exercises";
import { PROGRAMS } from "@/data/programs";

let seedPromise: Promise<void> | null = null;

/**
 * Idempotently seeds the GLOBAL, shared exercise library. Safe to call on
 * every request — it no-ops once data exists, and the in-process promise
 * guard prevents concurrent double-seeding during a cold start. Per-user
 * data (programs, profile) is created separately by ensureUserData().
 */
export async function ensureSeeded(): Promise<void> {
  if (seedPromise) return seedPromise;
  seedPromise = runSeed().catch((err) => {
    // Reset so a transient failure (e.g. DB waking up) can retry next call.
    seedPromise = null;
    throw err;
  });
  return seedPromise;
}

async function runSeed(): Promise<void> {
  const existing = await prisma.exercise.count();
  if (existing > 0) {
    await syncCuratedVideos();
    return;
  }

  for (const ex of EXERCISES) {
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: {},
      create: {
        slug: ex.slug,
        name: ex.name,
        description: ex.description,
        category: ex.category,
        bodyPart: ex.bodyPart,
        difficulty: ex.difficulty,
        equipment: ex.equipment,
        videoId: ex.videoId,
        instructions: ex.instructions,
        targetMuscles: ex.targetMuscles,
        tags: ex.tags,
        defaultSets: ex.defaultSets,
        defaultReps: ex.defaultReps,
        isRehab: ex.isRehab,
      },
    });
  }
}

/**
 * Creates a new user's starter data: a profile and their own copy of the
 * prebuilt programs. Idempotent — runs once per user (guarded by whether the
 * user already has a profile). Called right after sign-up.
 */
export async function ensureUserData(userId: string): Promise<void> {
  await ensureSeeded();

  const existingProfile = await prisma.profile.findUnique({ where: { userId } });
  if (existingProfile) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await prisma.profile.create({
    data: { userId, name: user?.name ?? "Athlete" },
  });

  for (const prog of PROGRAMS) {
    const created = await prisma.program.create({
      data: {
        userId,
        name: prog.name,
        description: prog.description,
        color: prog.color,
        emoji: prog.emoji,
        isDefault: prog.isDefault,
      },
    });

    for (let i = 0; i < prog.exercises.length; i++) {
      const item = prog.exercises[i];
      const exercise = await prisma.exercise.findUnique({
        where: { slug: item.slug },
      });
      if (!exercise) continue;
      await prisma.programExercise.create({
        data: {
          programId: created.id,
          exerciseId: exercise.id,
          order: i,
          sets: item.sets,
          reps: item.reps,
        },
      });
    }
  }
}

/**
 * Keeps the curated exercises' demonstration videos in sync with the seed
 * data on databases that were seeded before a video was updated. Runs once
 * per process cold start (guarded by the ensureSeeded promise) and only
 * writes rows whose videoId actually differs.
 */
async function syncCuratedVideos(): Promise<void> {
  for (const ex of EXERCISES) {
    await prisma.exercise.updateMany({
      where: { slug: ex.slug, NOT: { videoId: ex.videoId } },
      data: { videoId: ex.videoId },
    });
  }
}
