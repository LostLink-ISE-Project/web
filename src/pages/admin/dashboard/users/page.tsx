import SimpleTable from "@/components/common/table/simple-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ShieldCheck, ShieldOff, Trash } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
    const userData = Array.from({ length: 5 }).map((_, i) => ({
        name: `User ${i + 1}`,
        status: i % 2 === 0 ? "active" : "disabled", // alternating statuses
    }));

    const [confirmAction, setConfirmAction] = useState<{
        type: "delete" | "toggle";
        user: string;
        currentStatus?: string;
    } | null>(null);

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
            id: "status",
            header: "Status",
            accessorKey: "status",
            cell: ({ row }: { row: any }) => {
            const status = row.original.status;
            return (
                <Badge
                    variant={status === "active" ? "default" : "secondary"}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
            );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }: { row: any }) => {
                const { name, status } = row.original;
                const isActive = status === "active";
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-fit">
                            <DropdownMenuItem
                                onClick={() =>
                                    setConfirmAction({ type: "delete", user: name })
                                }
                                className="flex items-center gap-2 text-destructive"
                            >
                                <Trash className="w-4 h-4" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    setConfirmAction({ type: "toggle", user: name, currentStatus: status })
                                }
                                className="flex items-center gap-2"
                            >
                                {isActive ? (
                                    <>
                                        <ShieldOff className="w-4 h-4 text-orange-500" />
                                        Disable
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        Activate
                                    </>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        ];

    return(
        <>
            <Card className="border-0 shadow-xl rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                    <CardTitle className="text-xl">Users</CardTitle>
                    
                    <Button variant={"ghost"} className="text-primary">
                        Add More
                    </Button>
                </CardHeader>
                <CardContent>
                    <SimpleTable columns={columns} data={userData} />
                </CardContent>
            </Card>

            {confirmAction && (
                <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {confirmAction.type === "delete"
                                    ? "Confirm Delete"
                                    : confirmAction.currentStatus === "active"
                                    ? "Disable User"
                                    : "Activate User"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 text-sm">
                            Are you sure you want to{" "}
                            <strong>
                                {confirmAction.type === "delete"
                                    ? "delete"
                                    : confirmAction.currentStatus === "active"
                                    ? "disable"
                                    : "activate"}
                            </strong>{" "}
                            <span className="font-semibold">{confirmAction.user}</span>?
                        </div>
                        <DialogFooter className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setConfirmAction(null)}>
                                Cancel
                            </Button>
                            <Button
                                variant={confirmAction.type === "delete" ? "destructive" : "default"}
                                onClick={() => {
                                    if (confirmAction.type === "delete") {
                                    console.log("Delete confirmed", confirmAction.user);
                                    } else {
                                    console.log(
                                        confirmAction.currentStatus === "active"
                                        ? "Disable confirmed"
                                        : "Activate confirmed",
                                        confirmAction.user
                                    );
                                    }
                                    setConfirmAction(null);
                                }}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}