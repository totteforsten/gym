"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { History, Trash2, TrendingUp, Trophy } from "lucide-react";
import { deleteLog } from "@/lib/actions";
import { relativeDate } from "@/lib/utils";

type Log = {
  id: string;
  performedAt: string;
  sets: number;
  reps: number;
  weight: number;
  painLevel: number;
  rpe: number;
  notes: string | null;
};

export function ExerciseHistory({
  logs,
  bestWeight,
}: {
  logs: Log[];
  bestWeight: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const chartData = [...logs]
    .reverse()
    .map((l) => ({
      label: new Date(l.performedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volume: l.sets * l.reps,
      pain: l.painLevel,
    }));

  const totalVolume = logs.reduce((s, l) => s + l.sets * l.reps, 0);

  function remove(id: string) {
    startTransition(async () => {
      await deleteLog(id);
      router.refresh();
    });
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-[var(--color-brand)]" />
        <h2 className="text-lg font-bold">Your progress</h2>
      </div>

      {logs.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--color-muted)]">
          No history yet. Log your first set to start tracking progress on this
          exercise.
        </p>
      ) : (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <MiniStat
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Total volume"
              value={totalVolume.toLocaleString()}
            />
            <MiniStat
              icon={<Trophy className="h-3.5 w-3.5" />}
              label="Best weight"
              value={bestWeight > 0 ? `${bestWeight}kg` : "—"}
            />
            <MiniStat
              icon={<History className="h-3.5 w-3.5" />}
              label="Sessions"
              value={String(logs.length)}
            />
          </div>

          {chartData.length > 1 && (
            <div className="mb-5">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8a90a3" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8a90a3" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{
                      background: "#141722",
                      border: "1px solid #1e2230",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="volume" name="Volume" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="pain" name="Pain" stroke="#22d3ee" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {logs.slice(0, 8).map((l) => (
              <div key={l.id} className="group flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {l.sets}×{l.reps}
                    {l.weight > 0 && (
                      <span className="text-[var(--color-muted)]">
                        {" "}
                        @ {l.weight}kg
                      </span>
                    )}
                  </p>
                  {l.notes && (
                    <p className="truncate text-xs text-[var(--color-muted)]">
                      {l.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="chip px-2 py-0.5" style={{ color: painColor(l.painLevel) }}>
                    pain {l.painLevel}
                  </span>
                  <span className="text-[var(--color-muted)]">
                    {relativeDate(l.performedAt)}
                  </span>
                  <button
                    onClick={() => remove(l.id)}
                    disabled={pending}
                    className="text-[var(--color-muted)] opacity-0 transition-opacity hover:text-[var(--color-rose)] group-hover:opacity-100"
                    aria-label="Delete log"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
      <div className="flex items-center gap-1 text-[var(--color-muted)]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-1 text-lg font-extrabold tabular-nums">{value}</p>
    </div>
  );
}

function painColor(p: number) {
  if (p <= 2) return "#34d399";
  if (p <= 5) return "#fbbf24";
  return "#fb7185";
}
