// Prebuilt programs. The Hip Rehab Foundations program is the flagship —
// a sensible progression through the curated rehab exercises.

export type SeedProgram = {
  name: string;
  description: string;
  color: string;
  emoji: string;
  isDefault: boolean;
  exercises: { slug: string; sets: number; reps: number }[];
};

export const PROGRAMS: SeedProgram[] = [
  {
    name: "Hip Rehab Foundations",
    description:
      "A physio-inspired 6-week base program to rebuild hip strength, stability and mobility. Start here 3–4x per week and track your pain levels as you progress.",
    color: "#8b5cf6",
    emoji: "🦵",
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
    name: "Hip Strength Progression",
    description:
      "The next step once foundations feel pain-free. Adds banded and loaded work to build resilient, strong hips for daily life and sport.",
    color: "#06b6d4",
    emoji: "🔥",
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
    name: "Daily Mobility Flow",
    description:
      "A short, gentle 10-minute routine to keep your hips loose on rest days and reduce morning stiffness.",
    color: "#10b981",
    emoji: "🌿",
    isDefault: false,
    exercises: [
      { slug: "90-90-hip-switch", sets: 2, reps: 10 },
      { slug: "hip-flexor-stretch", sets: 2, reps: 30 },
      { slug: "piriformis-stretch", sets: 2, reps: 30 },
      { slug: "dead-bug", sets: 3, reps: 10 },
    ],
  },
];
