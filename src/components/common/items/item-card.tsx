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
import type { Item } from "@/lib/types/item";
import ItemInfoModal from "./item-modal";

export interface ItemCardProps {
  item: Item;
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

  const AdminActions = () => (
    <div className="flex flex-row gap-2 items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-on-surface-foreground text-primary rounded-lg"
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            <ChevronDown className="ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuItem onClick={() => console.log("Approve", item.id)}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Archive", item.id)}>
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
            onClick={() => console.log("Edit", item.id)}
            className="flex gap-2 items-center"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete", item.id)}
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
      <Card
        className={`border-0 p-4 ${
          isList
            ? "flex flex-row justify-between items-center gap-8"
            : "flex flex-col"
        }`}
      >
        <img
          src={item.image}
          alt={item.title}
          className={`rounded-lg object-cover border ${
            !isList ? "self-center w-full h-[200px]" : "w-28 h-28"
          }`}
        />

        <div
          className={`flex flex-col justify-between ${
            isList ? "w-full" : "p-2"
          }`}
        >
          <div className="flex flex-row justify-between items-start">
            <h4 className="font-semibold">{item.title}</h4>

            {/* Admin Controls: Only for list layout */}
            {!isForPublic && isList && <AdminActions />}
          </div>

         <div className="text-sm text-muted-foreground mt-2 space-y-1">
          <div>
            <p className="font-bold text-black line-clamp-2">Description:</p>
            <p>{item.description}</p>
          </div>
          <p className="mt-1">
            <span className="font-bold">Location:</span> {item.location}
          </p>
          <p>
            <span className="font-bold">Date:</span> {item.date}
          </p>

          {/* 👇 Office Info + See more on the same row (only for list & public) */}
          {isForPublic && isList ? (
            <div className="flex items-center justify-between">
              <p>
                <span className="font-bold">Office Info:</span> {item.officeInfo}
              </p>
              <Button
                variant="link"
                size="sm"
                className="w-fit p-0 text-primary"
                onClick={() => setOpenModal(true)}
              >
                See more
              </Button>
            </div>
          ) : (
            <p>
              <span className="font-bold">Office Info:</span> {item.officeInfo}
            </p>
          )}
        </div>

          {/* Public "See More" Button */}
          {isForPublic && !isList && (
            <Button
              variant="link"
              size="sm"
              className="mt-3 w-fit self-start p-0 text-primary"
              onClick={() => setOpenModal(true)}
            >
              See more
            </Button>
          )}

          {/* Admin Controls: Grid layout - actions at bottom */}
          {!isForPublic && !isList && (
            <div className="mt-3">
              <AdminActions />
            </div>
          )}
        </div>
      </Card>

      {/* Public View Modal */}
      {isForPublic && (
        <ItemInfoModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          item={item}
        />
      )}
    </>
  );
}
