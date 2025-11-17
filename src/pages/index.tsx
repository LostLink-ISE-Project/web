import { Button } from '@/components/ui/button';
import LostLinkLogo from '@/assets/LostLink.svg';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import ItemCard from '@/components/common/items/item-card';
import ItemToolbar from '@/components/common/items/item-toolbar';
import type { DateRange } from 'react-day-picker';
import { useItems } from '@/api/items/hook';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useViewStore } from '@/lib/stores/view.store';

const PAGE_SIZE = 10;

export default function HomePage() {
  const view = useViewStore((s) => s.viewType);
  const setView = useViewStore((s) => s.setViewType);

  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const token = useAuthStore((s) => s.token);

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

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [keyword, sort, officeFilter, dateRange, data]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const rootEl = scrollRootRef.current ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (visibleCount >= filteredItems.length) return;

        setIsLoadingMore(true);
        // slight delay gives smooth UX; not required
        requestAnimationFrame(() => {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredItems.length));
          setIsLoadingMore(false);
        });
      },
      {
        root: rootEl, // watch within the scrollable container
        rootMargin: '0px 0px 200px 0px', // start loading a bit earlier
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [filteredItems.length, visibleCount]);

  const itemsToRender = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 py-6 gap-4 overflow-y-scroll">
      {/* Header */}
      <div className="flex justify-between items-center">
        <a href="/">
          <img src={LostLinkLogo} alt="Logo" className="transition-all w-24 sm:w-32" />
        </a>
        {token ? (
          <Link to="/dashboard">
            <Button className="flex text-white items-center py-5 rounded-lg gap-2">
              <span className="hidden sm:inline">Dashboard</span>
              <LayoutDashboard size={18} />
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button className="flex text-white items-center py-5 rounded-lg gap-2">
              <span className="hidden sm:inline">Log In</span>
              <LogIn size={18} />
            </Button>
          </Link>
        )}
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

        {isLoading ? (
          <p className="text-muted-foreground px-2 self-center">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-muted-foreground px-2 self-center">No listed items found.</p>
        ) : (
          <>
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-14'
                  : 'flex flex-col gap-4'
              }
            >
              {itemsToRender.map((item) => (
                  <ItemCard key={item.id} item={item} variant={view} isForPublic />
              ))}
            </div>

            <div ref={sentinelRef} className="h-8" />
            {hasMore && (
              <p className="text-xs text-muted-foreground text-center pb-6">
                {isLoadingMore ? 'Loading more…' : 'Scroll to load more'}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
