import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDebouncedValue } from '@/lib/hooks/debounceValue';
import ItemToolbar from '@/components/common/items/item-toolbar';
import ItemCard from '@/components/common/items/item-card';
import type { DateRange } from 'react-day-picker';
import { useItems } from '@/api/items/hook';
import { toast } from 'sonner';
import { useViewStore } from '@/lib/stores/view.store';

export type ItemStatus = 'SUBMITTED' | 'LISTED' | 'CLAIMED' | 'ARCHIVED';

const STATUSES: ItemStatus[] = ['SUBMITTED', 'LISTED', 'CLAIMED', 'ARCHIVED'];
const PAGE_SIZE = 10;

export default function ItemsPage() {
  const [tab, setTab] = useState<ItemStatus>('SUBMITTED');

  const view = useViewStore((s) => s.viewType);
  const setView = useViewStore((s) => s.setViewType);

  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const { data, isLoading, isError } = useItems(false, tab);

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
        submitterEmail: item.submitterEmail,
        officeInfo: `${item.givenLocation}`,
        category: item.category,
      }))
      .filter((item) => {
        const matchesKeyword = item.title?.toLowerCase().includes(debouncedKeyword.toLowerCase());
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
  }, [data, debouncedKeyword, officeFilter, dateRange, sort]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRootRef = useRef<HTMLDivElement | null>(null); // per-active tab container
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setIsLoadingMore(false);
    // scroll the active tab container to top after render
    const id = requestAnimationFrame(() => {
      scrollRootRef.current?.scrollTo?.({ top: 0 });
    });
    return () => cancelAnimationFrame(id);
  }, [tab, data, debouncedKeyword, officeFilter, dateRange, sort]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (visibleCount >= filteredItems.length) return;

        setIsLoadingMore(true);
        requestAnimationFrame(() => {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filteredItems.length));
          setIsLoadingMore(false);
        });
      },
      {
        root: scrollRootRef.current ?? null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [filteredItems.length, visibleCount]);

  const itemsToRender = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <Card className="border-0 shadow-none md:shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as ItemStatus)}>
          <TabsList className="w-full mb-4 border-b rounded-none overflow-x-auto">
            {STATUSES.map((status) => (
              <TabsTrigger key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </TabsTrigger>
            ))}
          </TabsList>

          <ItemToolbar
            view={view}
            setView={setView}
            keyword={keyword}
            setKeyword={setKeyword}
            sort={sort}
            setSort={setSort}
            dateRange={dateRange}
            setDateRange={setDateRange}
            officeFilter={officeFilter}
            setOfficeFilter={setOfficeFilter}
          />

          {STATUSES.map((status) => (
            <TabsContent key={status} value={status}>
              <div 
                className="overflow-auto max-h-[58vh]"
                ref={status === tab ? scrollRootRef : null}
              >
                <div
                  className={
                    view === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 pb-2'
                      : 'space-y-5 pb-2'
                  }
                >
                  {isLoading ? (
                    <div className="text-muted text-sm px-4 py-2">Loading items...</div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-muted text-sm px-4 py-2">No items found.</div>
                  ) : (
                    <>
                      {itemsToRender.map((item) => (
                        <ItemCard key={item.id} item={item} variant={view} />
                      ))}

                      {!isLoading && filteredItems.length > 0 && (
                        <>
                          <div ref={sentinelRef} className="h-8" />
                          {hasMore && (
                            <p className="text-xs text-muted-foreground text-center pb-3">
                              {isLoadingMore ? 'Loading more…' : 'Scroll to load more'}
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
