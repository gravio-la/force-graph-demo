/**
 * @deprecated Use useColorMap() from ColorMapContext for graph colors.
 * This palette is kept only for fallback or non-graph usage.
 */
export const GROUP_COLOR_PALETTE = [
  "#4a9eff",
  "#ff6b6b",
  "#51cf66",
  "#ffd43b",
  "#a78bfa",
  "#ff8787",
  "#38d9a9",
];

/** @deprecated Use useColorMap().getGroupColor from ColorMapContext instead. */
export function getGroupColor(group: number): string {
  const idx = Math.max(0, ((group ?? 1) - 1) % GROUP_COLOR_PALETTE.length);
  return GROUP_COLOR_PALETTE[idx] ?? "#808080";
}
