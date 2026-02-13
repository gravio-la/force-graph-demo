import { Settings } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

export function SettingsFAB() {
  const toggleSettings = useSettingsStore((state) => state.toggleSettings);
  const showSettings = useSettingsStore((state) => state.showSettings);

  return (
    <button
      onClick={toggleSettings}
      className={`fixed bottom-[5rem] left-6 z-50 w-14 h-14 rounded-full shadow-lg 
        flex items-center justify-center transition-all duration-200 hover:scale-110
        ${showSettings 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-800 hover:bg-gray-700'
        }`}
      aria-label="Toggle Settings"
    >
      <Settings 
        className={`w-6 h-6 text-white transition-transform duration-200 
          ${showSettings ? 'rotate-45' : ''}`} 
      />
    </button>
  );
}
