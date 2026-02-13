import { Button } from "@/components/ui/button";
import { Box, Globe, Network, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store/graphStore";
import { useForceGraph3DSettingsStore } from "@/store/forceGraph3DSettingsStore";
import { useFocusMode } from "@/context/FocusModeContext";

export function VisualizationToggle() {
  const visualizationMode = useGraphStore((state) => state.visualizationMode);
  const setVisualizationMode = useGraphStore((state) => state.setVisualizationMode);
  const toggleSettings = useForceGraph3DSettingsStore((state) => state.toggleSettings);
  const isSettingsOpen = useForceGraph3DSettingsStore((state) => state.isSettingsOpen);
  const { isFocusMode } = useFocusMode();

  const handle3DClick = (e: React.MouseEvent) => {
    // If clicking on the settings icon area (right side), toggle settings
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isSettingsClick = clickX > rect.width - 40; // Last 40px is settings area
    
    if (visualizationMode === "3d" && isSettingsClick) {
      e.stopPropagation();
      toggleSettings();
    } else {
      setVisualizationMode("3d");
    }
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
      "transition-transform duration-500 ease-in-out md:translate-y-0",
      isFocusMode && "translate-y-[200%]"
    )}>
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-full shadow-2xl",
          "backdrop-blur-md bg-background/95 border border-border/50"
        )}
      >
        <Button
          variant={visualizationMode === "3d" ? "default" : "ghost"}
          size="sm"
          onClick={handle3DClick}
          className={cn(
            "rounded-full transition-all duration-200 gap-2",
            visualizationMode === "3d" && "shadow-lg"
          )}
        >
          <Box className="h-4 w-4" />
          <span>3D View</span>
          {visualizationMode === "3d" && (
            <>
              <span className="text-xs opacity-50">•</span>
              <Settings 
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  isSettingsOpen && "rotate-45"
                )}
              />
            </>
          )}
        </Button>
        
        <Button
          variant={visualizationMode === "cosmo" ? "default" : "ghost"}
          size="sm"
          onClick={() => setVisualizationMode("cosmo")}
          className={cn(
            "rounded-full transition-all duration-200",
            visualizationMode === "cosmo" && "shadow-lg"
          )}
        >
          <Globe className="h-4 w-4 mr-2" />
          Cosmo (2D)
        </Button>
        <Button
          variant={visualizationMode === "2d" ? "default" : "ghost"}
          size="sm"
          onClick={() => setVisualizationMode("2d")}
          className={cn(
            "rounded-full transition-all duration-200",
            visualizationMode === "2d" && "shadow-lg"
          )}
        >
          <Network className="h-4 w-4 mr-2" />
          2D View
        </Button>
      </div>
    </div>
  );
}
