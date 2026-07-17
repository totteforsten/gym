import { TrendingDown, TrendingUp } from "lucide-react";

export function StatCard({
  icon,
  label,
  value,
  hint,
  trend,
  accent = "var(--color-brand)",
  index = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: number; goodWhenDown?: boolean };
  accent?: string;
  index?: number;
}) {
  const positive = trend
    ? trend.goodWhenDown
      ? trend.value <= 0
      : trend.value >= 0
    : true;

  return (
    <div
      className="card animate-fade-up relative overflow-hidden p-5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div className="relative flex items-center justify-between">
        <span
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ background: `${accent}20`, color: accent }}
        >
          {icon}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              positive
                ? "bg-[rgba(52,211,153,0.12)] text-[var(--color-mint)]"
                : "bg-[rgba(251,113,133,0.12)] text-[var(--color-rose)]"
            }`}
          >
            {trend.value >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend.value)}
            {trend.goodWhenDown ? "" : "%"}
          </span>
        )}
      </div>
      <p className="relative mt-4 text-3xl font-extrabold tracking-tight tabular-nums">
        {value}
      </p>
      <p className="relative mt-0.5 text-sm font-medium text-[var(--color-fg)]">
        {label}
      </p>
      {hint && (
        <p className="relative mt-0.5 text-xs text-[var(--color-muted)]">{hint}</p>
      )}
    </div>
  );
}
