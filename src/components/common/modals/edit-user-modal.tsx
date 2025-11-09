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

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    surname: string;
    status: "ACTIVE" | "DISABLED";
  };
  onSubmit: (data: {
    id: number;
    name: string;
    surname: string;
    status: "ACTIVE" | "DISABLED";
  }) => void;
}

export default function EditUserModal({
  open,
  onClose,
  user,
  onSubmit,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      surname: user.surname,
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      surname: user.surname,
    });
  }, [user, reset]);

  const handleFormSubmit = (data: { name: string; surname: string }) => {
    onSubmit({
      id: user.id,
      name: data.name,
      surname: data.surname,
      status: user.status, // unchanged
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="flex-1">
              <Input
                placeholder="Surname"
                {...register("surname", { required: "Surname is required" })}
              />
              {errors.surname && <p className="text-red-500 text-sm mt-1">{errors.surname.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="text-white w-full">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
