import { useState } from "react";
import {
  CalendarIcon,
  ChevronDown,
  FileChartColumn,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { mockItems, type ItemStatus } from "@/lib/types/item";
import ItemCard from "@/components/common/items/item-card";

export default function DashboardPage() {
  const [tab, setTab] = useState<ItemStatus>("submitted");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // 🔍 Filter by tab + dateRange
  const filteredItems = mockItems
    .filter((item) => {
      const matchesStatus = item.status === tab;
      const itemDate = new Date(item.date);
      const matchesDate =
        (!dateRange?.from || itemDate >= dateRange.from) &&
        (!dateRange?.to || itemDate <= dateRange.to);
      return matchesStatus && matchesDate;
    });

  return (
    <div className="space-y-6">
      {/* ▶️ Stats and Report */}
      <Card className="border-0 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-xl">Stats and Report</CardTitle>
          <Button className="flex text-white items-center py-5 rounded-lg">
            <FileChartColumn />
            Generate report
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-outline rounded-lg"
              >
                <CalendarIcon className="w-4 h-4" />
                {dateRange?.from ? (
                  <span>
                    {format(dateRange.from, "dd/MM/yyyy")}
                    {dateRange.to ? ` - ${format(dateRange.to, "dd/MM/yyyy")}` : ""}
                  </span>
                ) : (
                  <span>Set range</span>
                )}
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

          {/* Stat Cards */}
          <div className="flex flex-row gap-4 h-fit w-full justify-between">
            <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
              <p className="text-2xl text-on-surface">32</p>
              <p className="text-on-surface-foreground">Found items</p>
            </Card>
            <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
              <p className="text-2xl text-on-surface">8</p>
              <p className="text-on-surface-foreground">Claimed items</p>
            </Card>
            <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
              <p className="text-2xl text-on-surface">23</p>
              <p className="text-on-surface-foreground">Archived items</p>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ▶️ Last Items */}
      <Card className="border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Last Submitted Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as ItemStatus)}>
            <TabsList className="w-full mb-4 border-b rounded-none">
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            {["submitted", "approved", "archived"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="space-y-5">
                  {filteredItems
                    .filter((item) => item.status === status)
                    .map((item) => (
                      <ItemCard key={item.id} item={item} variant="list" />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
