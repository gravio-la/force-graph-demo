import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ForceGraph3DSettings {
  // Node settings
  nodeLabelFontSize: number;
  nodeOpacity: number;
  showNodeLabels: boolean;
  
  // Link settings
  linkLabelFontSize: number;
  linkOpacity: number;
  linkWidth: number;
  showLinkLabels: boolean;
  
  // Camera & rendering
  backgroundColor: string;
  enableBloom: boolean;
  
  // Physics
  linkDistance: number;
  chargeStrength: number;
  cooldownTicks: number;
}

interface ForceGraph3DSettingsStore {
  settings: ForceGraph3DSettings;
  isSettingsOpen: boolean;
  
  updateSettings: (settings: Partial<ForceGraph3DSettings>) => void;
  resetSettings: () => void;
  toggleSettings: () => void;
  setSettingsOpen: (open: boolean) => void;
}

const DEFAULT_SETTINGS: ForceGraph3DSettings = {
  // Node settings
  nodeLabelFontSize: 12,
  nodeOpacity: 0.9,
  showNodeLabels: true,
  
  // Link settings
  linkLabelFontSize: 10,
  linkOpacity: 0.4,
  linkWidth: 0.5,
  showLinkLabels: true,
  
  // Camera & rendering
  backgroundColor: '#0a0a0a',
  enableBloom: false,
  
  // Physics
  linkDistance: 100,
  chargeStrength: -100,
  cooldownTicks: 100,
};

export const useForceGraph3DSettingsStore = create<ForceGraph3DSettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      isSettingsOpen: false,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      resetSettings: () =>
        set({ settings: DEFAULT_SETTINGS }),
      
      toggleSettings: () =>
        set((state) => ({
          isSettingsOpen: !state.isSettingsOpen
        })),
      
      setSettingsOpen: (open) =>
        set({ isSettingsOpen: open }),
    }),
    {
      name: 'force-graph-3d-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
