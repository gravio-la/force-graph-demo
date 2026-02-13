import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Info, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useColorMap } from "@/context/ColorMapContext";
import { useGraphStore } from "@/store/graphStore";

interface NodeInfoOverlayProps {
  onClose: () => void;
}

export function NodeInfoOverlay({ onClose }: NodeInfoOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { getGroupColor, getGroupLabel } = useColorMap();
  const node = useGraphStore((state) => state.selectedNode);

  useEffect(() => {
    if (node) {
      setIsVisible(true);
      setIsExpanded(true);
    } else {
      setIsVisible(false);
      setIsExpanded(false);
    }
  }, [node]);

  if (!isVisible || !node) return null;

  return (
    <>
      {/* Collapsed state - info icon FAB */}
      {!isExpanded && (
        <div className="fixed top-20 right-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className={cn(
              "h-10 w-10 rounded-full shadow-lg",
              "backdrop-blur-md bg-background/80 border border-border/50",
              "hover:bg-background/90 transition-all duration-200",
              "hover:scale-110"
            )}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Expanded state - node info panel */}
      {isExpanded && (
        <div className="fixed top-20 right-4 z-50 w-96">
          <div
            className={cn(
              "rounded-lg shadow-2xl",
              "backdrop-blur-md bg-background/95 border border-border/50",
              "animate-in fade-in slide-in-from-top-2 duration-200"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-4 border-b border-border/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getGroupColor(node.group) }}
                  />
                  <h3 className="font-semibold text-lg truncate">
                    {node.name || node.id}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getGroupLabel(node.group)} • ID: {node.id}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 shrink-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {node.description || "No description available."}
                  </p>
                </div>

                {/* Additional metadata */}
                {node.x !== undefined && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                      Position
                    </h4>
                    <div className="text-xs font-mono bg-muted/50 rounded p-2">
                      <div>x: {node.x.toFixed(2)}</div>
                      <div>y: {node.y.toFixed(2)}</div>
                      <div>z: {node.z.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Click on another node to view its details
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
