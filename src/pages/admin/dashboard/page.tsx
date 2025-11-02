import { useState } from "react";
import { CalendarIcon, ChevronDown, FileChartColumn, MoreVertical, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { mockItems, type ItemStatus } from "@/lib/types/item";

// 🔹 Fake stat counts
const mockStats = {
  found: 32,
  claimed: 8,
  archived: 23,
};

export default function DashboardPage() {
  const [tab, setTab] = useState<ItemStatus>("submitted");
  const [dateRange, setDateRange] = useState({
    start: "2025-09-17",
    end: "2025-09-17",
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4" />
            <span>Set range</span>
          </div>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
          />
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
          />

          {/* Stat Cards */}
          <div className="flex flex-row gap-4 h-fit w-full justify-between">
            <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
              <p className="text-2xl text-on-surface">{mockStats.found}</p>
              <p className="text-on-surface-foreground">Found items</p>
            </Card>
            <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
              <p className="text-2xl text-on-surface">{mockStats.claimed}</p>
              <p className="text-on-surface-foreground">Claimed items</p>
            </Card>
            <Card className="flex flex-col gap-2 p-4 font-semibold w-full border-outline shadow-none">
              <p className="text-2xl text-on-surface">{mockStats.archived}</p>
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
              <TabsTrigger value="submitted" className="">Submitted</TabsTrigger>
              <TabsTrigger value="approved" >Approved</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            {["submitted", "approved", "archived"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="space-y-5">
                  {mockItems
                    .filter((item) => item.status === status)
                    .map((item) => (
                      <Card
                        key={item.id}
                        className="flex flex-row justify-between items-center p-4 gap-8 border-0"
                      >
                        <img
                          src={item.image}
                          alt="Item"
                          className="w-28 h-28 rounded-lg object-cover border-1"
                        />
                        <div className="flex flex-col justify-center w-full">
                          <div className="flex flex-row justify-between gap-2">
                            <h4 className="font-semibold">{item.title}</h4>
                            
                            <div className="flex flex-row items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="border-on-surface-foreground text-primary rounded-lg"
                                  >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                    <ChevronDown className="ml-1 h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center">
                                  <DropdownMenuItem onClick={() => console.log("Approve", item.id)} className="hover:bg-green-600/50 w-27">
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => console.log("Archive", item.id)} className="hover:bg-primary/50 w-27">
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="center" className="border-0">
                                  <DropdownMenuItem onClick={() => console.log("Delete", item.id)} className="w-fit hover:bg-destructive hover:text-white">
                                    <Trash />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-semibold">Description:</p>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            <p className="text-sm mt-1">
                              <span className="font-semibold">Location:</span> {item.location}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Date:</span> {item.date}
                            </p>
                          </div>
                        </div>
                      </Card>
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
