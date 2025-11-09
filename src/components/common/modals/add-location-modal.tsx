import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

interface AddLocationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    details: string;
    workHourStart: string;
    workHourEnd: string;
  }) => void;
}

export default function AddLocationModal({ open, onClose, onSubmit }: AddLocationModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      details: "",
      workHourStart: "",
      workHourEnd: "",
    },
    mode: "onTouched",
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset(); // clear form
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Add Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 py-2">
          <div>
            <Input placeholder="Location Name" {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">Location name is required</p>}
          </div>

          <div>
            <Input placeholder="Details (e.g., Building A, Room 101)" {...register("details", { required: true })} />
            {errors.details && <p className="text-red-500 text-sm mt-1">Details are required</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input type="time" {...register("workHourStart", { required: true })} />
              {errors.workHourStart && <p className="text-red-500 text-sm mt-1">Start time required</p>}
            </div>
            <div className="flex-1">
              <Input type="time" {...register("workHourEnd", { required: true })} />
              {errors.workHourEnd && <p className="text-red-500 text-sm mt-1">End time required</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="text-white w-full">
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
