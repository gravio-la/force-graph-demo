import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Box, Globe, Network, Settings, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store/graphStore";
import { useForceGraph3DSettingsStore } from "@/store/forceGraph3DSettingsStore";
import { useFocusMode } from "@/context/FocusModeContext";

export function VisualizationToggle() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const getModeIcon = () => {
    switch (visualizationMode) {
      case "3d": return <Box className="h-4 w-4" />;
      case "cosmo": return <Globe className="h-4 w-4" />;
      case "2d": return <Network className="h-4 w-4" />;
    }
  };

  const getModeLabel = () => {
    switch (visualizationMode) {
      case "3d": return "3D View";
      case "cosmo": return "Cosmo";
      case "2d": return "2D View";
    }
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
      "transition-transform duration-500 ease-in-out md:translate-y-0",
      isFocusMode && "translate-y-[200%]"
    )}>
      {/* Compact Menu for very small screens (<400px) */}
      <div className="[@media(max-width:400px)]:block [@media(min-width:401px)]:hidden">
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                "rounded-full shadow-2xl px-4 gap-2",
                "backdrop-blur-md bg-background/95 border border-border/50",
                "hover:bg-background transition-all duration-200"
              )}
            >
              {getModeIcon()}
              <span className="font-medium">{getModeLabel()}</span>
              <ChevronUp className={cn(
                "h-3 w-3 transition-transform duration-200",
                isMenuOpen && "rotate-180"
              )} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="top"
            className={cn(
              "rounded-2xl shadow-2xl min-w-[160px]",
              "backdrop-blur-md bg-background/95 border border-border/50"
            )}
          >
            <DropdownMenuItem
              onClick={() => {
                setVisualizationMode("3d");
                setIsMenuOpen(false);
              }}
              className={cn(
                "rounded-lg cursor-pointer gap-2",
                visualizationMode === "3d" && "bg-primary text-primary-foreground"
              )}
            >
              <Box className="h-4 w-4" />
              <span>3D View</span>
            </DropdownMenuItem>
            {visualizationMode === "3d" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toggleSettings();
                    setIsMenuOpen(false);
                  }}
                  className="rounded-lg cursor-pointer gap-2 text-muted-foreground"
                >
                  <Settings className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isSettingsOpen && "rotate-45"
                  )} />
                  <span>Settings</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onClick={() => {
                setVisualizationMode("cosmo");
                setIsMenuOpen(false);
              }}
              className={cn(
                "rounded-lg cursor-pointer gap-2",
                visualizationMode === "cosmo" && "bg-primary text-primary-foreground"
              )}
            >
              <Globe className="h-4 w-4" />
              <span>Cosmo (2D)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setVisualizationMode("2d");
                setIsMenuOpen(false);
              }}
              className={cn(
                "rounded-lg cursor-pointer gap-2",
                visualizationMode === "2d" && "bg-primary text-primary-foreground"
              )}
            >
              <Network className="h-4 w-4" />
              <span>2D View</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Original pill style for larger screens (≥400px) */}
      <div className="[@media(max-width:400px)]:hidden [@media(min-width:401px)]:block">
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
    </div>
  );
}
