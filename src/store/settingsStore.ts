import { create } from 'zustand';

export interface GraphSettings {
  nodeLabelFontSize: number;
  linkLabelFontSize: number;
  nodeOpacity: number;
  linkOpacity: number;
  linkWidth: number;
  showLinkLabels: boolean;
  showNodeLabels: boolean;
}

interface SettingsStore {
  settings: GraphSettings;
  showSettings: boolean;
  updateSettings: (settings: Partial<GraphSettings>) => void;
  toggleSettings: () => void;
  setShowSettings: (show: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    nodeLabelFontSize: 12,
    linkLabelFontSize: 10,
    nodeOpacity: 0.9,
    linkOpacity: 0.4,
    linkWidth: 0.5,
    showLinkLabels: true,
    showNodeLabels: true,
  },
  showSettings: false,
  
  updateSettings: (newSettings) => 
    set((state) => ({ 
      settings: { ...state.settings, ...newSettings } 
    })),
  
  toggleSettings: () => 
    set((state) => ({ 
      showSettings: !state.showSettings 
    })),
  
  setShowSettings: (show) => 
    set({ showSettings: show }),
}));
