import { prisma } from "./prisma";
import { EXERCISES } from "@/data/exercises";
import { PROGRAMS } from "@/data/programs";

let seedPromise: Promise<void> | null = null;

/**
 * Idempotently seeds the database with the curated exercise library, the
 * prebuilt programs and a default profile. Safe to call on every request —
 * it no-ops once data exists, and the in-process promise guard prevents
 * concurrent double-seeding during a cold start.
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
    await ensureProfile();
    return;
  }

  // Exercises
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

  // Programs + their exercises
  for (const prog of PROGRAMS) {
    const created = await prisma.program.create({
      data: {
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

  await ensureProfile();
}

async function ensureProfile(): Promise<void> {
  await prisma.profile.upsert({
    where: { id: "me" },
    update: {},
    create: { id: "me" },
  });
}
