import { useState, useMemo } from 'react';
import { CalendarIcon, ChevronDown, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useItems } from '@/api/items/hook';
import ItemCard from '@/components/common/items/item-card';
import { useNavigate } from 'react-router-dom';
// import ReportModal from '@/components/common/modals/report-modal';
import { toast } from 'sonner';
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getReport } from "@/lib/actions/report.actions";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  // const [reportModalOpen, setReportModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useItems(true);

  // Build period param with exclusive "to"
  const period = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return undefined;
    const from = dateRange.from ?? dateRange.to!;
    const toRaw = dateRange.to ?? dateRange.from!;
    const toExclusive = addDays(toRaw, 1);
    return `${format(from, "yyyy-MM-dd")}_${format(toExclusive, "yyyy-MM-dd")}`;
  }, [dateRange]);

  const filteredItems = useMemo(() => {
    return (data ?? []).filter((item) => {
      const itemDate = new Date(item.createdDate);
      return (
        (!dateRange?.from || itemDate >= dateRange.from) &&
        (!dateRange?.to || itemDate <= dateRange.to)
      );
    });
  }, [data, dateRange]);

  const totalFound = filteredItems.length;
  const claimedCount = filteredItems.filter((item) => item.itemStatus === 'CLAIMED').length;
  const archivedCount = filteredItems.filter((item) => item.itemStatus === 'ARCHIVED').length;

  if (isError) toast.error('Failed to load submitted items');

  const submittedItems = useMemo(() => {
    const items = data ?? [];

    return items
      .filter((item) => item.itemStatus === 'SUBMITTED')
      .filter((item) => {
        const itemDate = new Date(item.createdDate);
        return (
          (!dateRange?.from || itemDate >= dateRange.from) &&
          (!dateRange?.to || itemDate <= dateRange.to)
        );
      })
      .map((item) => ({
        id: String(item.id),
        title: item.itemName,
        description: item.itemDescription,
        location: item.foundLocation,
        date: item.createdDate,
        status: item.itemStatus,
        submitterEmail: item.submitterEmail,
        image: `${import.meta.env.VITE_API_URL}/media/${item.image}`,
        officeInfo: `${item.givenLocation}`,
        category: item.category,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [data, dateRange]);

  async function handleDownload(type: "csv" | "pdf") {
    try {
      const res = await getReport({ period, scope: 'general' });
      if (!res.ok) {
        toast.error(res.message || "Failed to fetch report");
        return;
      }
      const d = res.data;
      const periodText = period ?? 'today';
      const filenameSafe = period ? period.replace(/_/g, "-") : "today";

      if (type === 'csv') {
        const rows = [
          ['totalSubmissions', String(d.totalSubmissions)],
          ['foundItems', String(d.foundItems)],
          ['claimedItems', String(d.claimedItems)],
          ['archivedItems', String(d.archivedItems)],
        ];
        const csv = ["key,value", ...rows.map(([k, v]) => `${k},${v}`)].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${filenameSafe}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Report downloaded as CSV");
      } else {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Report (general)", 14, 18);
        doc.setFontSize(11);
        doc.text(`Period: ${periodText}`, 14, 26);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

        let y = 48;
        doc.setFontSize(12);
        doc.text("Metric", 14, y);
        doc.text("Value", 120, y);
        doc.line(14, y + 2, 196, y + 2);

        y += 12;
        doc.text("Total submissions", 14, y);           doc.text(String(d.totalSubmissions), 120, y);
        y += 10;
        doc.text("Found", 14, y);                        doc.text(String(d.foundItems), 120, y);
        y += 10;
        doc.text("Claimed", 14, y);                      doc.text(String(d.claimedItems), 120, y);
        y += 10;
        doc.text("Archived", 14, y);                     doc.text(String(d.archivedItems), 120, y);

        doc.setFontSize(9);
        doc.text("LostLink • Report (general)", 14, 285);
        doc.save(`report_${filenameSafe}.pdf`);
        toast.success("Report downloaded as PDF");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to download report");
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* ▶️ Stats and Report */}
        <Card className="border-0 shadow-lg rounded-2xl mx-6 md:mx-0">
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-xl">Statistics and Report</CardTitle>
            {/* <Button
              className="flex text-white items-center py-5 rounded-lg"
              onClick={() => setReportModalOpen(true)}
            >
              <FileChartColumn />
              <span className="hidden sm:inline">Generate report</span>
            </Button> */}
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4">
            <div className='flex flex-row justify-between w-full'>
              <div className='flex items-center gap-4'>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-outline rounded-lg"
                    >
                      <CalendarIcon className="w-4 h-4" />
                      {dateRange?.from ? (
                        <span>
                          {format(dateRange.from, 'dd/MM/yyyy')}
                          {dateRange.to ? ` - ${format(dateRange.to, 'dd/MM/yyyy')}` : ''}
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

                {dateRange?.from && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-outline rounded-lg"
                    onClick={() => setDateRange(undefined)}
                  >
                    <X className="w-4 h-4" />
                    Reset filter
                  </Button>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-9 gap-2 text-white">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download Report</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40 border-1 border-gray-300">
                  <DropdownMenuItem onClick={() => handleDownload("csv")} className='bg-green-600 hover:bg-green-600/80 text-white font-semibold rounded-b-none'>
                    CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload("pdf")} className='bg-destructive/80 hover:bg-destructive/60 text-white font-semibold rounded-t-none'>
                    PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stat Cards */}
            <div className="flex flex-col md:flex-row gap-4 h-fit w-full justify-between">
              <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
                <p className="text-2xl text-on-surface">{totalFound}</p>
                <p className="text-on-surface-foreground">Found items</p>
              </Card>
              <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
                <p className="text-2xl text-on-surface">{claimedCount}</p>
                <p className="text-on-surface-foreground">Claimed items</p>
              </Card>
              <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
                <p className="text-2xl text-on-surface">{archivedCount}</p>
                <p className="text-on-surface-foreground">Archived items</p>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* ▶️ Last Submitted Items */}
        <Card className="border-0 border-t-outline border-t-1 md:border-t-0 shadow-none md:shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Last Submitted Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {isLoading ? (
              <p className="text-muted-foreground">Loading submitted items...</p>
            ) : submittedItems.length > 0 ? (
              <>
                {submittedItems.map((item) => (
                  <ItemCard key={item.id} item={item} variant="list" />
                ))}
                <div className="flex justify-end">
                  <Button
                    className="w-full md:w-fit flex text-white items-center py-5 rounded-lg"
                    onClick={() => navigate('/dashboard/items')}
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

      {/* <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} /> */}
    </>
  );
}
