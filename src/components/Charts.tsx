"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { categoryColor } from "@/lib/utils";

const axisStyle = { fontSize: 11, fill: "#8a90a3" };

function TooltipBox({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold text-white">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[var(--color-muted)]">
          {p.name}: <span className="font-semibold text-white">{p.value}{suffix}</span>
        </p>
      ))}
    </div>
  );
}

export function VolumeChart({
  data,
}: {
  data: { label: string; reps: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<TooltipBox suffix=" reps" />} cursor={{ stroke: "#8b5cf6", strokeOpacity: 0.2 }} />
        <Area
          type="monotone"
          dataKey="reps"
          name="Volym"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          fill="url(#vol)"
          dot={false}
          activeDot={{ r: 4, fill: "#8b5cf6" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PainTrendChart({
  data,
}: {
  data: { label: string; pain: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="pain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 10]} tick={axisStyle} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<TooltipBox suffix="/10" />} cursor={{ stroke: "#22d3ee", strokeOpacity: 0.2 }} />
        <Area
          type="monotone"
          dataKey="pain"
          name="Snittsmärta"
          stroke="#22d3ee"
          strokeWidth={2.5}
          fill="url(#pain)"
          dot={{ r: 3, fill: "#22d3ee" }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CategoryDonut({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={140} height={140}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={42}
            outerRadius={64}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={categoryColor(d.name)} />
            ))}
          </Pie>
          <Tooltip content={<TooltipBox suffix=" set" />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: categoryColor(d.name) }}
            />
            <span className="text-[var(--color-muted)]">{d.name}</span>
            <span className="ml-auto font-semibold">
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MiniBars({ data }: { data: { reps: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="reps" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.reps > 0 ? "#8b5cf6" : "#1e2230"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
