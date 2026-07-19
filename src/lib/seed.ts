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
  // Upsert every curated exercise, refreshing all fields. This both seeds an
  // empty database and keeps an already-seeded one in sync when the curated
  // content changes (e.g. translations, new videos, new exercises). Runs once
  // per process cold start thanks to the ensureSeeded promise guard.
  for (const ex of EXERCISES) {
    const data = {
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
      kcalPerSet: ex.kcalPerSet,
      isRehab: ex.isRehab,
    };
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: data,
      create: { slug: ex.slug, ...data },
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
        goal: prog.goal,
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
