import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDebouncedValue } from '@/lib/hooks/debounceValue';
import ItemToolbar from '@/components/common/items/item-toolbar';
import ItemCard from '@/components/common/items/item-card';
import type { DateRange } from 'react-day-picker';
import { useItems, useDeleteItem, useUpdateItemStatus } from '@/api/items/hook';
import { toast } from 'sonner';
import { useViewStore } from '@/lib/stores/view.store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Trash } from 'lucide-react';
import ConfirmActionModal from '@/components/common/modals/confirm-modal';

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

  // selection state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmBulk, setConfirmBulk] = useState<{
    open: boolean;
    type: 'delete' | 'status' | null;
    nextStatus?: ItemStatus;
  }>({ open: false, type: null });

  const deleteItem = useDeleteItem();
  const updateStatus = useUpdateItemStatus();

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
        image: item.image,
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
    // reset selection on any filter/tab change
    setSelectedIds([]);
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allVisibleIds = itemsToRender.map((i) => i.id);

  const selectAllVisible = () => {
    const visibleSubmitted = allVisibleIds;
    const allSelected = visibleSubmitted.every((id) => selectedIds.includes(id));
    setSelectedIds(
      allSelected
        ? selectedIds.filter((id) => !visibleSubmitted.includes(id))
        : Array.from(new Set([...selectedIds, ...visibleSubmitted]))
    );
  };

  const performBulk = async () => {
    const ids = selectedIds.map(Number);
    if (ids.length === 0) return;
    console.log('[bulk:confirm]', {
      action: confirmBulk.type === 'delete' ? 'delete' : `status:${confirmBulk.nextStatus ?? ''}`,
      selectedIds: ids,
    });
    try {
      if (confirmBulk.type === 'delete') {
        await Promise.all(ids.map((id) => deleteItem.mutateAsync(id)));
        toast.success(`Deleted ${ids.length} item(s).`);
      } else if (confirmBulk.type === 'status' && confirmBulk.nextStatus) {
        await Promise.all(
          ids.map((id) =>
            updateStatus.mutateAsync({ id, payload: { status: confirmBulk.nextStatus! } })
          )
        );
        toast.success(`Updated ${ids.length} item(s) to ${confirmBulk.nextStatus}.`);
      }
      setSelectedIds([]);
      setSelectMode(false);
    } catch {
      toast.error('Bulk action failed.');
    } finally {
      setConfirmBulk({ open: false, type: null });
    }
  };

  return (
    <>
      <Card className="border-0 shadow-none md:shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-xl">Items</CardTitle>

            {(tab === 'SUBMITTED' || tab === 'LISTED') && (
              <div className="flex items-center gap-2">
                {selectMode ? (
                  <>
                    <Button variant="outline" onClick={() => setSelectMode(false)}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={selectAllVisible}>
                      {allVisibleIds.every((id) => selectedIds.includes(id)) &&
                      allVisibleIds.length > 0
                        ? 'Unselect visible'
                        : 'Select visible'}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="text-white flex items-center gap-2">
                          Bulk action <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tab === 'SUBMITTED' && (
                          <>
                            <DropdownMenuItem
                              className="text-destructive flex gap-2 items-center"
                              onClick={() => {
                                console.log('[bulk:choose]', {
                                  action: 'delete',
                                  selectedIds: selectedIds.map(Number),
                                });
                                setConfirmBulk({ open: true, type: 'delete' });
                              }}
                            >
                              <Trash className="w-4 h-4" /> Delete selected
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('[bulk:choose]', {
                                  action: 'status:LISTED',
                                  selectedIds: selectedIds.map(Number),
                                });
                                setConfirmBulk({
                                  open: true,
                                  type: 'status',
                                  nextStatus: 'LISTED',
                                });
                              }}
                            >
                              Mark as LISTED
                            </DropdownMenuItem>
                          </>
                        )}
                        {tab === 'LISTED' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('[bulk:choose]', {
                                  action: 'status:CLAIMED',
                                  selectedIds: selectedIds.map(Number),
                                });
                                setConfirmBulk({
                                  open: true,
                                  type: 'status',
                                  nextStatus: 'CLAIMED',
                                });
                              }}
                            >
                              Mark as CLAIMED
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                console.log('[bulk:choose]', {
                                  action: 'status:ARCHIVED',
                                  selectedIds: selectedIds.map(Number),
                                });
                                setConfirmBulk({
                                  open: true,
                                  type: 'status',
                                  nextStatus: 'ARCHIVED',
                                });
                              }}
                            >
                              Mark as ARCHIVED
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button className="text-white" onClick={() => setSelectMode(true)}>
                    Select items
                  </Button>
                )}
              </div>
            )}
          </div>
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
                          <div key={item.id} className="relative">
                            {selectMode && (
                              <div className="absolute top-2 left-2 z-10">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.includes(item.id)}
                                  onChange={() => toggleSelect(item.id)}
                                  aria-label={`Select item ${item.title}`}
                                  className="h-4 w-4"
                                />
                              </div>
                            )}
                            <ItemCard item={item} variant={view} selecting={selectMode} />
                          </div>
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

      <ConfirmActionModal
        open={confirmBulk.open}
        title={confirmBulk.type === 'delete' ? 'Delete items' : 'Change status'}
        description={
          selectedIds.length === 0
            ? 'No items selected.'
            : confirmBulk.type === 'delete'
              ? `Are you sure you want to delete ${selectedIds.length} item(s)? This cannot be undone.`
              : `Are you sure you want to mark ${selectedIds.length} item(s) as ${confirmBulk.nextStatus}?`
        }
        confirmLabel={confirmBulk.type === 'delete' ? 'Delete' : 'Confirm'}
        onConfirm={performBulk}
        onCancel={() => setConfirmBulk({ open: false, type: null })}
      />
    </>
  );
}
