import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFocusMode } from "@/context/FocusModeContext";

export function FocusModeToggle() {
  const { isFocusMode, toggleFocusMode } = useFocusMode();

  return (
    <div className="fixed top-1/2 -translate-y-1/2 right-0 z-[60] md:hidden">
      <Button
        variant="secondary"
        size="icon"
        onClick={toggleFocusMode}
        className={cn(
          "h-14 w-14 rounded-l-2xl rounded-r-none shadow-2xl transition-all duration-300",
          "backdrop-blur-md bg-background/95 border border-r-0 border-border/50",
          "hover:bg-background hover:shadow-xl hover:scale-105",
          // More visible - only slightly off screen
          "translate-x-3 hover:translate-x-0",
          // Active state
          isFocusMode && "bg-primary/30 border-primary/60 shadow-primary/20"
        )}
        aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
      >
        <div className={cn(
          "transition-all duration-300",
          isFocusMode && "scale-110"
        )}>
          {isFocusMode ? (
            <Eye className="h-6 w-6" />
          ) : (
            <EyeOff className="h-6 w-6" />
          )}
        </div>
      </Button>
    </div>
  );
}
