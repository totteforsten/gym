"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Sparkles, Youtube, ImageOff } from "lucide-react";
import { createExercise } from "@/lib/actions";
import { youtubeThumb } from "@/lib/utils";

const CATEGORIES = ["Hip Rehab", "Strength", "Mobility", "Core"];
const BODY_PARTS = ["Hip", "Glutes", "Core", "Legs", "Lower Back"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const EQUIPMENT = ["None", "Resistance Band", "Dumbbell", "Mat"];

function parseId(input: string): string {
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const m =
    s.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    s.match(/embed\/([a-zA-Z0-9_-]{11})/) ||
    s.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : "";
}

export function CreateExerciseForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [bodyPart, setBodyPart] = useState(BODY_PARTS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [equipment, setEquipment] = useState(EQUIPMENT[0]);
  const [video, setVideo] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [isRehab, setIsRehab] = useState(true);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [muscles, setMuscles] = useState<string[]>([""]);

  const videoId = parseId(video);

  function submit() {
    if (!name.trim()) {
      setError("Please give your exercise a name.");
      return;
    }
    setError("");
    startTransition(async () => {
      const ex = await createExercise({
        name,
        description,
        category,
        bodyPart,
        difficulty,
        equipment,
        video,
        instructions,
        targetMuscles: muscles,
        defaultSets: sets,
        defaultReps: reps,
        isRehab,
      });
      router.push(`/exercise/${ex.slug}`);
      router.refresh();
    });
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6 animate-fade-up">
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
          New exercise
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Add a custom exercise
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-muted)]">
          Build your own move with a video, coaching cues and default sets — it
          joins your library instantly.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Basics */}
        <div className="card p-5">
          <SectionLabel>Basics</SectionLabel>
          <div className="flex flex-col gap-4">
            <Field label="Name *">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Copenhagen Plank"
                className="ipt"
                autoFocus
              />
            </Field>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What it does and why it helps…"
                rows={2}
                className="ipt resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Video */}
        <div className="card p-5">
          <SectionLabel>Video demonstration</SectionLabel>
          <Field label="YouTube link or video ID">
            <div className="relative">
              <Youtube className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=…"
                className="ipt pl-10"
              />
            </div>
          </Field>
          <div className="mt-3 aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]">
            {videoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={youtubeThumb(videoId)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-[var(--color-muted)]">
                <div className="flex flex-col items-center gap-1 text-xs">
                  <ImageOff className="h-5 w-5" />
                  Preview
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Classification */}
        <div className="card p-5">
          <SectionLabel>Classification</SectionLabel>
          <div className="flex flex-col gap-4">
            <PillGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
            <PillGroup label="Body part" options={BODY_PARTS} value={bodyPart} onChange={setBodyPart} />
            <PillGroup label="Difficulty" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
            <PillGroup label="Equipment" options={EQUIPMENT} value={equipment} onChange={setEquipment} />
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
              <input
                type="checkbox"
                checked={isRehab}
                onChange={(e) => setIsRehab(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-brand)]"
              />
              <div>
                <p className="text-sm font-semibold">Rehab exercise</p>
                <p className="text-xs text-[var(--color-muted)]">
                  Enables pain-level tracking when logging.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Defaults */}
        <div className="card p-5">
          <SectionLabel>Default prescription</SectionLabel>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Sets">
              <input type="number" min={1} value={sets} onChange={(e) => setSets(Number(e.target.value))} className="ipt" />
            </Field>
            <Field label="Reps / seconds">
              <input type="number" min={1} value={reps} onChange={(e) => setReps(Number(e.target.value))} className="ipt" />
            </Field>
          </div>
        </div>

        {/* Instructions */}
        <div className="card p-5">
          <SectionLabel>Coaching cues</SectionLabel>
          <ListEditor
            items={instructions}
            setItems={setInstructions}
            placeholder="Step / cue…"
            numbered
          />
        </div>

        {/* Muscles */}
        <div className="card p-5">
          <SectionLabel>Target muscles</SectionLabel>
          <ListEditor
            items={muscles}
            setItems={setMuscles}
            placeholder="e.g. Gluteus Medius"
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-[var(--color-rose)]">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={pending}
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {pending ? "Creating…" : "Create exercise"}
          </button>
          <button
            onClick={() => router.push("/library")}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-6 py-3 text-sm font-semibold text-[var(--color-muted)] hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .ipt {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-surface-2);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          color: var(--color-fg);
        }
        .ipt::placeholder { color: var(--color-muted); }
        .ipt:focus { border-color: rgba(139,92,246,0.5); }
      `}</style>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 font-bold">{children}</h2>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              value === o
                ? "border-[rgba(139,92,246,0.5)] bg-[rgba(139,92,246,0.18)] text-white"
                : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-muted)] hover:text-white"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ListEditor({
  items,
  setItems,
  placeholder,
  numbered = false,
}: {
  items: string[];
  setItems: (v: string[]) => void;
  placeholder: string;
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          {numbered && (
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[rgba(139,92,246,0.15)] text-xs font-bold text-[var(--color-brand)]">
              {i + 1}
            </span>
          )}
          <input
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              setItems(next);
            }}
            placeholder={placeholder}
            className="ipt flex-1"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((_, idx) => idx !== i))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--color-muted)] hover:text-[var(--color-rose)]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems([...items, ""])}
        className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-[var(--color-border)] px-3 py-2 text-xs font-semibold text-[var(--color-muted)] hover:border-[rgba(139,92,246,0.4)] hover:text-white"
      >
        <Plus className="h-3.5 w-3.5" /> Add {numbered ? "step" : "muscle"}
      </button>
    </div>
  );
}
