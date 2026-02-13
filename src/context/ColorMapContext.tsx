import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useGraphStore } from "@/store/graphStore";
import { generateDistinctColors } from "@/lib/colorPalette";

const FALLBACK_COLOR = "#808080";

function normalizeGroupKey(group: number | string | null | undefined): string | null {
  if (group == null) return null;
  if (typeof group === "number") return Number.isNaN(group) ? null : String(group);
  const s = String(group).trim();
  return s === "" ? null : s;
}

interface ColorMapContextValue {
  getGroupColor: (group: number | string) => string;
  getGroupLabel: (group: number | string) => string;
  getLinkColor: (label: string | undefined) => string;
}

const ColorMapContext = createContext<ColorMapContextValue | null>(null);

export function ColorMapProvider({ children }: { children: ReactNode }) {
  const graphData = useGraphStore((state) => state.sharedGraph?.graph ?? state.graphData);
  const sharedGraph = useGraphStore((state) => state.sharedGraph);
  const currentGraphId = useGraphStore((state) => state.currentGraphId);
  const availableGraphs = useGraphStore((state) => state.availableGraphs);

  const metadata = useMemo(() => {
    if (sharedGraph?.metadata) return sharedGraph.metadata;
    const file = availableGraphs.find((g) => g.id === currentGraphId);
    return file?.metadata;
  }, [sharedGraph?.metadata, currentGraphId, availableGraphs]);

  const value = useMemo(() => {
    const groupKeys = Array.from(
      new Set(
        graphData.nodes
          .map((n) => normalizeGroupKey(n.group))
          .filter((k): k is string => k != null)
      )
    ).sort((a, b) => {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
      if (!Number.isNaN(aNum)) return -1;
      if (!Number.isNaN(bNum)) return 1;
      return a.localeCompare(b);
    });

    const linkLabels = Array.from(
      new Set(
        graphData.links.map((l) =>
          l.label != null && String(l.label).trim() !== ""
            ? String(l.label).trim()
            : "untyped"
        )
      )
    ).sort();

    const groupColors = generateDistinctColors(groupKeys.length);
    const linkColors = generateDistinctColors(linkLabels.length);

    const groupColorMap = new Map<string, string>();
    groupKeys.forEach((key, i) => groupColorMap.set(key, groupColors[i]!));

    const linkColorMap = new Map<string, string>();
    linkLabels.forEach((label, i) => linkColorMap.set(label, linkColors[i]!));

    const groupLabels = metadata?.groupLabels;
    const isNumericKey = (k: string) => /^\d+$/.test(k);

    return {
      getGroupColor: (group: number | string): string => {
        const key = normalizeGroupKey(group);
        if (key == null) return FALLBACK_COLOR;
        return groupColorMap.get(key) ?? FALLBACK_COLOR;
      },
      getGroupLabel: (group: number | string): string => {
        const key = normalizeGroupKey(group);
        if (key == null) return "—";
        return groupLabels?.[key] ?? (isNumericKey(key) ? `Group ${key}` : key);
      },
      getLinkColor: (label: string | undefined): string => {
        const key =
          label != null && String(label).trim() !== ""
            ? String(label).trim()
            : "untyped";
        return linkColorMap.get(key) ?? FALLBACK_COLOR;
      },
    };
  }, [graphData, metadata]);

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
