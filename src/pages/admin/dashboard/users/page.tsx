import SimpleTable from "@/components/common/table/simple-table";
import AddUserModal from "@/components/common/modals/add-user-modal";
import EditUserModal from "@/components/common/modals/edit-user-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, ShieldCheck, ShieldOff, Trash } from "lucide-react";
import { useState } from "react";

export default function UsersPage() {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{ name: string; status: "active" | "disabled" } | null>(null);

    const userData = Array.from({ length: 5 }).map((_, i) => ({
        name: `User ${i + 1}`,
        status: i % 2 === 0 ? "active" : "disabled", // alternating statuses
    }));

    const handleAddUser = (newUser: { name: string; status: "active" | "disabled" }) => {
        console.log("New User:", newUser);
    };

    const handleEditUser = (updatedUser: { name: string; status: "active" | "disabled" }) => {
        console.log("Updated User:", updatedUser);
    };

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
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-fit">
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedUser({ name, status });
                                    setEditOpen(true);
                                }}
                                className="flex gap-2 items-center"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </DropdownMenuItem>
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
                    
                    <Button variant={"ghost"} className="text-primary" onClick={() => setAddOpen(true)}>
                        Add More
                    </Button>
                </CardHeader>
                <CardContent>
                    <SimpleTable columns={columns} data={userData} />
                </CardContent>
            </Card>

            <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddUser} />
            {selectedUser && (
                <EditUserModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    user={selectedUser}
                    onSubmit={handleEditUser}
                />
            )}

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