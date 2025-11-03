import { useState } from "react";
import SimpleTable from "@/components/common/table/simple-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import QrCodeModal from "@/components/common/locations/qr-code-modal";

export default function LocationsPage() {
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    slug: string;
  } | null>(null);

  const locationData = Array.from({ length: 5 }).map((_, i) => ({
    name: `Location ${i + 1}`,
    details: "Building A, Room 101",
    workHours: "09:00 - 16:00",
    slug: `location-${i + 1}`, // for QR simulation
  }));

  const handleGenerateQr = (row: any) => {
    setSelectedLocation({
      name: row.original.name,
      slug: row.original.slug,
    });
    setQrOpen(true);
  };

  const columns = [
    {
      id: "index",
      header: "#",
      cell: ({ row }: { row: any }) => <span>{Number(row.id) + 1}</span>,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ row }: { row: any }) => (
        <span className="font-semibold">{row.original.name}</span>
      ),
    },
    { id: "details", header: "Details", accessorKey: "details" },
    { id: "workHours", header: "Working Hours", accessorKey: "workHours" },
    {
      id: "qrCode",
      header: "QR Code",
      cell: ({ row }: { row: any }) => (
        <Button
          variant="ghost"
          className="text-primary p-0 h-auto min-h-0 self-start"
          onClick={() => handleGenerateQr(row)}
        >
          Generate
        </Button>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: any }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuItem
              onClick={() => console.log("Edit", row.original.name)}
              className="flex gap-2 items-center"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete", row.original.name)}
              className="flex items-center gap-2 text-destructive"
            >
              <Trash className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Card className="border-0 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-xl">Locations</CardTitle>
          <Button variant="ghost" className="text-primary">
            Add More
          </Button>
        </CardHeader>
        <CardContent>
          <SimpleTable columns={columns} data={locationData} />
        </CardContent>
      </Card>

      <QrCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        qrValue={`https://lostlink.com/?ref=${selectedLocation?.slug || ""}`}
        label={selectedLocation?.name}
      />
    </>
  );
}