// Färdiga program på svenska. Varje program har ett mål (goal) som används
// för filtrering: Rehab, Bygg muskler, Bränn kalorier, Rörlighet, Kondition.

export type ProgramGoal =
  | "Rehab"
  | "Bygg muskler"
  | "Bränn kalorier"
  | "Rörlighet"
  | "Kondition";

export type SeedProgram = {
  name: string;
  description: string;
  color: string;
  emoji: string;
  goal: ProgramGoal;
  isDefault: boolean;
  exercises: { slug: string; sets: number; reps: number }[];
};

export const PROGRAMS: SeedProgram[] = [
  {
    name: "Höftrehab – Grund",
    description:
      "Ett fysioinspirerat 6-veckorsprogram för att bygga upp höftens styrka, stabilitet och rörlighet. Kör 3–4 ggr/vecka och följ dina smärtnivåer.",
    color: "#8b5cf6",
    emoji: "🦵",
    goal: "Rehab",
    isDefault: true,
    exercises: [
      { slug: "hip-flexor-stretch", sets: 2, reps: 30 },
      { slug: "glute-bridge", sets: 3, reps: 12 },
      { slug: "clamshells", sets: 3, reps: 15 },
      { slug: "side-lying-leg-raise", sets: 3, reps: 15 },
      { slug: "fire-hydrant", sets: 3, reps: 12 },
      { slug: "bird-dog", sets: 3, reps: 10 },
      { slug: "single-leg-balance", sets: 3, reps: 30 },
      { slug: "piriformis-stretch", sets: 2, reps: 30 },
    ],
  },
  {
    name: "Höftstyrka – Progression",
    description:
      "Nästa steg när grunden känns smärtfri. Adderar band- och belastad träning för starka, tåliga höfter till vardag och idrott.",
    color: "#06b6d4",
    emoji: "🔥",
    goal: "Rehab",
    isDefault: false,
    exercises: [
      { slug: "banded-monster-walk", sets: 3, reps: 12 },
      { slug: "standing-hip-abduction", sets: 3, reps: 12 },
      { slug: "goblet-squat", sets: 3, reps: 10 },
      { slug: "romanian-deadlift", sets: 3, reps: 10 },
      { slug: "hip-airplane", sets: 3, reps: 8 },
      { slug: "wall-sit", sets: 3, reps: 40 },
    ],
  },
  {
    name: "Daglig rörlighet",
    description:
      "En kort, mjuk 10-minutersrutin för att hålla höfterna smidiga på vilodagar och minska stelhet på morgonen.",
    color: "#10b981",
    emoji: "🌿",
    goal: "Rörlighet",
    isDefault: false,
    exercises: [
      { slug: "90-90-hip-switch", sets: 2, reps: 10 },
      { slug: "hip-flexor-stretch", sets: 2, reps: 30 },
      { slug: "piriformis-stretch", sets: 2, reps: 30 },
      { slug: "dead-bug", sets: 3, reps: 10 },
    ],
  },
  {
    name: "Helkropp Calisthenics",
    description:
      "Bygg muskler med enbart kroppsvikt. Ett komplett pass som tränar överkropp, ben och bål — inget gym behövs.",
    color: "#f59e0b",
    emoji: "🤸",
    goal: "Bygg muskler",
    isDefault: false,
    exercises: [
      { slug: "push-up", sets: 4, reps: 12 },
      { slug: "inverted-row", sets: 4, reps: 12 },
      { slug: "bodyweight-squat", sets: 4, reps: 15 },
      { slug: "pike-push-up", sets: 3, reps: 10 },
      { slug: "walking-lunge", sets: 3, reps: 12 },
      { slug: "plank", sets: 3, reps: 40 },
    ],
  },
  {
    name: "Fettförbränning HIIT",
    description:
      "Ett svettigt intervallpass med hög puls som maximerar kaloriförbränningen på kort tid. Minimal vila mellan övningarna.",
    color: "#ef4444",
    emoji: "⚡",
    goal: "Bränn kalorier",
    isDefault: false,
    exercises: [
      { slug: "burpee", sets: 4, reps: 12 },
      { slug: "high-knees", sets: 4, reps: 40 },
      { slug: "mountain-climber", sets: 4, reps: 30 },
      { slug: "bodyweight-squat", sets: 3, reps: 20 },
      { slug: "bicycle-crunch", sets: 3, reps: 20 },
    ],
  },
  {
    name: "Överkropp – Push & Pull",
    description:
      "Bygg en stark överkropp med hantlar och kroppsvikt. Balanserar tryck- och dragövningar för bröst, rygg, axlar och armar.",
    color: "#6366f1",
    emoji: "💪",
    goal: "Bygg muskler",
    isDefault: false,
    exercises: [
      { slug: "push-up", sets: 4, reps: 12 },
      { slug: "dumbbell-row", sets: 4, reps: 10 },
      { slug: "dumbbell-shoulder-press", sets: 3, reps: 10 },
      { slug: "dips", sets: 3, reps: 10 },
      { slug: "dumbbell-bicep-curl", sets: 3, reps: 12 },
      { slug: "lateral-raise", sets: 3, reps: 12 },
    ],
  },
  {
    name: "Underkropp & Rumpa",
    description:
      "Bygg starka ben och rumpa. En mix av knäböj, höftfällning och enbensövningar för styrka och form.",
    color: "#ec4899",
    emoji: "🍑",
    goal: "Bygg muskler",
    isDefault: false,
    exercises: [
      { slug: "goblet-squat", sets: 4, reps: 10 },
      { slug: "romanian-deadlift", sets: 4, reps: 10 },
      { slug: "walking-lunge", sets: 3, reps: 12 },
      { slug: "step-up", sets: 3, reps: 12 },
      { slug: "glute-bridge", sets: 3, reps: 15 },
      { slug: "calf-raise", sets: 3, reps: 15 },
    ],
  },
  {
    name: "Core & Bål",
    description:
      "Ett fokuserat bålpass som bygger en stark, stabil mitt. Skyddar ryggen och förbättrar hållning och styrka i alla lyft.",
    color: "#14b8a6",
    emoji: "🎯",
    goal: "Bygg muskler",
    isDefault: false,
    exercises: [
      { slug: "plank", sets: 3, reps: 40 },
      { slug: "side-plank", sets: 3, reps: 30 },
      { slug: "bicycle-crunch", sets: 3, reps: 20 },
      { slug: "dead-bug", sets: 3, reps: 10 },
      { slug: "superman", sets: 3, reps: 12 },
      { slug: "mountain-climber", sets: 3, reps: 30 },
    ],
  },
  {
    name: "Nybörjare – Hemmaträning",
    description:
      "Ett skonsamt helkroppspass för dig som är ny. Bara kroppsvikt och enkla rörelser för att komma igång på ett tryggt sätt.",
    color: "#0ea5e9",
    emoji: "🌟",
    goal: "Bygg muskler",
    isDefault: false,
    exercises: [
      { slug: "bodyweight-squat", sets: 3, reps: 12 },
      { slug: "push-up", sets: 3, reps: 8 },
      { slug: "glute-bridge", sets: 3, reps: 12 },
      { slug: "plank", sets: 3, reps: 25 },
      { slug: "high-knees", sets: 3, reps: 30 },
    ],
  },
];
