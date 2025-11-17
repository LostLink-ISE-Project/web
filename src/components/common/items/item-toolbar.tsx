import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  ListFilter,
  LayoutGrid,
  ChevronDown,
  Search,
  ListCollapse,
  ChevronRight,
  FilePlus2,
} from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useOffices } from '@/api/office/hook';
import { toast } from 'sonner';

interface ItemToolbarProps {
  view: 'list' | 'grid';
  setView: (v: 'list' | 'grid') => void;
  keyword: string;
  setKeyword: (v: string) => void;
  sort: 'newest' | 'oldest';
  setSort: Dispatch<SetStateAction<'newest' | 'oldest'>>;
  officeFilter: string[];
  setOfficeFilter: React.Dispatch<React.SetStateAction<string[]>>;
  dateRange: DateRange | undefined;
  setDateRange: (v: DateRange | undefined) => void;
  isForPublic?: boolean;
}

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
  const { data: offices = [], isLoading, isError } = useOffices();

  useEffect(() => {
    if (isError) toast.error('Failed to load offices.');
  }, [isError]);

  const hasFilters = keyword || sort !== 'newest' || officeFilter.length > 0 || dateRange?.from;

  const formattedOffices = useMemo(() => {
    return offices.map((o) => o.name);
  }, [offices]);

  const submissionLink = useMemo(() => {
    const host = window.location.hostname;

    if (host.includes("localhost") || host.includes("127.0.0.1")) {
      return "https://lostlink-form-dev.usg.az";
    }

    if (host.includes("lostlink-dev.usg.az")) {
      return "https://lostlink-form-dev.usg.az";
    }

    return "https://lostlink-form.usg.az";
  }, []);

  return (
    <div className="flex flex-col gap-4 mb-6 w-full">
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
          <Button asChild className="flex text-white items-center py-5 rounded-lg gap-2">
            <a href={submissionLink} target="_blank" rel="noreferrer">
              <FilePlus2 size={18} />
              <span className="hidden sm:inline">New Submission</span>
            </a>
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-1 border-outline md:border-0 shadow-none md:shadow-md"
              >
                <ListFilter size={16} />
                <span className="hidden sm:inline">Sort</span>
                <ChevronRight size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSort('newest')}>Newest first</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSort('oldest')}>Oldest first</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Office Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-1 border-outline md:border-0 shadow-none md:shadow-md"
              >
                Offices
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {isLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : formattedOffices.length === 0 ? (
                <DropdownMenuItem disabled>No offices found</DropdownMenuItem>
              ) : (
                formattedOffices.map((office) => (
                  <DropdownMenuItem
                    key={office}
                    onClick={() =>
                      setOfficeFilter((prev) =>
                        prev.includes(office) ? prev.filter((o) => o !== office) : [...prev, office]
                      )
                    }
                  >
                    <span>{office}</span>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-1 border-outline md:border-0 shadow-none md:shadow-md"
              >
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

          {/* Chips */}
          {hasFilters && (
            <div className="h-0.5 md:h-7 w-full md:w-0.5 rounded-lg bg-on-surface-foreground" />
          )}

          <div className="flex gap-2 overflow-x-auto items-center">
            {keyword && (
              <Button variant="outline" className="rounded-lg px-4 border-outline">
                {keyword}
              </Button>
            )}
            {sort !== 'newest' && (
              <Button variant="outline" className="rounded-lg px-4 border-outline">
                {sort === 'oldest' ? 'Oldest first' : sort}
              </Button>
            )}
            {officeFilter.map((o) => (
              <Button key={o} variant="outline" className="rounded-lg px-4 border-outline">
                {o}
              </Button>
            ))}
            {dateRange?.from && (
              <Button variant="outline" className="rounded-lg px-4 border-outline">
                {format(dateRange.from, 'dd/MM/yyyy')}
                {dateRange.to && ` - ${format(dateRange.to, 'dd/MM/yyyy')}`}
              </Button>
            )}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setKeyword('');
                  setSort('newest');
                  setOfficeFilter([]);
                  setDateRange(undefined);
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* View Switch */}
        <div className="self-start sm:self-auto mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-1 border-outline md:border-0 shadow-none md:shadow-md"
              >
                {view === 'list' ? <ListCollapse size={16} /> : <LayoutGrid size={16} />}
                <span className="hidden sm:inline">
                  {view === 'list' ? 'List view' : 'Grid view'}
                </span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setView('list')}>
                <ListCollapse className="mr-2 h-4 w-4" />
                List view
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setView('grid')}>
                <LayoutGrid className="mr-2 h-4 w-4" />
                Grid view
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
