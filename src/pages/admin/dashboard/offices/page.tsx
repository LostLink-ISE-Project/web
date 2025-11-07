import { useCreateOffice, useDeleteOffice, useOffices, useUpdateOffice } from "@/api/office/hook";
import AddOfficeModal from "@/components/common/modals/add-office-modal";
import EditOfficeModal from "@/components/common/modals/edit-office-modal";
import SimpleTable from "@/components/common/table/simple-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";

export default function OfficesPage() {
    const [addOpen, setAddOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<any>(null);

    const { mutate: updateOffice } = useUpdateOffice();

    // const officeData = Array.from({ length: 5 }).map((_, i) => ({
    //     name: `Location ${i + 1}`,
    //     location: "Building A, Room 201",
    //     workHours: "09:00 - 16:00",
    // }));
    const { data: officeData = [], isLoading } = useOffices();
    const { mutate: createOffice } = useCreateOffice();
    const { mutate: deleteOffice } = useDeleteOffice();

    const handleAddOffice = (data: {
        name: string;
        location: string;
        contact: string;
        workHourStart: string;
        workHourEnd: string;
    }) => {
        const fullHours = `${data.workHourStart} - ${data.workHourEnd}`;
        createOffice({
            name: data.name,
            location: data.location,
            contact: data.contact,
            workHours: fullHours,
        });
    };

    const handleEditOffice = (data: {
        id: number;
        name: string;
        location: string;
        contact: string;
        workHourStart: string;
        workHourEnd: string;
    }) => {
        const workHours = `${data.workHourStart} - ${data.workHourEnd}`;
        updateOffice({ id: data.id, payload: { ...data, workHours } });
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
            id: "location",
            header: "Location",
            accessorKey: "location",
        },
        {
            id: "contact",
            header: "Contact",
            accessorKey: "contact",
        },
        {
            id: "workHours",
            header: "Working Hours",
            accessorKey: "workHours",
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
                                setSelectedOffice(row.original);
                                setEditOpen(true);
                            }}
                            className="flex gap-2 items-center"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => deleteOffice(row.original.id)}
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

    return(
        <>
            <Card className="border-0 shadow-xl rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                    <CardTitle className="text-xl">Offices</CardTitle>
                    
                    <Button variant={"ghost"} className="text-primary" onClick={() => setAddOpen(true)}>
                        Add Office
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="p-4 text-center text-muted">Loading offices...</div>
                    ) : (
                        <SimpleTable columns={columns} data={officeData} />
                    )}
                </CardContent>
            </Card>
            
            <AddOfficeModal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onSubmit={handleAddOffice}
            />

            {selectedOffice && (
                <EditOfficeModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    office={selectedOffice}
                    onSubmit={handleEditOffice}
                />
            )}
        </>
    );
}