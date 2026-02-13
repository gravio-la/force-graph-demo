import { create } from "zustand";
import { useCustomGraphsStore } from "./customGraphsStore";
import consciousnessData from "@/data/consciousness_graph.json" with { type: "json" };

export interface GraphNode {
  id: string;
  name: string;
  description?: string;
  group: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GraphMetadata {
  name: string;
  description: string;
  timestamp: string;
}

export interface GraphFile {
  id: string;
  path: string;
  metadata: GraphMetadata;
  graph: GraphData;
}

export interface SharedGraphState {
  graph: GraphData;
  metadata: GraphMetadata;
}

interface GraphStore {
  graphData: GraphData;
  sharedGraph: SharedGraphState | null;
  selectedNode: GraphNode | null;
  searchQuery: string;
  visualizationMode: "3d" | "cosmo" | "2d";
  currentGraphId: string;
  availableGraphs: GraphFile[];
  builtInGraphs: GraphFile[];
  setSelectedNode: (node: GraphNode | null) => void;
  setSearchQuery: (query: string) => void;
  setVisualizationMode: (mode: "3d" | "cosmo" | "2d") => void;
  setGraphData: (data: GraphData) => void;
  setSharedGraph: (data: SharedGraphState | null) => void;
  loadGraph: (graphId: string) => Promise<void>;
  setAvailableGraphs: (graphs: GraphFile[]) => void;
  setBuiltInGraphs: (builtIn: GraphFile[]) => void;
  mergeCustomGraphs: () => void;
}

const defaultGraphData: GraphData = {
  nodes: JSON.parse(JSON.stringify(consciousnessData.graph.nodes)),
  links: JSON.parse(JSON.stringify(consciousnessData.graph.links)),
};

export const useGraphStore = create<GraphStore>((set, get) => ({
  graphData: defaultGraphData,
  sharedGraph: null,
  selectedNode: null,
  searchQuery: "",
  visualizationMode: "3d",
  currentGraphId: "consciousness",
  availableGraphs: [],
  builtInGraphs: [],

  setSelectedNode: (node) => set({ selectedNode: node }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  setGraphData: (data) => set({ graphData: data }),
  setSharedGraph: (data) => set({ sharedGraph: data }),
  setAvailableGraphs: (graphs) => set({ availableGraphs: graphs }),

  setBuiltInGraphs: (builtIn) =>
    set({
      builtInGraphs: builtIn,
      availableGraphs: [
        ...builtIn,
        ...useCustomGraphsStore.getState().customGraphs,
      ],
    }),

  mergeCustomGraphs: () =>
    set({
      availableGraphs: [
        ...get().builtInGraphs,
        ...useCustomGraphsStore.getState().customGraphs,
      ],
    }),

  loadGraph: async (graphId: string) => {
    const graphs = get().availableGraphs;
    const graphFile = graphs.find(g => g.id === graphId);
    
    if (graphFile) {
      // Deep clone to prevent mutations from affecting the original data
      const clonedGraph = {
        nodes: JSON.parse(JSON.stringify(graphFile.graph.nodes)),
        links: JSON.parse(JSON.stringify(graphFile.graph.links)),
      };
      
      set({ 
        graphData: clonedGraph,
        currentGraphId: graphId,
        sharedGraph: null,
        selectedNode: null,
        searchQuery: ''
      });
      if (typeof window !== "undefined" && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
  },
}));
