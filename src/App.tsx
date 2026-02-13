import { useEffect } from "react";
import { ForceGraph3DComponent } from "./components/ForceGraph3D";
import { CosmographGraph } from "./components/CosmographGraph";
import { SigmaGraph } from "./components/SigmaGraph";
import { SearchOverlay } from "./components/SearchOverlay";
import { NodeInfoOverlay } from "./components/NodeInfoOverlay";
import { VisualizationToggle } from "./components/VisualizationToggle";
import { GraphSelector } from "./components/GraphSelector";
import { ForceGraph3DSettingsModal } from "./components/ForceGraph3DSettingsModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GroupLegendOverlay } from "./components/GroupLegendOverlay";
import { LinkLegendOverlay } from "./components/LinkLegendOverlay";
import { ColorMapProvider } from "./context/ColorMapContext";
import { useLegendData } from "./hooks/useLegendData";
import { useGraphStore } from "./store/graphStore";
import { decode, stripSimulationState } from "./lib/graphHash";
import "./index.css";

function LegendOverlays() {
  const { groups, linkTypes } = useLegendData();
  return (
    <>
      <GroupLegendOverlay groups={groups} />
      <LinkLegendOverlay linkTypes={linkTypes} />
    </>
  );
}

function useHashGraphSync() {
  const setSharedGraph = useGraphStore((state) => state.setSharedGraph);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setSharedGraph(null);
        return;
      }
      try {
        const { graph, metadata } = decode(hash);
        const cleanGraph = stripSimulationState(graph);
        setSharedGraph({
          graph: JSON.parse(JSON.stringify(cleanGraph)),
          metadata,
        });
      } catch (err) {
        console.warn("Failed to decode graph from URL hash:", err);
        setSharedGraph(null);
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [setSharedGraph]);
}

export function App() {
  useHashGraphSync();
  const visualizationMode = useGraphStore((state) => state.visualizationMode);
  const currentGraphId = useGraphStore((state) => state.currentGraphId);
  const sharedGraph = useGraphStore((state) => state.sharedGraph);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);
  const graphKey = sharedGraph ? "url" : currentGraphId;

  const handleCloseNodeInfo = () => {
    setSelectedNode(null);
  };

  return (
    <ErrorBoundary>
      <ColorMapProvider>
        <div className="fixed inset-0 w-full h-full bg-background overflow-hidden">
          {/* Visualization - Fullscreen (3D, Cosmo, or 2D based on mode) */}
          {/* Key includes currentGraphId to force remount on graph change */}
          {visualizationMode === "3d" ? (
            <ForceGraph3DComponent key={`3d-${graphKey}`} />
          ) : visualizationMode === "cosmo" ? (
            <CosmographGraph key={`cosmo-${graphKey}`} />
          ) : (
            <SigmaGraph key={`2d-${graphKey}`} />
          )}
          
          {/* Graph Selector - Top left */}
          <GraphSelector />
          
          {/* Search Overlay - Top right */}
          <SearchOverlay />
          
          {/* Node Info Overlay - Shows below search */}
          <NodeInfoOverlay onClose={handleCloseNodeInfo} />
          
          {/* Legend overlays - Bottom left (groups), Bottom right (link types) */}
          <LegendOverlays />
          
          {/* Visualization Mode Toggle - Bottom center */}
          <VisualizationToggle />
          
          {/* 3D Settings Modal - shown when 3D mode is active */}
          {visualizationMode === "3d" && <ForceGraph3DSettingsModal />}
        </div>
      </ColorMapProvider>
    </ErrorBoundary>
  );
}

export default App;
