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
import { toast } from "sonner";
import { getReport } from "@/lib/actions/report.actions";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportModal({ open, onClose }: ReportModalProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [scope, setScope] = useState("general");
  const [isDownloading, setIsDownloading] = useState(false);

  const formatDateRangeParam = () => {
    if (!dateRange?.from || !dateRange?.to) return "";
    return `${format(dateRange.from, "dd_MM_yyyy")}-${format(dateRange.to, "dd_MM_yyyy")}`;
  };

  const handleDownload = async (type: "csv" | "pdf") => {
    try {
      setIsDownloading(true);
      const period = formatDateRangeParam();
      const result = await getReport({ period, scope });

      if (!result.ok) throw new Error(result.message);

      const content =
        type === "csv"
          ? Object.entries(result.data)
              .map(([key, val]) => `${key},${val}`)
              .join("\n")
          : JSON.stringify(result.data, null, 2);

      const blob = new Blob([content], {
        type: type === "csv" ? "text/csv" : "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report_${scope}.${type}`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Report downloaded as ${type.toUpperCase()}`);
    } catch (err: any) {
      toast.error("Failed to generate report");
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
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
            disabled={isDownloading}
            onClick={() => handleDownload("pdf")}
          >
            Download PDF
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-600/80 text-white"
            disabled={isDownloading}
            onClick={() => handleDownload("csv")}
          >
            Download CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
