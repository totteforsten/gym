"use server";

import { prisma } from "./prisma";
import { ensureSeeded } from "./seed";
import { revalidatePath } from "next/cache";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Accepts a raw YouTube id, a full watch/share/embed URL, and returns the id. */
function parseVideoId(input: string): string {
  const s = input.trim();
  if (!s) return "";
  // Already looks like a bare id
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return s;
}

export async function createExercise(input: {
  name: string;
  description: string;
  category: string;
  bodyPart: string;
  difficulty: string;
  equipment: string;
  video: string;
  instructions: string[];
  targetMuscles: string[];
  defaultSets: number;
  defaultReps: number;
  isRehab: boolean;
}) {
  await ensureSeeded();
  const base = slugify(input.name) || "exercise";
  let slug = base;
  let n = 1;
  while (await prisma.exercise.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const exercise = await prisma.exercise.create({
    data: {
      slug,
      name: input.name.trim() || "New Exercise",
      description: input.description.trim() || "A custom exercise.",
      category: input.category,
      bodyPart: input.bodyPart,
      difficulty: input.difficulty,
      equipment: input.equipment,
      videoId: parseVideoId(input.video),
      instructions: input.instructions
        .map((s) => s.trim())
        .filter(Boolean),
      targetMuscles: input.targetMuscles
        .map((s) => s.trim())
        .filter(Boolean),
      tags: [input.category.toLowerCase(), input.bodyPart.toLowerCase()],
      defaultSets: Math.max(1, Math.round(input.defaultSets)),
      defaultReps: Math.max(1, Math.round(input.defaultReps)),
      isRehab: input.isRehab,
    },
  });
  revalidatePath("/library");
  revalidatePath("/");
  return exercise;
}

export async function deleteExercise(id: string) {
  await prisma.exercise.delete({ where: { id } });
  revalidatePath("/library");
}

export async function logWorkout(input: {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  painLevel?: number;
  rpe?: number;
  notes?: string;
}) {
  await ensureSeeded();
  const log = await prisma.workoutLog.create({
    data: {
      exerciseId: input.exerciseId,
      sets: Math.max(1, Math.round(input.sets)),
      reps: Math.max(1, Math.round(input.reps)),
      weight: Math.max(0, input.weight ?? 0),
      painLevel: Math.min(10, Math.max(0, Math.round(input.painLevel ?? 0))),
      rpe: Math.min(10, Math.max(1, Math.round(input.rpe ?? 5))),
      notes: input.notes?.trim() || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/progress");
  revalidatePath("/library");
  return log;
}

export async function deleteLog(id: string) {
  await prisma.workoutLog.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/progress");
}

export async function createProgram(input: {
  name: string;
  description: string;
  emoji: string;
  color: string;
}) {
  await ensureSeeded();
  const program = await prisma.program.create({
    data: {
      name: input.name.trim() || "New Program",
      description: input.description.trim(),
      emoji: input.emoji || "🏋️",
      color: input.color || "#6366f1",
    },
  });
  revalidatePath("/programs");
  return program;
}

export async function deleteProgram(id: string) {
  await prisma.program.delete({ where: { id } });
  revalidatePath("/programs");
}

export async function addExerciseToProgram(input: {
  programId: string;
  exerciseId: string;
  sets?: number;
  reps?: number;
}) {
  const ex = await prisma.exercise.findUnique({ where: { id: input.exerciseId } });
  const count = await prisma.programExercise.count({
    where: { programId: input.programId },
  });
  await prisma.programExercise.upsert({
    where: {
      programId_exerciseId: {
        programId: input.programId,
        exerciseId: input.exerciseId,
      },
    },
    update: {},
    create: {
      programId: input.programId,
      exerciseId: input.exerciseId,
      order: count,
      sets: input.sets ?? ex?.defaultSets ?? 3,
      reps: input.reps ?? ex?.defaultReps ?? 12,
    },
  });
  revalidatePath("/programs");
  revalidatePath(`/programs/${input.programId}`);
}

export async function removeExerciseFromProgram(input: {
  programId: string;
  exerciseId: string;
}) {
  await prisma.programExercise.deleteMany({
    where: { programId: input.programId, exerciseId: input.exerciseId },
  });
  revalidatePath("/programs");
  revalidatePath(`/programs/${input.programId}`);
}

export async function updateProgramExercise(input: {
  programId: string;
  exerciseId: string;
  sets: number;
  reps: number;
}) {
  await prisma.programExercise.updateMany({
    where: { programId: input.programId, exerciseId: input.exerciseId },
    data: {
      sets: Math.max(1, Math.round(input.sets)),
      reps: Math.max(1, Math.round(input.reps)),
    },
  });
  revalidatePath(`/programs/${input.programId}`);
}

export async function updateProfile(input: {
  name: string;
  goal: string;
  weeklyTarget: number;
  heightCm: number;
  weightKg: number;
}) {
  await ensureSeeded();
  await prisma.profile.update({
    where: { id: "me" },
    data: {
      name: input.name.trim() || "Athlete",
      goal: input.goal.trim(),
      weeklyTarget: Math.min(7, Math.max(1, Math.round(input.weeklyTarget))),
      heightCm: Math.max(0, Math.round(input.heightCm)),
      weightKg: Math.max(0, input.weightKg),
    },
  });
  revalidatePath("/profile");
  revalidatePath("/");
}
