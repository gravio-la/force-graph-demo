import { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGraphStore } from "@/store/graphStore";

export function SearchOverlay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const searchQuery = useGraphStore((state) => state.searchQuery);
  const setSearchQuery = useGraphStore((state) => state.setSearchQuery);
  const graphData = useGraphStore((state) => state.sharedGraph?.graph ?? state.graphData);

  // Get search suggestions from graph data
  const searchSuggestions = graphData.nodes.map((node) => node.name);

  const filteredSuggestions = searchSuggestions.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle with keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  if (!isVisible) return null;

  return (
    <>
      {/* Collapsed state - tiny floating button */}
      {!isExpanded && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsExpanded(true)}
            className={cn(
              "h-10 w-10 rounded-full shadow-lg",
              "backdrop-blur-md bg-background/80 border border-border/50",
              "hover:bg-background/90 transition-all duration-200",
              "hover:scale-110"
            )}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Expanded state - search overlay */}
      {isExpanded && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <div
            className={cn(
              "rounded-lg shadow-2xl",
              "backdrop-blur-md bg-background/95 border border-border/50",
              "animate-in fade-in slide-in-from-top-2 duration-200"
            )}
          >
            <div className="flex items-center gap-2 p-2">
              <Command className="flex-1 border-0 shadow-none">
                <div className="flex items-center border-b border-border/50 px-3">
                  <Search className="h-4 w-4 shrink-0 opacity-50 mr-2" />
                  <CommandInput
                    placeholder="Search nodes... (Ctrl+K)"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    className="border-0 focus:ring-0 shadow-none"
                  />
                </div>
                {searchQuery && (
                  <CommandList className="max-h-64">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                      {filteredSuggestions.map((suggestion) => (
                        <CommandItem
                          key={suggestion}
                          onSelect={() => {
                            setSearchQuery(suggestion);
                          }}
                          className="cursor-pointer"
                        >
                          {suggestion}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsExpanded(false);
                  setSearchQuery("");
                }}
                className="h-8 w-8 shrink-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground px-2">
            <div className="flex items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+K</kbd>
              <span>Toggle search</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="h-6 text-xs"
              disabled={!searchQuery}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
