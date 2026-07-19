import { getPrograms } from "@/lib/queries";
import { ProgramsClient } from "./ProgramsClient";

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  const items = programs.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    color: p.color,
    emoji: p.emoji,
    goal: p.goal,
    isDefault: p.isDefault,
    exerciseCount: p.exercises.length,
    totalSets: p.exercises.reduce((s, e) => s + e.sets, 0),
    kcal: p.exercises.reduce(
      (s, e) => s + e.sets * (e.exercise.kcalPerSet ?? 4),
      0,
    ),
    thumbs: p.exercises.slice(0, 4).map((pe) => ({
      id: pe.id,
      videoId: pe.exercise.videoId,
    })),
  }));

  return <ProgramsClient programs={items} />;
}
