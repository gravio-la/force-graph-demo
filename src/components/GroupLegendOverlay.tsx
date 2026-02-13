import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverlayList } from "@/components/OverlayList";
import type { GroupLegendItem } from "@/hooks/useLegendData";

interface GroupLegendOverlayProps {
  groups: GroupLegendItem[];
}

export function GroupLegendOverlay({ groups }: GroupLegendOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {!isExpanded && (
        <div className="fixed bottom-6 left-6 z-40">
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
            <Palette className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="fixed bottom-6 left-6 z-40 w-56">
          <div
            className={cn(
              "rounded-lg shadow-2xl p-4",
              "backdrop-blur-md bg-background/95 border border-border/50",
              "animate-in fade-in slide-in-from-bottom-2 duration-200"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Node Groups</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-7 w-7 shrink-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {groups.length} group{groups.length !== 1 ? "s" : ""}
            </p>
            <OverlayList
              items={groups}
              getItemKey={(g) => g.id}
              renderItem={(g) => (
                <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: g.color }}
                  />
                  <span className="truncate flex-1">{g.label}</span>
                  <span className="text-xs tabular-nums">{g.count}</span>
                </div>
              )}
              getSearchKey={(g) => g.label}
              searchPlaceholder="Filter groups..."
              maxHeight={200}
              searchThreshold={10}
            />
          </div>
        </div>
      )}
    </>
  );
}
