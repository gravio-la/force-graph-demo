import { create } from 'zustand';

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

interface GraphStore {
  graphData: GraphData;
  selectedNode: GraphNode | null;
  searchQuery: string;
  visualizationMode: '3d' | '2d';
  currentGraphId: string;
  availableGraphs: GraphFile[];
  setSelectedNode: (node: GraphNode | null) => void;
  setSearchQuery: (query: string) => void;
  setVisualizationMode: (mode: '3d' | '2d') => void;
  setGraphData: (data: GraphData) => void;
  loadGraph: (graphId: string) => Promise<void>;
  setAvailableGraphs: (graphs: GraphFile[]) => void;
}

// Initial graph data - Philosophical concepts
const initialGraphData: GraphData = {
  nodes: [
    { 
      id: "phenomenology", 
      name: "Phänomenologie", 
      description: "Beschreibung der Erscheinungen, wie sie sich dem Bewusstsein zeigen",
      group: 1 
    },
    { 
      id: "ontology", 
      name: "Ontologie", 
      description: "Lehre vom Sein, von der Wirklichkeit an sich",
      group: 2 
    },
    { 
      id: "taxonomy", 
      name: "Taxonomie", 
      description: "Klassifikation, Ordnungssysteme, Kategorisierung",
      group: 3 
    },
    { 
      id: "speculation", 
      name: "Spekulation", 
      description: "Geht über das unmittelbar Gegebene hinaus",
      group: 4 
    },
    { 
      id: "metaphysics", 
      name: "Metaphysik", 
      description: "Behauptet Wissen über das Übersinnliche",
      group: 4 
    },
    { 
      id: "dogmatism", 
      name: "Dogmatismus", 
      description: "Setzt Wahrheiten ohne kritische Prüfung voraus",
      group: 4 
    },
    { 
      id: "epistemology", 
      name: "Epistemologie", 
      description: "Erkenntnistheorie - fragt nach Bedingungen und Grenzen der Erkenntnis",
      group: 5 
    },
    { 
      id: "nominalism", 
      name: "Nominalismus", 
      description: "Sein als sprachliche oder gedankliche Konstruktion",
      group: 5 
    },
    { 
      id: "skepticism", 
      name: "Skeptizismus", 
      description: "Bezweifelt die Möglichkeit sicheren Wissens",
      group: 5 
    },
    { 
      id: "holism", 
      name: "Holismus", 
      description: "Das Ganze ist mehr als die Summe seiner Teile",
      group: 6 
    },
    { 
      id: "process", 
      name: "Prozessdenken", 
      description: "Wirklichkeit als dynamischer Prozess statt fixer Entitäten",
      group: 6 
    },
    { 
      id: "continuum", 
      name: "Kontinuum", 
      description: "Fließende Übergänge statt diskreter Kategorien",
      group: 6 
    },
    { 
      id: "rhizomatic", 
      name: "Rhizomatisch", 
      description: "Netzwerkartige, nicht-hierarchische Strukturen",
      group: 6 
    },
    { 
      id: "steiner", 
      name: "Steiners Problem", 
      description: "Behauptet Phänomenologie, betreibt aber Ontologie + Taxonomie okkulter Wesenheiten",
      group: 7 
    }
  ],
  links: [
    { source: "phenomenology", target: "ontology", label: "steht gegen" },
    { source: "phenomenology", target: "speculation", label: "steht gegen" },
    { source: "phenomenology", target: "metaphysics", label: "steht gegen" },
    { source: "phenomenology", target: "dogmatism", label: "steht gegen" },
    { source: "ontology", target: "phenomenology", label: "steht gegen" },
    { source: "ontology", target: "epistemology", label: "steht gegen" },
    { source: "ontology", target: "nominalism", label: "steht gegen" },
    { source: "ontology", target: "skepticism", label: "steht gegen" },
    { source: "taxonomy", target: "holism", label: "steht gegen" },
    { source: "taxonomy", target: "process", label: "steht gegen" },
    { source: "taxonomy", target: "continuum", label: "steht gegen" },
    { source: "taxonomy", target: "rhizomatic", label: "steht gegen" },
    { source: "steiner", target: "phenomenology", label: "behauptet" },
    { source: "steiner", target: "ontology", label: "praktiziert" },
    { source: "steiner", target: "taxonomy", label: "praktiziert" },
    { source: "speculation", target: "phenomenology", label: "verlässt" },
    { source: "metaphysics", target: "ontology", label: "radikalisiert" }
  ],
};

export const useGraphStore = create<GraphStore>((set, get) => ({
  graphData: initialGraphData,
  selectedNode: null,
  searchQuery: '',
  visualizationMode: '3d',
  currentGraphId: 'philosophical-concepts',
  availableGraphs: [],
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  setGraphData: (data) => set({ graphData: data }),
  setAvailableGraphs: (graphs) => set({ availableGraphs: graphs }),
  
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
        selectedNode: null,
        searchQuery: ''
      });
    }
  },
}));
