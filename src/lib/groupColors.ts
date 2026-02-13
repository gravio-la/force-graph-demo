export const GROUP_COLOR_PALETTE = [
  "#4a9eff",
  "#ff6b6b",
  "#51cf66",
  "#ffd43b",
  "#a78bfa",
  "#ff8787",
  "#38d9a9",
];

export function getGroupColor(group: number): string {
  return GROUP_COLOR_PALETTE[(group - 1) % GROUP_COLOR_PALETTE.length];
}
