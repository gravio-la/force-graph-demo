import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useGraphStore } from "@/store/graphStore";
import { generateDistinctColors } from "@/lib/colorPalette";

const FALLBACK_COLOR = "#808080";

interface ColorMapContextValue {
  getGroupColor: (group: number) => string;
  getLinkColor: (label: string | undefined) => string;
}

const ColorMapContext = createContext<ColorMapContextValue | null>(null);

export function ColorMapProvider({ children }: { children: ReactNode }) {
  const graphData = useGraphStore((state) => state.sharedGraph?.graph ?? state.graphData);

  const value = useMemo(() => {
    const groups = Array.from(
      new Set(
        graphData.nodes
          .map((n) => n.group)
          .filter((g) => g != null && !Number.isNaN(Number(g)))
      )
    ).sort((a, b) => Number(a) - Number(b));

    const linkLabels = Array.from(
      new Set(
        graphData.links.map((l) =>
          l.label != null && String(l.label).trim() !== ""
            ? String(l.label).trim()
            : "untyped"
        )
      )
    ).sort();

    const groupColors = generateDistinctColors(groups.length);
    const linkColors = generateDistinctColors(linkLabels.length);

    const groupColorMap = new Map<number, string>();
    groups.forEach((g, i) => groupColorMap.set(Number(g), groupColors[i]!));

    const linkColorMap = new Map<string, string>();
    linkLabels.forEach((label, i) => linkColorMap.set(label, linkColors[i]!));

    return {
      getGroupColor: (group: number): string => {
        if (group == null || Number.isNaN(Number(group))) return FALLBACK_COLOR;
        return groupColorMap.get(Number(group)) ?? FALLBACK_COLOR;
      },
      getLinkColor: (label: string | undefined): string => {
        const key =
          label != null && String(label).trim() !== ""
            ? String(label).trim()
            : "untyped";
        return linkColorMap.get(key) ?? FALLBACK_COLOR;
      },
    };
  }, [graphData]);

  return (
    <ColorMapContext.Provider value={value}>
      {children}
    </ColorMapContext.Provider>
  );
}

export function useColorMap(): ColorMapContextValue {
  const ctx = useContext(ColorMapContext);
  if (!ctx) {
    throw new Error("useColorMap must be used within ColorMapProvider");
  }
  return ctx;
}
