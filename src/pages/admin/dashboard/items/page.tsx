import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ItemStatus } from "@/lib/types/item";
import { useDebouncedValue } from "@/lib/hooks/debounceValue";
import ItemToolbar from "@/components/common/items/item-toolbar";
import ItemCard from "@/components/common/items/item-card";
import { mockItems } from "../page";

export default function ItemsPage() {
  const [tab, setTab] = useState<ItemStatus>("submitted");
  const [view, setView] = useState<"list" | "grid">("list");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("newest");

  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const filteredItems = mockItems
    .filter(
        (item) =>
        item.status === tab &&
        item.title.toLowerCase().includes(debouncedKeyword.toLowerCase())
    )
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
          />

          {["submitted", "approved", "archived"].map((status) => (
            <TabsContent key={status} value={status}>
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                    : "space-y-5"
                }
              >
                {filteredItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    location={item.location}
                    date={item.date}
                    status={item.status}
                    image={item.image}
                    variant={view}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
