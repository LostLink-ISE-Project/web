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

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
}

export default function AddCategoryModal({
  open,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { name: "" } });

  const handleFormSubmit = (data: { name: string }) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 py-2">
          <div>
            <Input placeholder="Category Name" {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">Category name is required</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full text-white">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
