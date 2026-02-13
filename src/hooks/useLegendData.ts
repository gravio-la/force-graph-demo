import { useMemo } from "react";
import { useColorMap } from "@/context/ColorMapContext";
import { useGraphStore } from "@/store/graphStore";

export interface GroupLegendItem {
  /** Group key (number as string, or direct label string). */
  id: string;
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
  const { getGroupColor, getGroupLabel, getLinkColor } = useColorMap();

  return useMemo(() => {
    const groupCounts = new Map<string, number>();
    for (const node of graphData.nodes) {
      const key =
        node.group == null
          ? null
          : typeof node.group === "number"
            ? Number.isNaN(node.group)
              ? null
              : String(node.group)
            : String(node.group).trim();
      if (key !== null && key !== "") {
        groupCounts.set(key, (groupCounts.get(key) ?? 0) + 1);
      }
    }
    const groupKeys = Array.from(groupCounts.keys()).sort((a, b) => {
      const aNum = Number(a);
      const bNum = Number(b);
      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
      if (!Number.isNaN(aNum)) return -1;
      if (!Number.isNaN(bNum)) return 1;
      return a.localeCompare(b);
    });
    const groups: GroupLegendItem[] = groupKeys.map((id) => ({
      id,
      label: getGroupLabel(id),
      color: getGroupColor(id),
      count: groupCounts.get(id)!,
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
  }, [graphData, getGroupColor, getGroupLabel, getLinkColor]);
}
