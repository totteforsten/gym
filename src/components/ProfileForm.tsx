"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Save } from "lucide-react";
import { updateProfile } from "@/lib/actions";

export function ProfileForm({
  profile,
}: {
  profile: {
    name: string;
    goal: string;
    weeklyTarget: number;
    heightCm: number;
    weightKg: number;
  };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(profile);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit() {
    startTransition(async () => {
      await updateProfile(form);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="card p-6">
      <h3 className="mb-5 font-bold">Edit profile</h3>

      <div className="flex flex-col gap-4">
        <Field label="Display name">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Goal">
          <input
            value={form.goal}
            onChange={(e) => update("goal", e.target.value)}
            className="input"
          />
        </Field>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              Weekly training target
            </label>
            <span className="text-sm font-bold text-[var(--color-brand)]">
              {form.weeklyTarget} days
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            value={form.weeklyTarget}
            onChange={(e) => update("weeklyTarget", Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "#8b5cf6" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Height (cm)">
            <input
              type="number"
              value={form.heightCm}
              onChange={(e) => update("heightCm", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              step={0.1}
              value={form.weightKg}
              onChange={(e) => update("weightKg", Number(e.target.value))}
              className="input"
            />
          </Field>
        </div>

        <button
          onClick={submit}
          disabled={pending}
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
            saved
              ? "bg-[rgba(52,211,153,0.15)] text-[var(--color-mint)]"
              : "btn-primary text-white"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> {pending ? "Saving…" : "Save changes"}
            </>
          )}
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-surface-2);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus { border-color: rgba(139,92,246,0.5); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}
