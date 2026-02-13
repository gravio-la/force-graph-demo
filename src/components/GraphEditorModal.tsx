import { useState, useCallback } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import CodeMirror from "@uiw/react-codemirror";
import { yaml as yamlLang } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";
import * as jsYaml from "js-yaml";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCustomGraphsStore } from "@/store/customGraphsStore";
import { useGraphStore } from "@/store/graphStore";
import type { GraphFile, GraphData, GraphMetadata } from "@/store/graphStore";

const DEFAULT_YAML = `graph:
  nodes:
    - id: node1
      name: Node 1
      description: Optional description
      group: 1
    - id: node2
      name: Node 2
      description: Optional
      group: 1
  links:
    - source: node1
      target: node2
      label: connects to
`;

function parseAndValidateGraph(yamlStr: string): GraphData | string {
  try {
    const parsed = jsYaml.load(yamlStr) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return "YAML must define an object with a 'graph' key.";
    }
    const obj = parsed as { graph?: unknown };
    if (!obj.graph || typeof obj.graph !== "object") {
      return "YAML must contain 'graph:' with 'nodes' and 'links'.";
    }
    const graph = obj.graph as Record<string, unknown>;
    const nodes = graph.nodes;
    const links = graph.links;
    if (!Array.isArray(nodes)) {
      return "graph.nodes must be an array.";
    }
    if (!Array.isArray(links)) {
      return "graph.links must be an array.";
    }
    return {
      nodes: nodes as GraphData["nodes"],
      links: links as GraphData["links"],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return `Invalid YAML: ${message}`;
  }
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function graphToYaml(graph: GraphData): string {
  return jsYaml.dump({ graph }, { indent: 2 });
}

export interface GraphEditorModalProps {
  initialGraph?: GraphFile;
}

export const GraphEditorModal = NiceModal.create<GraphEditorModalProps>(() => {
  const modal = useModal();
  const initialGraph = modal.args?.initialGraph;

  const [name, setName] = useState(initialGraph?.metadata.name ?? "");
  const [description, setDescription] = useState(
    initialGraph?.metadata.description ?? ""
  );
  const [yamlValue, setYamlValue] = useState(
    initialGraph ? graphToYaml(initialGraph.graph) : DEFAULT_YAML
  );
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const addCustomGraph = useCustomGraphsStore((s) => s.addCustomGraph);
  const updateCustomGraph = useCustomGraphsStore((s) => s.updateCustomGraph);
  const mergeCustomGraphs = useGraphStore((s) => s.mergeCustomGraphs);
  const loadGraph = useGraphStore((s) => s.loadGraph);

  const isEdit = !!initialGraph;

  const handleSave = () => {
    setError(null);
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    if (!trimmedDesc) {
      setError("Description is required.");
      return;
    }

    const result = parseAndValidateGraph(yamlValue);
    if (typeof result === "string") {
      setError(result);
      return;
    }

    const timestamp = new Date().toISOString();
    const metadata: GraphMetadata = {
      name: trimmedName,
      description: trimmedDesc,
      timestamp,
    };
    const id = isEdit
      ? initialGraph!.id
      : `local-${slug(trimmedName)}-${Date.now()}`;
    const graphFile: GraphFile = {
      id,
      path: "local",
      metadata,
      graph: result,
    };

    if (isEdit) {
      updateCustomGraph(initialGraph!.id, graphFile);
    } else {
      addCustomGraph(graphFile);
    }
    mergeCustomGraphs();
    loadGraph(id);
    modal.resolve(graphFile);
    modal.hide();
    setTimeout(() => modal.remove(), 200);
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        modal.hide();
        setTimeout(() => modal.remove(), 200);
      }
    },
    [modal]
  );

  return (
    <Dialog open={modal.visible} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "flex flex-col",
          fullscreen
            ? "inset-0 w-full h-full max-w-none max-h-none translate-x-0 translate-y-0 rounded-none"
            : "sm:max-w-2xl max-h-[90vh]"
        )}
        showCloseButton={true}
      >
        <button
          type="button"
          className="absolute top-4 right-12 z-10 rounded-xs p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
          onClick={() => setFullscreen((v) => !v)}
          title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {fullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit graph" : "Add new graph"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the name, description, or graph YAML below."
              : "Enter a name and description, then define the graph in YAML below."}
          </DialogDescription>
        </DialogHeader>

        <div className={cn("grid gap-4 py-2", fullscreen && "flex-1 min-h-0 flex flex-col overflow-hidden")}>
          <div className="grid gap-2">
            <Label htmlFor="graph-name">Name (required)</Label>
            <Input
              id="graph-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Graph"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="graph-description">Description (required)</Label>
            <Input
              id="graph-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the graph"
            />
          </div>
          <div className={cn("grid gap-2", fullscreen && "flex-1 min-h-0 flex flex-col")}>
            <Label>Graph (YAML)</Label>
            <div className={cn(
              "rounded-md border overflow-hidden bg-[#282c34] min-h-[200px]",
              fullscreen && "flex-1 min-h-0"
            )}>
              <CodeMirror
                value={yamlValue}
                height={fullscreen ? "calc(100vh - 280px)" : "200px"}
                extensions={[yamlLang(), oneDark]}
                onChange={setYamlValue}
                theme="dark"
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: true,
                }}
              />
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEdit ? "Update" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
