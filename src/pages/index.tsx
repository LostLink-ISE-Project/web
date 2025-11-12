import { Button } from '@/components/ui/button';
import LostLinkLogo from '@/assets/LostLink.svg';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ItemCard from '@/components/common/items/item-card';
import ItemToolbar from '@/components/common/items/item-toolbar';
import type { DateRange } from 'react-day-picker';
import { useItems } from '@/api/items/hook';
import { toast } from 'sonner';

export default function HomePage() {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('newest');
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data, isLoading, isError } = useItems(false, 'LISTED');

  if (isError) toast.error('Failed to load items');

  const filteredItems = useMemo(() => {
    const items = data ?? [];

    return items
      .map((item) => ({
        id: String(item.id),
        title: item.itemName,
        description: item.itemDescription,
        location: item.foundLocation,
        date: item.createdDate,
        status: item.itemStatus,
        image: `${import.meta.env.VITE_API_URL}/media/${item.image}`,
        officeInfo: item.givenLocation,
        category: item.category,
      }))
      .filter((item) => {
        const matchesKeyword = item.title?.toLowerCase().includes(keyword.toLowerCase());
        const matchesOffice = officeFilter.length === 0 || officeFilter.includes(item.officeInfo);
        const itemDate = new Date(item.date);
        const matchesDate =
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to);

        return matchesKeyword && matchesOffice && matchesDate;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return sort === 'newest'
          ? bDate.getTime() - aDate.getTime()
          : aDate.getTime() - bDate.getTime();
      });
  }, [data, keyword, sort, officeFilter, dateRange]);

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 py-6 gap-4 overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center">
        <a href="/">
          <img src={LostLinkLogo} alt="Logo" className="transition-all w-24 sm:w-32" />
        </a>
        <Link to={'/login'}>
          <Button className="flex text-white items-center py-5 rounded-lg gap-2">
            <span className="hidden sm:inline">Log In</span>
            <LogIn size={18} />
          </Button>
        </Link>
      </div>

      {/* Filters + Items */}
      <div className="flex flex-col p-0 md:p-9 gap-0 md:gap-6">
        <ItemToolbar
          view={view}
          setView={setView}
          keyword={keyword}
          setKeyword={setKeyword}
          sort={sort}
          setSort={setSort}
          isForPublic
          dateRange={dateRange}
          setDateRange={setDateRange}
          officeFilter={officeFilter}
          setOfficeFilter={setOfficeFilter}
        />

        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
          }
        >
          {isLoading ? (
            <p className="text-muted-foreground px-2">Loading items...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-muted-foreground px-2">No listed items found.</p>
          ) : (
            filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} variant={view} isForPublic />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
