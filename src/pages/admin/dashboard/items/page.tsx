import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockItems, type ItemStatus } from "@/lib/types/item";
import { useDebouncedValue } from "@/lib/hooks/debounceValue";
import ItemToolbar from "@/components/common/items/item-toolbar";
import ItemCard from "@/components/common/items/item-card";
import type { DateRange } from "react-day-picker";

export default function ItemsPage() {
  const [tab, setTab] = useState<ItemStatus>("submitted");
  const [view, setView] = useState<"list" | "grid">("list");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("newest");
  const [officeFilter, setOfficeFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const filteredItems = mockItems
    .filter((item) => {
      const matchesStatus = item.status === tab;
      const matchesKeyword = item.title.toLowerCase().includes(debouncedKeyword.toLowerCase());
      const matchesOffice =
        officeFilter.length === 0 || (item.officeInfo && officeFilter.includes(item.officeInfo));
      const itemDate = new Date(item.date);
      const matchesDate =
        (!dateRange?.from || itemDate >= dateRange.from) &&
        (!dateRange?.to || itemDate <= dateRange.to);

      return matchesStatus && matchesKeyword && matchesOffice && matchesDate;
    })
    .sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return sort === "newest" ? bDate.getTime() - aDate.getTime() : aDate.getTime() - bDate.getTime();
    });

  return (
    <Card className="border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={(v) => setTab(v as ItemStatus)}>
          <TabsList className="w-full mb-4 border-b rounded-none">
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
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


          {["submitted", "approved", "archived"].map((status) => (
            <TabsContent key={status} value={status}>
              <div className="overflow-auto max-h-[58vh]">
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 pb-2"
                      : "space-y-5 pb-2"
                  }
                >
                  {filteredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      variant={view}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
