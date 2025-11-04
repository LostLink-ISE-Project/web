import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

const fakeReportData = [
  { title: "Found items", count: 32 },
  { title: "Claimed items", count: 8 },
  { title: "Archived items", count: 23 },
];

export default function ReportModal({ open, onClose }: ReportModalProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [scope, setScope] = useState("general");

  const formatDateRangeParam = () => {
    if (!dateRange?.from || !dateRange?.to) return "";
    return `${format(dateRange.from, "dd_MM_yyyy")}-${format(dateRange.to, "dd_MM_yyyy")}`;
  };

  const handleDownload = (type: "csv" | "pdf") => {
    const period = formatDateRangeParam();
    const params = `?period=${period}&scope=${scope}`;

    // Future: fetch(`/v1/report${params}`).then(...)

    // For now: simulate file
    const content =
      type === "csv"
        ? fakeReportData.map(row => `${row.title},${row.count}`).join("\n")
        : JSON.stringify(fakeReportData, null, 2);

    const blob = new Blob([content], {
      type: type === "csv" ? "text/csv" : "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${scope}.${type}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Range Picker */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Period</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start w-full text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
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
          </div>

          {/* Scope Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Scope</label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="found">Found</SelectItem>
                <SelectItem value="offices">Offices</SelectItem>
                <SelectItem value="locations">Locations</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <Button
            variant="destructive"
            onClick={() => handleDownload("pdf")}
          >
            Download PDF
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-600/80 text-white"
            onClick={() => handleDownload("csv")}
          >
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
