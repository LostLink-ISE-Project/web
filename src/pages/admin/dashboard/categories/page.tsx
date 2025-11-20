import { useState } from "react";
import SimpleTable from "@/components/common/table/simple-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Pencil, Trash, MoreVertical } from "lucide-react";

import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/api/categories/hook";

import AddCategoryModal from "@/components/common/modals/add-category-modal";
import EditCategoryModal from "@/components/common/modals/edit-category-modal";
import ConfirmActionModal from "@/components/common/modals/confirm-modal";

export default function CategoriesPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null); // ✅ NEW

  const { data: categoryData = [], isLoading } = useCategories();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleAdd = (data: { name: string }) => {
    createCategory(data, {
      onSuccess: () => {
        toast.success("Category created");
        setAddOpen(false);
      },
      onError: () => toast.error("Failed to create category"),
    });
  };

  const handleUpdate = (data: { id: number; name: string }) => {
    updateCategory(data, {
      onSuccess: () => {
        toast.success("Category updated");
        setEditOpen(false);
      },
      onError: () => toast.error("Failed to update category"),
    });
  };

  const handleDelete = (id: number) => {
    deleteCategory(id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: () => toast.error("Failed to delete category"),
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
                setSelectedCategory(row.original);
                setEditOpen(true);
              }}
              className="flex gap-2 items-center"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setConfirmDelete({ id: row.original.id, name: row.original.name })}
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

  return (
    <>
      <Card className="border-0 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-xl">Categories</CardTitle>
          <Button variant={"ghost"} className="text-primary" onClick={() => setAddOpen(true)}>
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center text-muted">Loading...</div>
          ) : (
            <SimpleTable columns={columns} data={categoryData} />
          )}
        </CardContent>
      </Card>

      <AddCategoryModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} />

      {selectedCategory && (
        <EditCategoryModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          category={selectedCategory}
          onSubmit={handleUpdate}
        />
      )}

      {confirmDelete && (
        <ConfirmActionModal
          open={!!confirmDelete}
          title="Delete Category"
          description={`Are you sure you want to delete "${confirmDelete.name}"?`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => {
            handleDelete(confirmDelete.id);
            setConfirmDelete(null);
          }}
        />
      )}
    </>
  );
}
