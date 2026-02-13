import { useSettingsStore } from '@/store/settingsStore';

export function SettingsPanel() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const showSettings = useSettingsStore((state) => state.showSettings);

  if (!showSettings) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
          3D Graph Settings
        </h3>
        
        {/* Show Node Labels */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-300">Show Node Labels</label>
          <input
            type="checkbox"
            checked={settings.showNodeLabels}
            onChange={(e) => updateSettings({ showNodeLabels: e.target.checked })}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Node Label Font Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Node Label Size</label>
            <span className="text-xs text-blue-400">{settings.nodeLabelFontSize}px</span>
          </div>
          <input
            type="range"
            min={8}
            max={24}
            step={1}
            value={settings.nodeLabelFontSize}
            onChange={(e) => updateSettings({ nodeLabelFontSize: Number(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Show Link Labels */}
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-300">Show Link Labels</label>
          <input
            type="checkbox"
            checked={settings.showLinkLabels}
            onChange={(e) => updateSettings({ showLinkLabels: e.target.checked })}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Link Label Font Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Link Label Size</label>
            <span className="text-xs text-blue-400">{settings.linkLabelFontSize}px</span>
          </div>
          <input
            type="range"
            min={6}
            max={18}
            step={1}
            value={settings.linkLabelFontSize}
            onChange={(e) => updateSettings({ linkLabelFontSize: Number(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Node Opacity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Node Opacity</label>
            <span className="text-xs text-blue-400">{settings.nodeOpacity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={settings.nodeOpacity}
            onChange={(e) => updateSettings({ nodeOpacity: Number(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Link Opacity */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Link Opacity</label>
            <span className="text-xs text-blue-400">{settings.linkOpacity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={settings.linkOpacity}
            onChange={(e) => updateSettings({ linkOpacity: Number(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Link Width */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Link Width</label>
            <span className="text-xs text-blue-400">{settings.linkWidth.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={settings.linkWidth}
            onChange={(e) => updateSettings({ linkWidth: Number(e.target.value) })}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
