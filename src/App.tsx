import { ForceGraph3DComponent } from "./components/ForceGraph3D";
import { SigmaGraph } from "./components/SigmaGraph";
import { SearchOverlay } from "./components/SearchOverlay";
import { NodeInfoOverlay } from "./components/NodeInfoOverlay";
import { VisualizationToggle } from "./components/VisualizationToggle";
import { GraphSelector } from "./components/GraphSelector";
import { SettingsFAB } from "./components/SettingsFAB";
import { SettingsPanel } from "./components/SettingsPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useGraphStore } from "./store/graphStore";
import "./index.css";

export function App() {
  const visualizationMode = useGraphStore((state) => state.visualizationMode);
  const currentGraphId = useGraphStore((state) => state.currentGraphId);
  const setSelectedNode = useGraphStore((state) => state.setSelectedNode);

  const handleCloseNodeInfo = () => {
    setSelectedNode(null);
  };

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 w-full h-full bg-background overflow-hidden">
        {/* Visualization - Fullscreen (3D or 2D based on mode) */}
        {/* Key includes currentGraphId to force remount on graph change */}
        {visualizationMode === "3d" ? (
          <ForceGraph3DComponent key={`3d-${currentGraphId}`} />
        ) : (
          <SigmaGraph key={`2d-${currentGraphId}`} />
        )}
        
        {/* Graph Selector - Top left */}
        <GraphSelector />
        
        {/* Search Overlay - Top right */}
        <SearchOverlay />
        
        {/* Node Info Overlay - Shows below search */}
        <NodeInfoOverlay onClose={handleCloseNodeInfo} />
        
        {/* Visualization Mode Toggle - Bottom center */}
        <VisualizationToggle />
        
        {/* Settings FAB and Panel - Bottom left (only in 3D mode) */}
        {visualizationMode === "3d" && (
          <>
            <SettingsFAB />
            <SettingsPanel />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
