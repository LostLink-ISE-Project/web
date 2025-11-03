import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  ListFilter,
  LayoutGrid,
  ChevronDown,
  Search,
  ListCollapse,
  ChevronRight,
  FilePlus2,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

interface ItemToolbarProps {
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
  keyword: string;
  setKeyword: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  officeFilter: string[];
  setOfficeFilter: React.Dispatch<React.SetStateAction<string[]>>;
  dateRange: DateRange | undefined;
  setDateRange: (v: DateRange | undefined) => void;
  isForPublic?: boolean;
}

// 🔹 Replace with API later
const mockOffices = [
  { id: "1", name: "Building A" },
  { id: "2", name: "Building B" },
  { id: "3", name: "Library Office" },
];

export default function ItemToolbar({
  view,
  setView,
  keyword,
  setKeyword,
  sort,
  setSort,
  isForPublic = false,
  officeFilter,
  setOfficeFilter,
  dateRange,
  setDateRange,
}: ItemToolbarProps) {
  const hasFilters =
    keyword || sort !== "newest" || officeFilter.length > 0 || dateRange?.from;

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="w-full flex items-center gap-2">
        <div className="w-full flex items-center gap-3">
          <Search className="text-on-surface-foreground size-5" />
          <Input
            type="text"
            placeholder="Please enter to search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="rounded-lg text-on-surface-foreground"
          />
        </div>

        {isForPublic && (
          <Button className="flex text-white items-center py-5 rounded-lg gap-2">
            <FilePlus2 size={18} />
            New Submission
          </Button>
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center rounded-lg gap-2 border-0 shadow-md">
                <ListFilter size={16} />
                Sort
                <ChevronRight size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSort("newest")}>Newest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort("oldest")}>Oldest first</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-0 shadow-md">
                Offices
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {mockOffices.map((office) => (
                <DropdownMenuItem
                  key={office.id}
                  onClick={() => {
                    setOfficeFilter((prev) =>
                      prev.includes(office.name)
                        ? prev.filter((o) => o !== office.name)
                        : [...prev, office.name]
                    );
                  }}
                >
                  <span>{office.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-0 shadow-md">
                Date
                <ChevronDown size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          {hasFilters && (
            <div className="h-7 w-0.5 rounded-lg bg-on-surface-foreground" />
          )}

          <div className="flex gap-2 overflow-x-auto items-center">
            {keyword && (
              <Button variant="outline" className="rounded-lg px-4 border-outline">{keyword}</Button>
            )}
            {sort !== "newest" && (
              <Button variant="outline" className="rounded-lg px-4 border-outline">
                {sort === "oldest" ? "Oldest first" : sort}
              </Button>
            )}
            {officeFilter.map((o) => (
              <Button key={o} variant="outline" className="rounded-lg px-4 border-outline">
                {o}
              </Button>
            ))}
            {dateRange?.from && (
              <Button variant="outline" className="rounded-lg px-4 border-outline">
                {format(dateRange.from, "dd/MM/yyyy")}
                {dateRange.to && ` - ${format(dateRange.to, "dd/MM/yyyy")}`}
              </Button>
            )}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setKeyword("");
                  setSort("newest");
                  setOfficeFilter([]);
                  setDateRange(undefined);
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

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
