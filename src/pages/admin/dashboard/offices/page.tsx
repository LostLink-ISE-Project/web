import SimpleTable from "@/components/common/table/simple-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash } from "lucide-react";

export default function OfficesPage() {
    const officeData = Array.from({ length: 5 }).map((_, i) => ({
        name: `Location ${i + 1}`,
        location: "Building A, Room 201",
        workHours: "09:00 - 16:00",
    }));

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
            id: "workHours",
            header: "Working Hours",
            accessorKey: "workHours",
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }: { row: any }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-fit">
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

    return(
        <Card className="border-0 shadow-xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <CardTitle className="text-xl">Offices</CardTitle>
                
                <Button variant={"ghost"} className="text-primary">
                    Add Office
                </Button>
            </CardHeader>
            <CardContent>
                <SimpleTable columns={columns} data={officeData} />
            </CardContent>
        </Card>
    );
}