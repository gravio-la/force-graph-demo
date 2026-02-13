import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DEFAULT_MAX_HEIGHT = 200;
const DEFAULT_SEARCH_THRESHOLD = 10;

export interface OverlayListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  getItemKey?: (item: T) => string;
  searchPlaceholder?: string;
  getSearchKey?: (item: T) => string;
  maxHeight?: number;
  searchThreshold?: number;
  className?: string;
}

export function OverlayList<T>({
  items,
  renderItem,
  getItemKey,
  searchPlaceholder = "Search...",
  getSearchKey = (item) => String(item),
  maxHeight = DEFAULT_MAX_HEIGHT,
  searchThreshold = DEFAULT_SEARCH_THRESHOLD,
  className,
}: OverlayListProps<T>) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (items.length <= searchThreshold || !query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter((item) => getSearchKey(item).toLowerCase().includes(q));
  }, [items, query, searchThreshold, getSearchKey]);

  const showSearch = items.length > searchThreshold;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showSearch && (
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 text-sm"
        />
      )}
      <div
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight }}
      >
        {filteredItems.map((item) => (
          <div key={getItemKey?.(item) ?? getSearchKey(item)}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
