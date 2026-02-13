import { Button } from "@/components/ui/button";
import { Box, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store/graphStore";

export function VisualizationToggle() {
  const visualizationMode = useGraphStore((state) => state.visualizationMode);
  const setVisualizationMode = useGraphStore((state) => state.setVisualizationMode);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-full shadow-2xl",
          "backdrop-blur-md bg-background/95 border border-border/50"
        )}
      >
        <Button
          variant={visualizationMode === "3d" ? "default" : "ghost"}
          size="sm"
          onClick={() => setVisualizationMode("3d")}
          className={cn(
            "rounded-full transition-all duration-200",
            visualizationMode === "3d" && "shadow-lg"
          )}
        >
          <Box className="h-4 w-4 mr-2" />
          3D View
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
