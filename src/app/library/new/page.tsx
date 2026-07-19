import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateExerciseForm } from "@/components/CreateExerciseForm";

export const metadata = { title: "Ny övning · Atlas" };

export default function NewExercisePage() {
  return (
    <main className="px-5 py-6 sm:px-8 sm:py-8">
      <Link
        href="/library"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-muted)] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Tillbaka till övningsbanken
      </Link>
      <CreateExerciseForm />
    </main>
  );
}
