import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { GraphFile } from "@/store/graphStore";

interface CustomGraphsStore {
  customGraphs: GraphFile[];
  addCustomGraph: (graph: GraphFile) => void;
  updateCustomGraph: (id: string, graph: GraphFile) => void;
  removeCustomGraph: (id: string) => void;
}

const STORAGE_KEY = "force-graph-custom-graphs";

export const useCustomGraphsStore = create<CustomGraphsStore>()(
  persist(
    (set, get) => ({
      customGraphs: [],

      addCustomGraph: (graph) =>
        set((state) => ({
          customGraphs: [...state.customGraphs, graph],
        })),

      updateCustomGraph: (id, graph) =>
        set((state) => ({
          customGraphs: state.customGraphs.map((g) =>
            g.id === id ? graph : g
          ),
        })),

      removeCustomGraph: (id) =>
        set((state) => ({
          customGraphs: state.customGraphs.filter((g) => g.id !== id),
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
