import { useMemo } from "react";
import { Cosmograph } from "@cosmograph/react";
import type { CosmographConfig } from "@cosmograph/react";
import { useColorMap } from "@/context/ColorMapContext";
import { useGraphStore } from "@/store/graphStore";
import type { GraphNode } from "@/store/graphStore";

// Cosmograph has no link/edge label API; only point labels are supported.
// We pass raw points/links with pointIndexBy and link index columns (like the official Basic usage example).

export function CosmographGraph() {
  const { getGroupColor, getLinkColor } = useColorMap();
  const graphData = useGraphStore((state) => state.sharedGraph?.graph ?? state.graphData);
  const searchQuery = useGraphStore((state) => state.searchQuery);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);

  const { points, links, nodeById } = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filteredNodes = query
      ? graphData.nodes.filter(
          (node) =>
            node.name?.toLowerCase().includes(query) ||
            node.id.toLowerCase().includes(query)
        )
      : graphData.nodes;

    const idToIndex = new Map<string, number>(
      filteredNodes.map((n, i) => [n.id, i])
    );
    const filteredNodeIds = new Set(idToIndex.keys());

    const getLinkId = (v: string | { id: string } | null): string | null =>
      v == null
        ? null
        : typeof v === "object" && "id" in v
          ? (v as { id: string }).id
          : v;

    const filteredLinks = graphData.links.filter((link) => {
      const sourceId = getLinkId(link.source);
      const targetId = getLinkId(link.target);
      return (
        sourceId != null &&
        targetId != null &&
        filteredNodeIds.has(sourceId) &&
        filteredNodeIds.has(targetId)
      );
    });

    const points: Array<{ id: string; idx: number; name: string; group: number | string }> =
      filteredNodes.map((node, i) => ({
        id: node.id,
        idx: i,
        name: node.name ?? node.id,
        group: node.group,
      }));

    const links: Array<{
      source: string;
      target: string;
      sourceidx: number;
      targetidx: number;
      label: string;
    }> = filteredLinks.map((link) => {
      const sourceId = getLinkId(link.source)!;
      const targetId = getLinkId(link.target)!;
      return {
        source: sourceId,
        target: targetId,
        sourceidx: idToIndex.get(sourceId)!,
        targetidx: idToIndex.get(targetId)!,
        label: link.label != null && String(link.label).trim() !== "" ? String(link.label).trim() : "untyped",
      };
    });

    const nodeById = new Map<string, GraphNode>(
      graphData.nodes.map((n) => [n.id, n])
    );

    return { points, links, nodeById };
  }, [graphData, searchQuery]);

  const config: CosmographConfig = useMemo(
    () => ({
      pointIdBy: "id",
      pointIndexBy: "idx",
      points,
      links,
      linkSourceBy: "source",
      linkTargetBy: "target",
      linkSourceIndexBy: "sourceidx",
      linkTargetIndexBy: "targetidx",
      backgroundColor: "#0a0a0a",
      pointColorBy: "group",
      pointColorStrategy: "direct",
      pointColorByFn: (value: unknown) => getGroupColor(value as number | string),
      linkColorBy: "label",
      linkColorStrategy: "direct",
      linkColorByFn: (value: unknown) => getLinkColor(value as string),
      pointLabelBy: "name",
      showLabels: true,
      showTopLabels: true,
      showDynamicLabels: true,
      showFocusedPointLabel: true,
      onLabelClick: (_index: number, id: string) => {
        const node = nodeById.get(id);
        if (node) setSelectedNode(node);
      },
      onClick: (pointIndex: number | undefined) => {
        if (pointIndex === undefined) return;
        const point = points[pointIndex];
        if (point) {
          const node = nodeById.get(point.id);
          if (node) setSelectedNode(node);
        }
      },
    }),
    [points, links, nodeById, setSelectedNode, getGroupColor, getLinkColor]
  );

  return (
    <div
      className="w-full h-full"
      style={{ background: "#0a0a0a", cursor: "grab" }}
    >
      <Cosmograph {...config} />
    </div>
  );
}
