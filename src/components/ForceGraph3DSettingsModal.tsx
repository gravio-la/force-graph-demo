import { useState, useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash-es";
import { useForceGraph3DSettingsStore } from "@/store/forceGraph3DSettingsStore";
import type { ForceGraph3DSettings } from "@/store/forceGraph3DSettingsStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function ForceGraph3DSettingsModal() {
  const settings = useForceGraph3DSettingsStore((state) => state.settings);
  const isOpen = useForceGraph3DSettingsStore((state) => state.isSettingsOpen);
  const updateSettings = useForceGraph3DSettingsStore((state) => state.updateSettings);
  const resetSettings = useForceGraph3DSettingsStore((state) => state.resetSettings);
  const setSettingsOpen = useForceGraph3DSettingsStore((state) => state.setSettingsOpen);

  // Local state for immediate UI updates
  const [localSettings, setLocalSettings] = useState<ForceGraph3DSettings>(settings);

  // Update local settings when store settings change (e.g., on reset)
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Debounced update to store (and thus to the graph)
  const debouncedUpdateRef = useRef(
    debounce((newSettings: Partial<ForceGraph3DSettings>) => {
      updateSettings(newSettings);
    }, 300)
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateRef.current.cancel();
    };
  }, []);

  const handleSettingChange = useCallback((newSettings: Partial<ForceGraph3DSettings>) => {
    // Update local state immediately for responsive UI
    setLocalSettings((prev) => ({ ...prev, ...newSettings }));
    // Debounce the actual update to the store
    debouncedUpdateRef.current(newSettings);
  }, []);

  const handleReset = useCallback(() => {
    debouncedUpdateRef.current.cancel();
    resetSettings();
  }, [resetSettings]);

  return (
    <Dialog open={isOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto backdrop-blur-md bg-gray-900/60 border border-gray-700/50 shadow-2xl text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">3D Force Graph Settings</DialogTitle>
          <DialogDescription className="text-gray-300">
            Customize the appearance and behavior of the 3D force-directed graph visualization.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Node Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Node Settings
            </h4>
            
            {/* Show Node Labels */}
            <div className="flex items-center justify-between py-2">
              <label htmlFor="showNodeLabels" className="text-sm text-gray-300 cursor-pointer">
                Show Node Labels
              </label>
              <input
                id="showNodeLabels"
                type="checkbox"
                checked={localSettings.showNodeLabels}
                onChange={(e) => handleSettingChange({ showNodeLabels: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              />
            </div>

            {/* Node Label Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="nodeLabelSize" className="text-sm text-gray-300">
                  Node Label Size
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {localSettings.nodeLabelFontSize}px
                </span>
              </div>
              <input
                id="nodeLabelSize"
                type="range"
                min={6}
                max={28}
                step={1}
                value={localSettings.nodeLabelFontSize}
                onChange={(e) => handleSettingChange({ nodeLabelFontSize: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Node Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="nodeOpacity" className="text-sm text-gray-300">
                  Node Opacity
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {(localSettings.nodeOpacity * 100).toFixed(0)}%
                </span>
              </div>
              <input
                id="nodeOpacity"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={localSettings.nodeOpacity}
                onChange={(e) => handleSettingChange({ nodeOpacity: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Link Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Link Settings
            </h4>
            
            {/* Show Link Labels */}
            <div className="flex items-center justify-between py-2">
              <label htmlFor="showLinkLabels" className="text-sm text-gray-300 cursor-pointer">
                Show Link Labels
              </label>
              <input
                id="showLinkLabels"
                type="checkbox"
                checked={localSettings.showLinkLabels}
                onChange={(e) => handleSettingChange({ showLinkLabels: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
              />
            </div>

            {/* Link Label Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="linkLabelSize" className="text-sm text-gray-300">
                  Link Label Size
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {localSettings.linkLabelFontSize}px
                </span>
              </div>
              <input
                id="linkLabelSize"
                type="range"
                min={4}
                max={20}
                step={1}
                value={localSettings.linkLabelFontSize}
                onChange={(e) => handleSettingChange({ linkLabelFontSize: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Link Opacity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="linkOpacity" className="text-sm text-gray-300">
                  Link Opacity
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {(localSettings.linkOpacity * 100).toFixed(0)}%
                </span>
              </div>
              <input
                id="linkOpacity"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={localSettings.linkOpacity}
                onChange={(e) => handleSettingChange({ linkOpacity: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Link Width */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="linkWidth" className="text-sm text-gray-300">
                  Link Width
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {localSettings.linkWidth.toFixed(1)}
                </span>
              </div>
              <input
                id="linkWidth"
                type="range"
                min={0.1}
                max={5}
                step={0.1}
                value={localSettings.linkWidth}
                onChange={(e) => handleSettingChange({ linkWidth: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Physics Settings Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-100 border-b border-gray-700 pb-2">
              Physics Settings
            </h4>

            {/* Link Distance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="linkDistance" className="text-sm text-gray-300">
                  Link Distance
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {localSettings.linkDistance}
                </span>
              </div>
              <input
                id="linkDistance"
                type="range"
                min={10}
                max={500}
                step={10}
                value={localSettings.linkDistance}
                onChange={(e) => handleSettingChange({ linkDistance: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Charge Strength */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="chargeStrength" className="text-sm text-gray-300">
                  Charge Strength
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {localSettings.chargeStrength}
                </span>
              </div>
              <input
                id="chargeStrength"
                type="range"
                min={-500}
                max={0}
                step={10}
                value={localSettings.chargeStrength}
                onChange={(e) => handleSettingChange({ chargeStrength: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Cooldown Ticks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="cooldownTicks" className="text-sm text-gray-300">
                  Cooldown Ticks
                </label>
                <span className="text-sm font-medium text-blue-400">
                  {localSettings.cooldownTicks}
                </span>
              </div>
              <input
                id="cooldownTicks"
                type="range"
                min={0}
                max={500}
                step={10}
                value={localSettings.cooldownTicks}
                onChange={(e) => handleSettingChange({ cooldownTicks: Number(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2 border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setSettingsOpen(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
