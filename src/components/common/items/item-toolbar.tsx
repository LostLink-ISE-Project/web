// src/components/item/ItemToolbar.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ListFilter,
  LayoutGrid,
  ChevronDown,
  Search,
  ListCollapse,
  ChevronRight,
  X,
} from "lucide-react";

interface ItemToolbarProps {
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
  keyword: string;
  setKeyword: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}

export default function ItemToolbar({
  view,
  setView,
  keyword,
  setKeyword,
  sort,
  setSort,
}: ItemToolbarProps) {
  const hasFilters = keyword || sort !== "newest";

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Search className="text-on-surface-foreground size-5"/>
        {/* 🔍 Search Input */}
        <Input
            type="text"
            placeholder="Please enter to search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-lg text-on-surface-foreground"
        />
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-4">
            {/* 🔽 Sort Button */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center rounded-lg gap-2 border-0 shadow-md">
                        <ListFilter size={16} />
                        Sort
                        <ChevronRight size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSort("newest")}>
                        Newest first
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSort("oldest")}>
                        Oldest first
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-7 w-0.5 rounded-lg bg-on-surface-foreground" />

            {/* 🔘 Active Filter Chips */}
            <div className="flex gap-2 overflow-x-auto items-center">
                {keyword && (
                    <Button
                        variant="outline"
                        className="rounded-lg px-4 border-outline"
                    >
                        {keyword}
                    </Button>
                    )}
                    {sort !== "newest" && (
                    <Button
                        variant="outline"
                        className="rounded-lg px-4 border-outline"
                    >
                        {sort === "oldest" ? "Oldest first" : sort}
                    </Button>
                )}

                {/* Optional: Clear All */}
                {hasFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                        setKeyword("");
                        setSort("newest");
                        }}
                    >
                        Clear all
                    </Button>
                )}
            </div>
        </div>

        {/* 🟦 View Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-0 shadow-md">
              {view === "list" ? <ListCollapse size={16} /> : <LayoutGrid size={16} />}
              {view === "list" ? "List view" : "Grid view"}
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setView("list")}>
              <ListCollapse className="mr-2 h-4 w-4" />
              List view
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setView("grid")}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Grid view
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
