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
import QrCodeModal from "@/components/common/modals/qr-code-modal";
import AddLocationModal from "@/components/common/modals/add-location-modal";
import { useCreateLocation, useDeleteLocation, useLocations, useUpdateLocation } from "@/api/locations/hook";
import EditLocationModal from "@/components/common/modals/edit-location-modal";
import { toast } from "sonner";

export default function LocationsPage() {
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    slug: string;
  } | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedEditLocation, setSelectedEditLocation] = useState<{
    id: number;
    name: string;
    description: string;
    slug: string;
  } | null>(null);

  const [addOpen, setAddOpen] = useState(false);

  const handleAddLocation = (data: {
    name: string;
    details: string;
    workHourStart: string;
    workHourEnd: string;
  }) => {
    const workHours = `${data.workHourStart} - ${data.workHourEnd}`;
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");

    createLocation(
      {
        name: data.name,
        description: `${data.details} (${workHours})`,
        slug,
      },
      {
        onSuccess: () => toast.success("Location added successfully"),
        onError: () => toast.error("Failed to add location"),
      }
    );
  };

  const { data: locationData = [], isLoading } = useLocations();
  const { mutate: createLocation } = useCreateLocation();
  const { mutate: deleteLocation } = useDeleteLocation();

  const handleGenerateQr = (row: any) => {
    setSelectedLocation({
      name: row.original.name,
      slug: row.original.slug,
    });
    setQrOpen(true);
  };

  const { mutate: updateLocation } = useUpdateLocation();

  const handleEditLocation = (data: {
    id: number;
    name: string;
    details: string;
    workHourStart: string;
    workHourEnd: string;
  }) => {
    const workHours = `${data.workHourStart} - ${data.workHourEnd}`;
    const slug = data.name.toLowerCase().replace(/\s+/g, "-");

    updateLocation(
      {
        id: data.id,
        payload: {
          name: data.name,
          description: `${data.details} (${workHours})`,
          slug,
        },
      },
      {
        onSuccess: () => toast.success("Location updated successfully"),
        onError: () => toast.error("Failed to update location"),
      }
    );
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
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
    },
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
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuItem
              onClick={() => {
                setSelectedEditLocation(row.original);
                setEditOpen(true);
              }}
              className="flex gap-2 items-center"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                deleteLocation(row.original.id, {
                  onSuccess: () => toast.success("Location deleted successfully"),
                  onError: () => toast.error("Failed to delete location"),
                })
              }
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
          <Button variant="ghost" className="text-primary" onClick={() => setAddOpen(true)}>
            Add More
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-4 text-center text-muted">Loading locations...</div>
          ) : (
            <SimpleTable columns={columns} data={locationData} />
          )}
        </CardContent>
      </Card>

      <QrCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        qrValue={`https://lostlink-form.usg.az/?ref=${selectedLocation?.slug || ""}`}
        label={selectedLocation?.name}
      />

      <AddLocationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddLocation}
      />

      {selectedEditLocation && (
        <EditLocationModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          location={selectedEditLocation}
          onSubmit={handleEditLocation}
        />
      )}
    </>
  );
}