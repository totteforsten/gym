export function youtubeSearchUrl(name: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    name + " exercise how to",
  )}`;
}

export function youtubeThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function difficultyColor(d: string) {
  switch (d) {
    case "Beginner":
      return "text-[var(--color-mint)] bg-[rgba(52,211,153,0.12)] border-[rgba(52,211,153,0.25)]";
    case "Intermediate":
      return "text-[var(--color-amber)] bg-[rgba(251,191,36,0.12)] border-[rgba(251,191,36,0.25)]";
    case "Advanced":
      return "text-[var(--color-rose)] bg-[rgba(251,113,133,0.12)] border-[rgba(251,113,133,0.25)]";
    default:
      return "text-[var(--color-muted)] bg-[var(--color-surface-2)] border-[var(--color-border)]";
  }
}

export function categoryColor(c: string) {
  switch (c) {
    case "Hip Rehab":
      return "#8b5cf6";
    case "Strength":
      return "#22d3ee";
    case "Mobility":
      return "#34d399";
    case "Core":
      return "#fbbf24";
    default:
      return "#6366f1";
  }
}

export function relativeDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const day = 86400000;
  if (diff < day && new Date().getDate() === date.getDate()) return "Today";
  if (diff < 2 * day) return "Yesterday";
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const CATEGORIES = ["All", "Hip Rehab", "Strength", "Mobility", "Core"];
export const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];
export const BODY_PARTS = ["All", "Hip", "Glutes", "Core", "Legs", "Lower Back"];
