import { useEffect, useRef } from "react";
import ForceGraph3D from "3d-force-graph";
import type { ForceGraphInstance } from "3d-force-graph";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { useGraphStore } from "@/store/graphStore";
import { useSettingsStore } from "@/store/settingsStore";

export function ForceGraph3DComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphInstance | null>(null);
  
  const graphData = useGraphStore((state) => state.graphData);
  const searchQuery = useGraphStore((state) => state.searchQuery);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the force graph with CSS2DRenderer for HTML labels
    const graph = ForceGraph3D({
      extraRenderers: [new CSS2DRenderer()]
    })(containerRef.current)
      .graphData(graphData)
      .nodeLabel("name")
      .nodeAutoColorBy("group")
      .nodeOpacity(settings.nodeOpacity)
      .nodeThreeObject((node: any) => {
        // Create HTML label element if enabled
        if (!settings.showNodeLabels) return null;
        
        const nodeEl = document.createElement('div');
        nodeEl.textContent = node.name || node.id;
        nodeEl.className = 'node-label-3d';
        nodeEl.style.color = node.color || '#4a9eff';
        nodeEl.style.fontSize = `${settings.nodeLabelFontSize}px`;
        
        return new CSS2DObject(nodeEl);
      })
      .nodeThreeObjectExtend(true)
      .linkWidth(settings.linkWidth)
      .linkOpacity(settings.linkOpacity)
      .linkDirectionalParticles(0) // Disable animated particles
      .linkThreeObject((link: any) => {
        // Create link label if label exists and enabled
        if (!link.label || !settings.showLinkLabels) return null;
        
        const linkEl = document.createElement('div');
        linkEl.textContent = link.label;
        linkEl.className = 'link-label-3d';
        linkEl.style.color = '#888';
        linkEl.style.fontSize = `${settings.linkLabelFontSize}px`;
        
        return new CSS2DObject(linkEl);
      })
      .linkThreeObjectExtend(true)
      .linkPositionUpdate((sprite: any, { start, end }: any) => {
        // Position the label at the midpoint of the link
        const middlePos = {
          x: start.x + (end.x - start.x) / 2,
          y: start.y + (end.y - start.y) / 2,
          z: start.z + (end.z - start.z) / 2
        };
        Object.assign(sprite.position, middlePos);
      })
      .backgroundColor("#0a0a0a")
      .width(containerRef.current.clientWidth)
      .height(containerRef.current.clientHeight)
      .onNodeClick((node: any) => {
        setSelectedNode(node);
      });

    graphRef.current = graph;

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && graphRef.current) {
        graphRef.current
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, [graphData, setSelectedNode, settings]);

  // Handle search filtering
  useEffect(() => {
    if (!graphRef.current) return;

    const query = searchQuery.toLowerCase();
    
    if (!query) {
      // Reset all nodes to visible
      graphRef.current.graphData(graphData);
      return;
    }

    // Filter nodes based on search query
    const filteredNodes = graphData.nodes.filter((node: any) =>
      node.name?.toLowerCase().includes(query) || node.id.toLowerCase().includes(query)
    );

    const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

    // Filter links to only show connections between visible nodes
    const filteredLinks = graphData.links.filter(
      (link: any) =>
        filteredNodeIds.has(link.source.id || link.source) &&
        filteredNodeIds.has(link.target.id || link.target)
    );

    graphRef.current.graphData({
      nodes: filteredNodes,
      links: filteredLinks,
    });
  }, [searchQuery, graphData]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ cursor: "grab" }}
    />
  );
}
