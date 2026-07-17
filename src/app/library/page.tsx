import { getExercises } from "@/lib/queries";
import { LibraryClient } from "./LibraryClient";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const exercises = await getExercises();
  return <LibraryClient exercises={exercises} />;
}
