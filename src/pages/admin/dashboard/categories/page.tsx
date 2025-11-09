import SimpleTable from "@/components/common/table/simple-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";

export default function CategoriesPage() {

    const categoryData = Array.from({ length: 5 }).map((_, i) => ({
        name: `Category ${i + 1}`,
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
                                console.log("edit")
                            }}
                            className="flex gap-2 items-center"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {console.log("delete")}}
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
                    <CardTitle className="text-xl">Categories</CardTitle>
                    
                    <Button variant={"ghost"} className="text-primary">
                        Add Category
                    </Button>
                </CardHeader>
                <CardContent>
                    <SimpleTable columns={columns} data={categoryData} />
                </CardContent>
            </Card>
        </>
    );
}