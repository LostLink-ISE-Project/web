import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Trash, ChevronDown, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import ItemInfoModal from './item-modal';
import { useDeleteItem, useUpdateItemStatus } from '@/api/items/hook';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ConfirmActionModal from '../modals/confirm-modal';
import { Badge } from '@/components/ui/badge';

export interface ItemCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    location: string;
    date: string;
    status: 'SUBMITTED' | 'LISTED' | 'CLAIMED' | 'ARCHIVED';
    image: string;
    officeInfo: string;
    category: string;
  };
  variant: 'list' | 'grid';
  isForPublic?: boolean;
  selecting?: boolean;
}

export default function ItemCard({
  item,
  variant,
  isForPublic = false,
  selecting = false,
}: ItemCardProps) {
  const isList = variant === 'list';
  const [openModal, setOpenModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    status: ItemCardProps['item']['status'];
    open: boolean;
  }>({ status: item.status, open: false });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteItem = useDeleteItem();
  const updateStatus = useUpdateItemStatus();

  const handleDelete = async () => {
    try {
      await deleteItem.mutateAsync(Number(item.id));
      toast.success('Item deleted successfully.');
    } catch {
      toast.error('Failed to delete item. Can only delete items with status SUBMITTED.');
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
      toast.error('Failed to update item status.');
    } finally {
      setConfirmDialog({ ...confirmDialog, open: false });
    }
  };

  // status list removed; transitions are enforced explicitly per current status

  const AdminActions = () => {
    const canDelete = item.status === 'SUBMITTED';
    const allowedStatuses: ItemCardProps['item']['status'][] =
      item.status === 'SUBMITTED'
        ? ['LISTED']
        : item.status === 'LISTED'
          ? ['CLAIMED', 'ARCHIVED']
          : [];

    if (allowedStatuses.length === 0 && !canDelete) return null;

    return (
      <div className="flex flex-row gap-2 items-center justify-between">
        {allowedStatuses.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center border-on-surface-foreground text-primary rounded-lg w-32"
              >
                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1).toLowerCase()}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              {allowedStatuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDialog({ status, open: true });
                  }}
                >
                  {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {canDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuItem
                onClick={(e) => {
                  if (item.status !== 'SUBMITTED') {
                    toast.warning('Only SUBMITTED items can be deleted.');
                    return;
                  }
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="flex gap-2 text-destructive items-center"
              >
                <Trash className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  return (
    <>
      <Card
        onClick={() => {
          if (selecting) return;
          setOpenModal(true);
        }}
        className={`cursor-pointer border-0 transition hover:shadow-md ${
          isList
            ? 'flex flex-row justify-between md:items-center gap-2 md:gap-8 p-0 md:p-4'
            : 'flex flex-col p-4 h-[540px]'
        }`}
      >
        <div
          className={`rounded-lg overflow-hidden shadow-md ${
            !isList
              ? 'w-full h-[350px]' // grid: fixed height
              : 'min-w-50 sm:w-28 sm:h-40' // list: keep as is
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-scale-down"
            loading="lazy"
          />
        </div>
        <div
          className={`flex flex-col justify-between ${isList ? 'w-full p-4 pt-3 sm:pt-0' : 'p-2'}`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div
              className={`flex items-center ${
                isList ? 'gap-x-2' : 'justify-between w-full'
              } flex-wrap`}
            >
              <h4 className="font-semibold">{item.title}</h4>
              <Badge
                variant="outline"
                className="rounded-full text-xs border-primary text-primary px-2 py-0.5 whitespace-nowrap"
              >
                {item.category || 'Uncategorized'}
              </Badge>
            </div>
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
                  <strong>Date:</strong> {format(new Date(item.date), 'PPP')}
                </p>
                <p className="line-clamp-1">
                  <strong>Office Info:</strong> {item.officeInfo}
                </p>
              </>
            ) : (
              <>
                <p className="line-clamp-2 mb-2">{item.description}</p>
                <p className="text-xs text-muted-foreground">
                  Found on{' '}
                  <span className="font-semibold underline">
                    {format(new Date(item.date), 'PPP')}
                  </span>{' '}
                  at <span className="font-semibold underline">{item.location}</span>
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

          {!isForPublic && !isList && (
            <div className="mt-3">
              <AdminActions />
            </div>
          )}
        </div>
      </Card>

      <ItemInfoModal isForPublic={isForPublic} open={openModal} onClose={() => setOpenModal(false)} item={item} />

      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to mark this item as <strong>{confirmDialog.status}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusChange} className="text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmActionModal
        open={confirmDelete}
        title="Delete Item"
        description={`Are you sure you want to delete "${item.title}"?`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          handleDelete();
          setConfirmDelete(false);
        }}
      />
    </>
  );
}
