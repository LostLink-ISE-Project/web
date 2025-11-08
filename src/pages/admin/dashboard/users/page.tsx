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
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "@/api/users/hook";

export default function UsersPage() {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        name: string;
        surname: string;
        status: "active" | "disabled";
    } | null>(null);

    const { data: userData = [], isLoading } = useUsers();
    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: deleteUser } = useDeleteUser();

    const handleAddUser = (newUser: {
        name: string;
        surname: string;
        username: string;
        password: string;
        status: "ACTIVE" | "DISABLED";
    }) => {
        createUser({
            name: newUser.name,
            surname: newUser.surname,
            username: newUser.username,
            password: newUser.password,
        });
    };

    const handleEditUser = (data: {
        id: number;
        name: string;
        surname: string;
        status: "ACTIVE" | "DISABLED";
    }) => {
    updateUser({
        id: data.id,
        payload: {
        name: data.name,
        surname: data.surname,
        },
    });
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
                const status = row.original.status; // convert API to UI type
                return (
                    <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
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
                const isActive = status === "ACTIVE";
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
                                    setSelectedUser({
                                        id: row.original.id,
                                        name: row.original.name,
                                        surname: row.original.surname,
                                        status: row.original.status, // if needed: normalize to "active" | "disabled"
                                    });
                                    setEditOpen(true);
                                }}
                                className="flex gap-2 items-center"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (confirmAction?.type === "delete") {
                                        const user = userData.find((u) => u.name === confirmAction.user);
                                        if (user) deleteUser(user.id);
                                    }
                                    setConfirmAction(null);
                                }}
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
            {/* {selectedUser && (
                <EditUserModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    user={selectedUser}
                    onSubmit={handleEditUser}
                />
            )} */}

            {confirmAction && (
                <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {confirmAction.type === "delete"
                                    ? "Confirm Delete"
                                    : confirmAction.currentStatus === "ACTIVE"
                                    ? "Disable User"
                                    : "Activate User"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="py-4 text-sm">
                            Are you sure you want to{" "}
                            <strong>
                                {confirmAction.type === "delete"
                                    ? "delete"
                                    : confirmAction.currentStatus === "ACTIVE"
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
                                        confirmAction.currentStatus === "ACTIVE"
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