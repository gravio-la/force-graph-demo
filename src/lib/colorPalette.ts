import convert from "color-convert";

const DEFAULT_S = 72;
const DEFAULT_L = 62;
const DEFAULT_START_HUE = 30;

export interface GenerateDistinctColorsOptions {
  s?: number;
  l?: number;
  startHue?: number;
}

/**
 * Generate n visually distinct colors by spreading hue evenly (golden angle).
 * S/L tuned for good contrast on dark backgrounds (#0a0a0a).
 */
export function generateDistinctColors(
  n: number,
  options?: GenerateDistinctColorsOptions
): string[] {
  if (n <= 0) return [];
  const s = options?.s ?? DEFAULT_S;
  const l = options?.l ?? DEFAULT_L;
  const startHue = options?.startHue ?? DEFAULT_START_HUE;
  const colors: string[] = [];
  for (let i = 0; i < n; i++) {
    const hue = (startHue + (i * 137.5) % 360) % 360;
    const hex = convert.hsl.hex(hue, s, l);
    colors.push(hex.startsWith("#") ? hex : `#${hex}`);
  }
  return colors;
}
