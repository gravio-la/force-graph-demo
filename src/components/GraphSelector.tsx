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
import { Database, ChevronDown, Clock, FileText, Link2, Pencil, Plus, Share2, Trash2 } from "lucide-react";
import NiceModal from "@ebay/nice-modal-react";
import { GraphEditorModal } from "./GraphEditorModal";
import { ConfirmDeleteGraphModal } from "./ConfirmDeleteGraphModal";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store/graphStore";
import { useCustomGraphsStore } from "@/store/customGraphsStore";
import { useFocusMode } from "@/context/FocusModeContext";
import type { GraphFile } from "@/store/graphStore";
import { encode, stripSimulationState } from "@/lib/graphHash";

// Import JSON files using Import Attributes syntax
import systemArchitectureData from "@/data/system-architecture.json" with { type: "json" };
import consciousnessData from "@/data/consciousness_graph.json" with { type: "json" };

export function GraphSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const { isFocusMode } = useFocusMode();
  const currentGraphId = useGraphStore((state) => state.currentGraphId);
  const availableGraphs = useGraphStore((state) => state.availableGraphs);
  const sharedGraph = useGraphStore((state) => state.sharedGraph);
  const graphData = useGraphStore((state) => state.graphData);
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
  const effectiveLabel = sharedGraph?.metadata.name ?? currentGraph?.metadata?.name ?? "Select Graph";
  const addCustomGraph = useCustomGraphsStore((s) => s.addCustomGraph);
  const removeCustomGraph = useCustomGraphsStore((s) => s.removeCustomGraph);

  function slug(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  const handleEditShared = () => {
    if (!sharedGraph) return;
    const id = `local-${slug(sharedGraph.metadata.name)}-${Date.now()}`;
    // Sanitize so we never persist internal/lib data (__threeObj etc.)
    const cleanGraph = stripSimulationState(sharedGraph.graph);
    const graphFile: GraphFile = {
      id,
      path: "local",
      metadata: { ...sharedGraph.metadata },
      graph: {
        nodes: JSON.parse(JSON.stringify(cleanGraph.nodes)),
        links: JSON.parse(JSON.stringify(cleanGraph.links)),
      },
    };
    addCustomGraph(graphFile);
    mergeCustomGraphs();
    if (typeof window !== "undefined" && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    useGraphStore.getState().setSharedGraph(null);
    loadGraph(id);
    setIsOpen(false);
  };

  const handleShare = async () => {
    const metadata = sharedGraph?.metadata ?? currentGraph?.metadata ?? {
      name: "Shared graph",
      description: "",
      timestamp: new Date().toISOString(),
    };
    const rawGraph = sharedGraph?.graph ?? graphData;
    const graph = stripSimulationState(rawGraph);
    const payload = { metadata, graph };
    const hash = encode(payload);
    const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    } catch (err) {
      console.warn("Failed to copy share URL:", err);
    }
    setIsOpen(false);
  };

  const handleGraphChange = async (graphId: string) => {
    await loadGraph(graphId);
    setIsOpen(false);
  };

  const handleRequestDelete = (graph: GraphFile) => {
    NiceModal.show(ConfirmDeleteGraphModal, {
      graph,
      onConfirm: () => {
        const wasCurrent = currentGraphId === graph.id;
        removeCustomGraph(graph.id);
        mergeCustomGraphs();
        if (wasCurrent) {
          const remaining = useGraphStore.getState().availableGraphs;
          const next = remaining.find((g) => g.id !== graph.id);
          if (next) loadGraph(next.id);
          else loadGraph("consciousness");
        }
        setIsOpen(false);
      },
    });
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
    <div className={cn(
      "fixed top-4 left-4 z-50",
      "transition-transform duration-500 ease-in-out md:translate-x-0",
      isFocusMode && "-translate-x-[200%]"
    )}>
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
              {effectiveLabel}
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
          {sharedGraph && (
            <>
              <DropdownMenuItem
                className="cursor-pointer py-3 px-3 bg-accent/50"
                onSelect={(e) => e.preventDefault()}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0 w-full">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium truncate">
                      {sharedGraph.metadata.name}
                    </span>
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Active
                    </span>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-accent opacity-70 hover:opacity-100"
                      title="Copy to local and edit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEditShared();
                      }}
                      aria-label="Copy to local and edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 pl-6">
                    {sharedGraph.metadata.description || ""}
                  </p>
                  <p className="text-xs text-muted-foreground pl-6 italic">
                    From shared link
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pl-6 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {sharedGraph.metadata.timestamp
                        ? formatTimestamp(sharedGraph.metadata.timestamp)
                        : ""}
                    </span>
                    <span className="mx-1">•</span>
                    <span>
                      {sharedGraph.graph?.nodes?.length ?? 0} nodes,{" "}
                      {sharedGraph.graph?.links?.length ?? 0} links
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {availableGraphs.length === 0 && !sharedGraph && (
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
                      <>
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
                        <button
                          type="button"
                          className="p-1 rounded hover:bg-destructive/20 opacity-70 hover:opacity-100 text-destructive"
                          title="Delete graph"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRequestDelete(graph);
                          }}
                          aria-label="Delete graph"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
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
            onClick={handleShare}
          >
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 shrink-0" />
              <span className="font-medium">{shareFeedback ? "Copied!" : "Share graph"}</span>
            </div>
          </DropdownMenuItem>
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
