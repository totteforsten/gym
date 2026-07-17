import Link from "next/link";
import { Play, Activity, Dumbbell } from "lucide-react";
import { Badge } from "./ui";
import { difficultyColor, youtubeThumb, categoryColor } from "@/lib/utils";

type Props = {
  exercise: {
    slug: string;
    name: string;
    description: string;
    category: string;
    bodyPart: string;
    difficulty: string;
    equipment: string;
    videoId: string;
    isRehab: boolean;
    targetMuscles: string[];
  };
  index?: number;
};

export function ExerciseCard({ exercise, index = 0 }: Props) {
  return (
    <Link
      href={`/exercise/${exercise.slug}`}
      className="card card-hover group animate-fade-up flex flex-col overflow-hidden"
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
    >
      <div
        className="relative aspect-video overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${categoryColor(exercise.category)}33, ${categoryColor(exercise.category)}0d)`,
        }}
      >
        <span className="absolute inset-0 grid place-items-center text-[var(--color-muted)] opacity-40">
          <Dumbbell className="h-8 w-8" />
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={youtubeThumb(exercise.videoId)}
          alt={exercise.name}
          loading="lazy"
          className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,9,13,0.9)] via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {exercise.isRehab && (
            <Badge className="border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.25)] text-white backdrop-blur">
              <Activity className="h-3 w-3" /> Rehab
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-[rgba(139,92,246,0.9)] text-white opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 sm:scale-75">
          <Play className="h-5 w-5 translate-x-[1px] fill-current" />
        </div>
        <span
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur"
          style={{
            background: `${categoryColor(exercise.category)}22`,
            color: categoryColor(exercise.category),
            border: `1px solid ${categoryColor(exercise.category)}44`,
          }}
        >
          {exercise.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-tight tracking-tight transition-colors group-hover:text-[var(--color-brand)]">
            {exercise.name}
          </h3>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--color-muted)]">
          {exercise.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Badge className={difficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
          <Badge className="border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)]">
            {exercise.equipment}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
