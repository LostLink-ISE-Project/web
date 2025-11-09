import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface EditCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: {
    id: number;
    name: string;
  };
  onSubmit: (data: { id: number; name: string }) => void;
}

export default function EditCategoryModal({
  open,
  onClose,
  category,
  onSubmit,
}: EditCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { name: "" } });

  useEffect(() => {
    if (category) {
      reset({ name: category.name });
    }
  }, [category, reset]);

  const handleFormSubmit = (data: { name: string }) => {
    onSubmit({ id: category.id, name: data.name });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 py-2">
          <div>
            <Input placeholder="Category Name" {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">Category name is required</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
