import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link2, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { OverlayList } from "@/components/OverlayList";
import type { LinkTypeLegendItem } from "@/hooks/useLegendData";

interface LinkLegendOverlayProps {
  linkTypes: LinkTypeLegendItem[];
}

export function LinkLegendOverlay({ linkTypes }: LinkLegendOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {!isExpanded && (
        <div className="fixed bottom-6 right-6 z-40">
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
            <Link2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="fixed bottom-6 right-6 z-40 w-56">
          <div
            className={cn(
              "rounded-lg shadow-2xl p-4",
              "backdrop-blur-md bg-background/95 border border-border/50",
              "animate-in fade-in slide-in-from-bottom-2 duration-200"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Link Types</h3>
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
              {linkTypes.length} type{linkTypes.length !== 1 ? "s" : ""}
            </p>
            <OverlayList
              items={linkTypes}
              getItemKey={(t) => t.label}
              renderItem={(t) => (
                <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                  <div
                    className="w-5 h-0.5 rounded shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="truncate flex-1">{t.label}</span>
                  <span className="text-xs tabular-nums">{t.count}</span>
                </div>
              )}
              getSearchKey={(t) => t.label}
              searchPlaceholder="Filter link types..."
              maxHeight={200}
              searchThreshold={10}
            />
          </div>
        </div>
      )}
    </>
  );
}
