import { useState, useMemo } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import { useDebouncedValue } from "@/lib/hooks/debounceValue";
import ItemToolbar from "@/components/common/items/item-toolbar";
import ItemCard from "@/components/common/items/item-card";
import type { DateRange } from "react-day-picker";
import { useItems } from "@/api/items/hook";
import { toast } from "sonner";

export type ItemStatus = "SUBMITTED" | "LISTED" | "CLAIMED" | "ARCHIVED";

const STATUSES: ItemStatus[] = ["SUBMITTED", "LISTED", "CLAIMED", "ARCHIVED"];

export default function ItemsPage() {
  const [tab, setTab] = useState<ItemStatus>("SUBMITTED");
  const [view, setView] = useState<"list" | "grid">("list");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("newest");
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const { data, isLoading, isError } = useItems(false);

  if (isError) toast.error("Failed to load items");

  const filteredItems = useMemo(() => {
    const items = data ?? [];

    return items
      .map((item) => ({
        id: String(item.id),
        title: item.itemName,
        description: item.itemDescription,
        location: item.foundLocation,
        date: item.createdDate,
        status: item.status as ItemStatus,
        image: `${import.meta.env.VITE_API_URL}/media/${item.image}`,
        officeInfo: `${item.givenLocation}`, // replace with mapped office if needed
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
        return sort === "newest" ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime();
      });
  }, [data, debouncedKeyword, officeFilter, dateRange, sort]);

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
              <div className="overflow-auto max-h-[58vh]">
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 pb-2"
                      : "space-y-5 pb-2"
                  }
                >
                  {isLoading ? (
                    <div className="text-muted text-sm px-4 py-2">Loading items...</div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-muted text-sm px-4 py-2">No items found.</div>
                  ) : (
                    filteredItems.map((item) => (
                      <ItemCard key={item.id} item={item} variant={view} />
                    ))
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
