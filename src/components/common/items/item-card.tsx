import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash, ChevronDown, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import ItemInfoModal from "./item-modal";
import { useDeleteItem, useUpdateItemStatus } from "@/api/items/hook";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    status: "SUBMITTED" | "LISTED" | "CLAIMED" | "ARCHIVED";
    image: string;
    officeInfo: string;
  };
  variant: "list" | "grid";
  isForPublic?: boolean;
}

export default function ItemCard({
  item,
  variant,
  isForPublic = false,
}: ItemCardProps) {
  const isList = variant === "list";
  const [openModal, setOpenModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    status: "LISTED" | "ARCHIVED";
    open: boolean;
  }>({ status: "LISTED", open: false });

  const deleteItem = useDeleteItem();
  const updateStatus = useUpdateItemStatus();

  const handleDelete = async () => {
    try {
      await deleteItem.mutateAsync(Number(item.id));
      toast.success("Item deleted successfully.");
    } catch {
      toast.error("Failed to delete item. Can only delete items with status SUBMITTED.");
    }
  };

  const handleStatusChange = async () => {
    try {
      await updateStatus.mutateAsync({
        id: Number(item.id),
        payload: { status: confirmDialog.status },
      });
      toast.success(`Item marked as ${confirmDialog.status}.`);
    } catch {
      toast.error("Failed to update item status.");
    } finally {
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  const AdminActions = () => (
    <div className="flex flex-row gap-2 items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center border-on-surface-foreground text-primary rounded-lg w-32"
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuItem onClick={() => setConfirmDialog({ status: "LISTED", open: true })}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmDialog({ status: "ARCHIVED", open: true })}>
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
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuItem
            onClick={() => toast.info("Edit functionality coming soon")}
            className="flex gap-2 items-center"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="flex gap-2 text-destructive items-center"
          >
            <Trash className="w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      <div onClick={() => setOpenModal(true)}>
        <Card
          className={`cursor-pointer border-0 transition hover:shadow-md ${
            isList
              ? "flex flex-row justify-between md:items-center gap-2 md:gap-8 p-0 md:p-4"
              : "flex flex-col p-4 h-96"
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className={`rounded-lg object-cover border ${
              !isList
                ? "self-center w-full h-[200px]"
                : "h-auto w-full min-w-30 sm:w-28 sm:h-28"
            }`}
          />
          <div className={`flex flex-col justify-between ${isList ? "w-full p-4 pt-3 sm:pt-0" : "p-2"}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h4 className="font-semibold">{item.title}</h4>
              {!isForPublic && isList && <AdminActions />}
            </div>
            <div className="text-sm mt-2 space-y-1">
              {isList ? (
                <>
                  <p className="line-clamp-1">{item.description}</p>
                  <p className="line-clamp-1">
                    <strong>Location:</strong> {item.location}
                  </p>
                  <p>
                    <strong>Date:</strong> {format(new Date(item.date), "PPP")}
                  </p>
                  <p className="line-clamp-1">
                    <strong>Office Info:</strong> {item.officeInfo}
                  </p>
                </>
              ) : (
                <>
                  <p className="line-clamp-2 mb-2">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Found on <span className="font-semibold underline">{format(new Date(item.date), "PPP")}</span> in <span className="font-semibold underline">{item.location}</span>
                  </p>
                </>
              )}
            </div>
            {isForPublic && (
              <Button
                variant="link"
                size="sm"
                className="mt-3 p-0 text-primary w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(true);
                }}
              >
                See more
              </Button>
            )}
            {!isForPublic && !isList && <div className="mt-3"><AdminActions /></div>}
          </div>
        </Card>
      </div>

      <ItemInfoModal open={openModal} onClose={() => setOpenModal(false)} item={item} />

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to mark this item as <strong>{confirmDialog.status}</strong>?</p>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
