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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { mockItems } from "@/lib/types/item";
import ItemCard from "@/components/common/items/item-card";
import { useNavigate } from "react-router-dom";
import ReportModal from "@/components/common/modals/report-modal";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const navigate = useNavigate();

  // Get max 5 submitted items (filtered by date if applicable)
  const submittedItems = mockItems
    .filter((item) => {
      const isSubmitted = item.status === "submitted";
      const itemDate = new Date(item.date);
      const matchesDate =
        (!dateRange?.from || itemDate >= dateRange.from) &&
        (!dateRange?.to || itemDate <= dateRange.to);
      return isSubmitted && matchesDate;
    })
    .slice(0, 5); // max 5

  return (
    <>
      <div className="space-y-6">
        {/* ▶️ Stats and Report */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-xl">Stats and Report</CardTitle>
            <Button 
              className="flex text-white items-center py-5 rounded-lg"
              onClick={() => setReportModalOpen(true)}
            >
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
                      {dateRange.to
                        ? ` - ${format(dateRange.to, "dd/MM/yyyy")}`
                        : ""}
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

        {/* ▶️ Last Submitted Items */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Last Submitted Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {submittedItems.length > 0 ? (
              <>
                {submittedItems.map((item) => (
                  <ItemCard key={item.id} item={item} variant="list" />
                ))}
                <div className="flex justify-end">
                  <Button
                    className="flex text-white items-center py-5 rounded-lg"
                    onClick={() => navigate("/dashboard/items")}
                  >
                    See more
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No submitted items found.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} />
    </>
  );
}
