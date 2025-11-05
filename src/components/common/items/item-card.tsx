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
import { format } from "date-fns";

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
            className="flex items-center border-on-surface-foreground text-primary rounded-lg w-32"
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuItem className="w-30" onClick={() => console.log("Approve", item.id)}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem className="w-30" onClick={() => console.log("Archive", item.id)}>
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
              !isList ? "self-center w-full h-[200px]" : "h-auto w-full min-w-30 sm:w-28 sm:h-28 border-1 md:border"
            }`}
          />

          <div
            className={`flex flex-col justify-between ${
              isList ? "w-full p-4 pt-3 sm:pt-0" : "p-2"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h4 className="font-semibold">{item.title}</h4>
              {!isForPublic && isList && <AdminActions />}
            </div>

            <div className="text-sm mt-2 space-y-1">
              {isList ? (
                <>
                  <div>
                    <p className="w-50 md:w-xl break-words line-clamp-1 text-ellipsis">{item.description}</p>
                  </div>
                  <p className={`${ isList ? "w-50 md:w-xl" : ""} break-words line-clamp-1 text-ellipsis`}>
                    <span className="font-bold">Location:</span> {item.location}
                  </p>
                  <p className="w-50 md:w-full">
                    <span className="font-bold">Date:</span> {format(new Date(item.date), "PPP")}
                  </p>

                  {/* Office + See More on same row */}
                  {isForPublic && isList ? (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                      <p className={`break-words line-clamp-1 text-ellipsis`}>
                        <span className="font-bold">Office Info:</span>{" "}
                        {item.officeInfo}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="w-fit p-0 text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal(true);
                        }}
                      >
                        See more
                      </Button>
                    </div>
                  ) : (
                    <p className={`${isList ? "w-40 md:w-xl" : ""} break-words line-clamp-2 text-ellipsis`}>
                      <span className="font-bold">Office Info:</span>{" "}
                      {item.officeInfo}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="min-h-10 line-clamp-2 break-words text-ellipsis mb-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Found on <span className="font-semibold underline">{format(new Date(item.date), "PPP")}</span> in <span className="font-semibold underline">{item.location}</span>
                  </p>
                </>
              )}
            </div>

            {/* Grid View Public Button */}
            {isForPublic && !isList && (
              <Button
                variant="link"
                size="sm"
                className="mt-3 w-fit self-start p-0 text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenModal(true);
                }}
              >
                See more
              </Button>
            )}

            {/* Grid View Admin Actions */}
            {!isForPublic && !isList && (
              <div className="mt-3">
                <AdminActions />
              </div>
            )}
          </div>
        </Card>
      </div>

      <ItemInfoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        item={item}
      />
    </>
  );
}
