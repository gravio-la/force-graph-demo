import { useEffect, useRef } from "react";
import Sigma from "sigma";
import Graph from "graphology";
import circular from "graphology-layout/circular";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { useGraphStore } from "@/store/graphStore";
import { getGroupColor } from "@/lib/groupColors";

export function SigmaGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  const graphRef = useRef<Graph | null>(null);
  
  const graphData = useGraphStore((state) => state.sharedGraph?.graph ?? state.graphData);
  const searchQuery = useGraphStore((state) => state.searchQuery);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);

  useEffect(() => {
    if (!containerRef.current) return;

    // Work on a clone so layout (forceAtlas2, etc.) does not mutate the store
    const data = JSON.parse(JSON.stringify(graphData));

    // Create a new graph (directed graph to show arrows)
    const graph = new Graph({ multi: false, type: "directed" });
    graphRef.current = graph;

    // Filter nodes based on search query
    const query = searchQuery.toLowerCase();
    const filteredNodes = query
      ? data.nodes.filter(
          (node) =>
            node.name?.toLowerCase().includes(query) ||
            node.id.toLowerCase().includes(query)
        )
      : data.nodes;

    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

    // Add nodes
    filteredNodes.forEach((node) => {
      graph.addNode(node.id, {
        label: node.name,
        size: 15,
        color: getGroupColor(node.group),
        x: Math.random() * 100,
        y: Math.random() * 100,
        // Store full node data for click handler
        nodeData: node,
      });
    });

    // Add edges (only between visible nodes)
    // Handle both string IDs and object references
    const filteredLinks = data.links.filter((link) => {
      const sourceId = typeof link.source === 'object' && link.source !== null && 'id' in link.source 
        ? (link.source as any).id 
        : link.source;
      const targetId = typeof link.target === 'object' && link.target !== null && 'id' in link.target
        ? (link.target as any).id 
        : link.target;
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    let edgeCount = 0;
    filteredLinks.forEach((link, index) => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      
      try {
        if (graph.hasNode(sourceId) && graph.hasNode(targetId)) {
          graph.addDirectedEdge(sourceId, targetId, {
            label: link.label || "",
            size: 2,
            color: "#aaaaaa",
          });
          edgeCount++;
        }
      } catch (error) {
        console.error(`Error adding edge ${sourceId} -> ${targetId}:`, error);
      }
    });


    // Apply circular layout initially
    circular.assign(graph);

    // Run force layout
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: {
        ...settings,
        gravity: 1,
        scalingRatio: 10,
      },
    });

    // Create Sigma instance
    const sigma = new Sigma(graph, containerRef.current, {
      renderLabels: true,
      renderEdgeLabels: true,
      labelSize: 14,
      labelWeight: "bold",
      labelColor: { color: "#ffffff" },
      edgeLabelSize: 10,
      edgeLabelWeight: "normal",
      edgeLabelColor: { color: "#bbbbbb" },
      defaultNodeType: "circle",
      defaultEdgeType: "arrow",
      minCameraRatio: 0.1,
      maxCameraRatio: 10,
    });

    // Force render to ensure edges are visible
    sigma.refresh();

    sigmaRef.current = sigma;

    // Handle node click
    sigma.on("clickNode", ({ node }) => {
      const nodeData = graph.getNodeAttribute(node, "nodeData");
      if (nodeData) {
        setSelectedNode(nodeData);
      }
    });

    // Handle stage click (deselect)
    sigma.on("clickStage", () => {
      // Optional: deselect node when clicking on empty space
      // setSelectedNode(null);
    });

    // Cleanup
    return () => {
      if (sigmaRef.current) {
        sigmaRef.current.kill();
      }
      if (graphRef.current) {
        graphRef.current.clear();
      }
    };
  }, [graphData, searchQuery, setSelectedNode]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: "#0a0a0a" }}
    />
  );
}
