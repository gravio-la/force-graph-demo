import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database, ChevronDown, Clock, FileText, Pencil, Plus } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import { GraphEditorModal } from "./GraphEditorModal";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store/graphStore";
import { useCustomGraphsStore } from "@/store/customGraphsStore";
import type { GraphFile } from "@/store/graphStore";

// Import JSON files using Import Attributes syntax
import systemArchitectureData from "@/data/system-architecture.json" with { type: "json" };
import consciousnessData from "@/data/consciousness_graph.json" with { type: "json" };

export function GraphSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const currentGraphId = useGraphStore((state) => state.currentGraphId);
  const availableGraphs = useGraphStore((state) => state.availableGraphs);
  const setBuiltInGraphs = useGraphStore((state) => state.setBuiltInGraphs);
  const mergeCustomGraphs = useGraphStore((state) => state.mergeCustomGraphs);
  const loadGraph = useGraphStore((state) => state.loadGraph);
  const customGraphs = useCustomGraphsStore((state) => state.customGraphs);

  // Initialize built-in graphs and merge with custom on mount
  useEffect(() => {
    const builtIn: GraphFile[] = [
      {
        id: "system-architecture",
        path: "/src/data/system-architecture.json",
        metadata: systemArchitectureData.metadata,
        graph: systemArchitectureData.graph as any,
      },
      {
        id: "consciousness",
        path: "/src/data/consciousness_graph.json",
        metadata: consciousnessData.metadata,
        graph: consciousnessData.graph as any,
      },
    ];
    setBuiltInGraphs(builtIn);
  }, [setBuiltInGraphs]);

  // Re-merge when custom graphs change (e.g. after persist rehydration or add)
  useEffect(() => {
    mergeCustomGraphs();
  }, [customGraphs, mergeCustomGraphs]);

  const currentGraph = availableGraphs.find((g) => g.id === currentGraphId);

  const handleGraphChange = async (graphId: string) => {
    await loadGraph(graphId);
    setIsOpen(false);
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp;
      return date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className={cn(
              "h-10 px-4 rounded-full shadow-lg",
              "backdrop-blur-md bg-background/80 border border-border/50",
              "hover:bg-background/90 transition-all duration-200",
              "hover:scale-105"
            )}
          >
            <Database className="h-4 w-4 mr-2" />
            <span className="font-medium">
              {currentGraph?.metadata.name || "Select Graph"}
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={cn(
            "w-80 backdrop-blur-md bg-background/95 border border-border/50",
            "shadow-2xl"
          )}
        >
          <DropdownMenuLabel>Available Graphs</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {availableGraphs.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Loading graphs...
            </div>
          )}
          {availableGraphs.map((graph) => {
            const isCustom = graph.path === "local";
            return (
              <DropdownMenuItem
                key={graph.id}
                onClick={() => handleGraphChange(graph.id)}
                className={cn(
                  "cursor-pointer py-3 px-3",
                  currentGraphId === graph.id && "bg-accent"
                )}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="font-medium truncate">
                      {graph.metadata?.name || "Unknown"}
                    </span>
                    {currentGraphId === graph.id && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                    {isCustom && (
                      <button
                        type="button"
                        className="ml-auto p-1 rounded hover:bg-accent opacity-70 hover:opacity-100"
                        title="Edit graph"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          NiceModal.show(GraphEditorModal, {
                            initialGraph: graph,
                          });
                          setIsOpen(false);
                        }}
                        aria-label="Edit graph"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
                    {graph.metadata?.description || ""}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pl-6 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {graph.metadata?.timestamp
                        ? formatTimestamp(graph.metadata.timestamp)
                        : ""}
                    </span>
                    {(graph.graph?.nodes || graph.graph?.links) && (
                      <>
                        <span className="mx-1">•</span>
                        <span>
                          {graph.graph?.nodes?.length || 0} nodes,{" "}
                          {graph.graph?.links?.length || 0} links
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer py-3"
            onClick={() => {
              NiceModal.show(GraphEditorModal);
              setIsOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 shrink-0" />
              <span className="font-medium">Add new graph</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
