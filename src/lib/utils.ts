export function youtubeSearchUrl(name: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    name + " övning teknik",
  )}`;
}

export function youtubeThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function difficultyColor(d: string) {
  switch (d) {
    case "Nybörjare":
      return "text-[var(--color-mint)] bg-[rgba(52,211,153,0.12)] border-[rgba(52,211,153,0.25)]";
    case "Medel":
      return "text-[var(--color-amber)] bg-[rgba(251,191,36,0.12)] border-[rgba(251,191,36,0.25)]";
    case "Avancerad":
      return "text-[var(--color-rose)] bg-[rgba(251,113,133,0.12)] border-[rgba(251,113,133,0.25)]";
    default:
      return "text-[var(--color-muted)] bg-[var(--color-surface-2)] border-[var(--color-border)]";
  }
}

export function categoryColor(c: string) {
  switch (c) {
    case "Rehab":
      return "#8b5cf6";
    case "Styrka":
      return "#22d3ee";
    case "Rörlighet":
      return "#34d399";
    case "Core":
      return "#fbbf24";
    case "Calisthenics":
      return "#f59e0b";
    case "Kondition":
      return "#fb7185";
    default:
      return "#6366f1";
  }
}

export function goalColor(g: string) {
  switch (g) {
    case "Rehab":
      return "#8b5cf6";
    case "Bygg muskler":
      return "#22d3ee";
    case "Bränn kalorier":
      return "#fb7185";
    case "Rörlighet":
      return "#34d399";
    case "Kondition":
      return "#f59e0b";
    default:
      return "#6366f1";
  }
}

export function relativeDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Date.now() - date.getTime();
  const day = 86400000;
  if (diff < day && new Date().getDate() === date.getDate()) return "Idag";
  if (diff < 2 * day) return "Igår";
  if (diff < 7 * day) return `${Math.floor(diff / day)}d sedan`;
  return date.toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
}

export const CATEGORIES = [
  "Alla",
  "Rehab",
  "Styrka",
  "Calisthenics",
  "Rörlighet",
  "Core",
  "Kondition",
];
export const DIFFICULTIES = ["Alla", "Nybörjare", "Medel", "Avancerad"];
export const BODY_PARTS = [
  "Alla",
  "Höft",
  "Rumpa",
  "Ben",
  "Vader",
  "Bröst",
  "Rygg",
  "Axlar",
  "Armar",
  "Bål",
  "Nedre rygg",
  "Helkropp",
];
export const GOALS = [
  "Alla",
  "Rehab",
  "Bygg muskler",
  "Bränn kalorier",
  "Rörlighet",
  "Kondition",
];
