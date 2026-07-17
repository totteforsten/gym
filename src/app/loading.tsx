export default function Loading() {
  return (
    <div className="px-5 py-6 sm:px-8 sm:py-8">
      <div className="h-40 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl bg-[var(--color-surface)]"
          />
        ))}
      </div>
      <div className="mt-6 h-64 animate-pulse rounded-3xl bg-[var(--color-surface)]" />
    </div>
  );
}
