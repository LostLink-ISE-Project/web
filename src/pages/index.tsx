import { Button } from '@/components/ui/button';
import LostLinkLogo from '@/assets/LostLink.svg';
import { LayoutDashboard, Loader2, LogIn, Package, CheckCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from 'react';
import ItemCard from '@/components/common/items/item-card';
import ItemToolbar from '@/components/common/items/item-toolbar';
import type { DateRange } from 'react-day-picker';
import { useItems } from '@/api/items/hook';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useViewStore } from '@/lib/stores/view.store';
import { version } from '../../package.json';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addDays, format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getPublicReport } from '@/lib/actions/report.actions';

const PAGE_SIZE = 10;

export default function HomePage() {
  const view = useViewStore((s) => s.viewType);
  const setView = useViewStore((s) => s.setViewType);

  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statsTimePeriod, setStatsTimePeriod] = useState<string>('month');

  const token = useAuthStore((s) => s.token);

  const { data, isLoading, isError } = useItems(false, 'LISTED');

  // Report data for statistics
  // const {
  //   data: reportData,
  //   isLoading: isReportLoading,
  //   isError: isReportError,
  // } = useReport({
  //   period: statsTimePeriod,
  //   scope: 'general',
  // });

  const period = useMemo(() => computePublicPeriod(statsTimePeriod), [statsTimePeriod]);
  const {
    data: reportData,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useQuery({
    queryKey: ['public-report', period],
    queryFn: () => getPublicReport({ period }),
  });

  if (isError) toast.error('Failed to load items');
  if (isReportError) toast.error('Failed to load statistics');

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
        officeInfo:
          typeof item.givenLocation === 'string' ? item.givenLocation : item.givenLocation.name,
        locationAndHours:
          typeof item.givenLocation === 'string'
            ? item.givenLocation
            : `${item.givenLocation.location}, ${item.givenLocation.workHours}`,
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

  function computePublicPeriod(windowKey?: string): string | undefined {
    if (!windowKey) return undefined;

    const today = new Date();
    const endExclusive = format(addDays(today, 1), "yyyy-MM-dd");

    if (windowKey === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const start = format(startOfMonth, "yyyy-MM-dd");
      return `${start}_${endExclusive}`;
    }

    if (windowKey === "semester") {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      const start = format(sixMonthsAgo, "yyyy-MM-dd");
      return `${start}_${endExclusive}`;
    }

    if (windowKey === "all") {
      const start = "1970-01-01";
      return `${start}_${endExclusive}`;
    }

    return undefined; // backend defaults to today
  }

  return (
    <>
      <div className="flex flex-col px-4 sm:px-8 md:px-16 lg:px-32 py-6 gap-4 overflow-y-scroll">
        {/* Header */}
        <div className="flex justify-between items-center">
          <a href="/">
            <img src={LostLinkLogo} alt="Logo" className="transition-all w-24 sm:w-32" />
          </a>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
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
        </div>

        {/* Statistics Section */}
        <div className="mx-6 md:mx-0">
          {/* Time Period Selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Statistics</h2>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={statsTimePeriod} onValueChange={setStatsTimePeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="semester">This Semester</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Found Items Card */}
            <Card className="border-0 shadow-md rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-xs font-medium mb-1">Found Items</p>
                    <p className="text-2xl font-bold text-blue-900 mb-1">
                      {isReportLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        reportData?.data?.found || '0'
                      )}
                    </p>
                    <p className="text-blue-700 text-xs">Waiting to be claimed</p>
                  </div>
                  <div className="p-2 bg-blue-200 rounded-full">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claimed Items Card */}
            <Card className="border-0 shadow-md rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-xs font-medium mb-1">Claimed Items</p>
                    <p className="text-2xl font-bold text-green-900 mb-1">
                      {isReportLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        reportData?.data?.claimed || '0'
                      )}
                    </p>
                    <p className="text-green-700 text-xs">Successfully reunited</p>
                  </div>
                  <div className="p-2 bg-green-200 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
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
      {/* Footer */}
      <footer className="flex flex-col gap-2 justify-center items-center py-4">
        <p className="text-sm text-gray-700">
          &copy; {new Date().getFullYear()} LostLink. All rights reserved.
        </p>
        <p className="text-sm text-gray-700">
          Powered by{' '}
          <a href="https://fh.usg.az" target="_blank" className="hover:underline">
            Future Hub
          </a>
        </p>
        <p className="text-sm text-gray-700">v{version}</p>
      </footer>
    </>
  );
}
