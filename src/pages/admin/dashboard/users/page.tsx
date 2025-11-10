import SimpleTable from "@/components/common/table/simple-table";
import AddUserModal from "@/components/common/modals/add-user-modal";
import EditUserModal from "@/components/common/modals/edit-user-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, ShieldOff } from "lucide-react";
import { useState } from "react";
import { useCreateUser, useDisableUser, useUpdateUser, useUsers } from "@/api/users/hook";
import { toast } from "sonner";
export default function UsersPage() {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        id: number;
        name: string;
        surname: string;
        status: "ACTIVE" | "DISABLED";
    } | null>(null);
    
    const [confirmAction, setConfirmAction] = useState<{
        type: "disable";
        id: number;
        user: string;
        currentStatus: "ACTIVE" | "DISABLED";
    } | null>(null);
    
    const { data: userData = [], isLoading } = useUsers();
    const { mutate: createUser } = useCreateUser();
    const { mutate: updateUser } = useUpdateUser();
    const { mutate: disableUSer } = useDisableUser();

    const handleAddUser = (newUser: {
        name: string;
        surname: string;
        username: string;
        password: string;
    }) => {
        createUser(
            {
                name: newUser.name,
                surname: newUser.surname,
                username: newUser.username,
                password: newUser.password,
            },
            {
                onSuccess: () => toast.success("User added successfully"),
                onError: () => toast.error("Failed to add user"),
            }
        );
    };

    const handleEditUser = (data: {
        id: number;
        name: string;
        surname: string;
    }) => {
        updateUser(
            {
                id: data.id,
                payload: {
                    name: data.name,
                    surname: data.surname,
                },
            },
            {
                onSuccess: () => toast.success("User updated successfully"),
                onError: () => toast.error("Failed to update user"),
            }
        );
    };

    const handleDisableUser = (id: number) => {
        disableUSer(id, {
            onSuccess: () => toast.success("User disabled successfully"),
            onError: () => toast.error("Failed to disable user"),
        });
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
                                        status: row.original.status,
                                    });
                                    setEditOpen(true);
                                }}
                                className="flex gap-2 items-center"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </DropdownMenuItem>
                            {isActive && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        setConfirmAction({ type: "disable", id: row.original.id, user: name, currentStatus: status })
                                    }
                                    className="flex items-center gap-2 text-orange-500"
                                >
                                    <ShieldOff className="w-4 h-4" />
                                    Disable
                                </DropdownMenuItem>
                            )}
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
                    {isLoading ? (
                        <div className="p-4 text-center text-muted">Loading users...</div>
                    ) : userData.length === 0 ? (
                        <div className="p-4 text-center text-muted">No users found.</div>
                    ): (
                        <SimpleTable columns={columns} data={userData} />
                    )}
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
                <Dialog open onOpenChange={() => setConfirmAction(null)}>
                    <DialogContent className="rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Disable User</DialogTitle>
                        </DialogHeader>

                        <div className="py-4 text-sm">
                            Are you sure you want to <strong>disable</strong>{" "}
                            <span className="font-semibold">{confirmAction.user}</span>?
                        </div>

                        <DialogFooter className="flex gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setConfirmAction(null)}>
                                Cancel
                            </Button>
                            
                            <Button
                                variant="destructive"
                                onClick={() => {
                                handleDisableUser(confirmAction.id);
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