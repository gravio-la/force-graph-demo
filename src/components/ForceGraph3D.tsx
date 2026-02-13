import { useEffect, useRef, useState } from "react";
import ForceGraph3D from "3d-force-graph";
import type { ForceGraphInstance } from "3d-force-graph";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Text } from "troika-three-text";
import { getGroupColor } from "@/lib/groupColors";
import { useGraphStore } from "@/store/graphStore";
import { useSettingsStore } from "@/store/settingsStore";

/** LOD threshold: only show edge labels when camera distance to midpoint is below this */
const EDGE_LABEL_LOD_THRESHOLD = 500;

export function ForceGraph3DComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphInstance | null>(null);
  
  const graphData = useGraphStore((state) => state.graphData);
  const searchQuery = useGraphStore((state) => state.searchQuery);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const settings = useSettingsStore((state) => state.settings);
  const [incrementor, setIncrementor] = useState(4);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the force graph with CSS2DRenderer for HTML labels
    const graph = ForceGraph3D({
      extraRenderers: [new CSS2DRenderer()]
    })(containerRef.current)
      .graphData(graphData)
      .nodeLabel("name")
      .nodeColor((node: any) => getGroupColor(node.group))
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
        // Create true 3D text label if label exists and enabled
        if (!link.label || !settings.showLinkLabels) return null;

        const troikaText = new Text();
        troikaText.text = link.label;
        troikaText.fontSize = settings.linkLabelFontSize * 0.25; // Convert px to scene units
        troikaText.color = 0xffff00;
        troikaText.anchorX = "center";
        troikaText.anchorY = "middle";
        troikaText.maxWidth = 200;
        troikaText.sync();

        return troikaText;
      })
      .linkThreeObjectExtend(true)
      .linkPositionUpdate((obj: THREE.Object3D, { start, end }: any, link: any) => {
        // Midpoint
        const mid = new THREE.Vector3(
          (start.x + end.x) / 2,
          (start.y + end.y) / 2,
          (start.z + end.z) / 2
        );
        obj.position.copy(mid);

        // Orient along edge: lookAt(target) then rotate 90° on X so text lies flat along edge
        obj.lookAt(0, 0, 0);
        obj.rotateY(Math.PI / 2);
        obj.rotateX(Math.PI / 2);
        obj.rotateZ(Math.PI / 2);

        // LOD: hide labels beyond camera distance threshold
        const camera = graph.camera();
        const distance = mid.distanceTo(camera.position);
        obj.visible = distance < EDGE_LABEL_LOD_THRESHOLD;

        // Optional: scale font size inversely with distance for depth cue
        if (obj.visible && typeof obj.sync === "function") {
          const baseSize = settings.linkLabelFontSize * 0.25;
          const scale = Math.max(0.5, 1 - distance / EDGE_LABEL_LOD_THRESHOLD);
          obj.fontSize = baseSize * scale;
          obj.sync();
        }
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
  }, [graphData, setSelectedNode, settings, incrementor]);

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
