// src/components/item/ItemCard.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { ItemStatus } from "@/lib/types/item";
import { Pencil, Trash, ChevronDown, MoreVertical } from "lucide-react";

export interface ItemCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: ItemStatus;
  image: string;
  variant: "list" | "grid";
}

export default function ItemCard({
  id,
  title,
  description,
  location,
  date,
  status,
  image,
  variant,
}: ItemCardProps) {
  const isList = variant === "list";

  return (
    <Card
      className={`border-0 p-4 ${
        isList ? "flex flex-row justify-between items-center gap-8" : "flex flex-col"
      }`}
    >
      <img
        src={image}
        alt={title}
        className={`rounded-lg object-cover border ${
          !isList ? "self-center w-full h-[200px]" : "w-28 h-28"
        }`}
      />

      <div className={`flex flex-col justify-between ${isList ? "w-full" : "p-2"}`}>
        <div className="flex flex-row justify-between items-start">
          <h4 className="font-semibold">{title}</h4>
          
          {isList && (
            <div className="flex flex-row gap-2 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-on-surface-foreground text-primary rounded-lg">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            <ChevronDown className="ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-fit">
                        <DropdownMenuItem onClick={() => console.log("Approve", id)}>
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Archive", id)}>
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
                            onClick={() => console.log("Edit", id)}
                            className="flex gap-2 items-center"
                        >
                            <Pencil className="w-4 h-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => console.log("Delete", id)}
                            className="flex gap-2 text-destructive items-center"
                        >
                            <Trash className="w-4 h-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground mt-2">
          <p className="font-semibold text-black line-clamp-2">Description:</p>
          <p>{description}</p>
          <p className="mt-1">
            <span className="font-semibold">Location:</span> {location}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {date}
          </p>
        </div>

        {!isList && (
          <Button
            variant="link"
            size="sm"
            className="mt-3 w-fit self-start p-0 text-primary"
          >
            See more
          </Button>
        )}
      </div>
    </Card>
  );
}
