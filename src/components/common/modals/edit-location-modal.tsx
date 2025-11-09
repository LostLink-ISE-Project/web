import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditLocationModalProps {
  open: boolean;
  onClose: () => void;
  location: {
    id: number;
    name: string;
    description: string;
  };
  onSubmit: (data: {
    id: number;
    name: string;
    details: string;
    workHourStart: string;
    workHourEnd: string;
  }) => void;
}

export default function EditLocationModal({
  open,
  onClose,
  location,
  onSubmit,
}: EditLocationModalProps) {
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
  });

  useEffect(() => {
    const match = location.description.match(/^(.*) \((.*) - (.*)\)$/);
    reset({
      name: location.name,
      details: match ? match[1] : location.description,
      workHourStart: match ? match[2] : "",
      workHourEnd: match ? match[3] : "",
    });
  }, [location, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit({ id: location.id, ...data });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 py-2">
          <div>
            <Input placeholder="Location Name" {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">Location name is required</p>}
          </div>

          <div>
            <Input placeholder="Details" {...register("details", { required: true })} />
            {errors.details && <p className="text-red-500 text-sm mt-1">Details are required</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Input type="time" {...register("workHourStart", { required: true })} />
              {errors.workHourStart && (
                <p className="text-red-500 text-sm mt-1">Start time required</p>
              )}
            </div>
            <div className="flex-1">
              <Input type="time" {...register("workHourEnd", { required: true })} />
              {errors.workHourEnd && (
                <p className="text-red-500 text-sm mt-1">End time required</p>
              )}
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
