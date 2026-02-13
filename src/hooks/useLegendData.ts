import { useMemo } from "react";
import { useColorMap } from "@/context/ColorMapContext";
import { useGraphStore } from "@/store/graphStore";

export interface GroupLegendItem {
  id: number;
  label: string;
  color: string;
  count: number;
}

export interface LinkTypeLegendItem {
  label: string;
  color: string;
  count: number;
}

export function useLegendData(): {
  groups: GroupLegendItem[];
  linkTypes: LinkTypeLegendItem[];
} {
  const graphData = useGraphStore((state) => state.sharedGraph?.graph ?? state.graphData);
  const sharedGraph = useGraphStore((state) => state.sharedGraph);
  const currentGraphId = useGraphStore((state) => state.currentGraphId);
  const availableGraphs = useGraphStore((state) => state.availableGraphs);
  const { getGroupColor, getLinkColor } = useColorMap();

  const metadata = useMemo(() => {
    if (sharedGraph?.metadata) return sharedGraph.metadata;
    const file = availableGraphs.find((g) => g.id === currentGraphId);
    return file?.metadata;
  }, [sharedGraph?.metadata, currentGraphId, availableGraphs]);

  return useMemo(() => {
    const groupCounts = new Map<number, number>();
    for (const node of graphData.nodes) {
      const g = node.group;
      if (g != null && !Number.isNaN(Number(g))) {
        groupCounts.set(Number(g), (groupCounts.get(Number(g)) ?? 0) + 1);
      }
    }
    const groupLabels = metadata?.groupLabels;
    const groups: GroupLegendItem[] = Array.from(groupCounts.entries())
      .sort(([a], [b]) => a - b)
      .map(([id, count]) => ({
        id,
        label: groupLabels?.[String(id)] ?? `Group ${id}`,
        color: getGroupColor(id),
        count,
      }));

    const linkCounts = new Map<string, number>();
    for (const link of graphData.links) {
      const key =
        link.label != null && String(link.label).trim() !== ""
          ? String(link.label).trim()
          : "untyped";
      linkCounts.set(key, (linkCounts.get(key) ?? 0) + 1);
    }
    const linkTypes: LinkTypeLegendItem[] = Array.from(linkCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({
        label,
        color: getLinkColor(label === "untyped" ? undefined : label),
        count,
      }));

    return { groups, linkTypes };
  }, [graphData, metadata, getGroupColor, getLinkColor]);
}
