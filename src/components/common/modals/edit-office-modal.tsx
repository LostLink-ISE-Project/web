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

interface EditOfficeModalProps {
  open: boolean;
  onClose: () => void;
  office: {
    id: number;
    name: string;
    location: string;
    contact: string;
    workHours: string; // "09:00 - 17:00"
  };
  onSubmit: (data: {
    id: number;
    name: string;
    location: string;
    contact: string;
    workHourStart: string;
    workHourEnd: string;
  }) => void;
}

export default function EditOfficeModal({
  open,
  onClose,
  office,
  onSubmit,
}: EditOfficeModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      contact: "",
      workHourStart: "",
      workHourEnd: "",
    },
  });

  useEffect(() => {
    const [start, end] = office.workHours.split(" - ");
    reset({
      name: office.name,
      location: office.location,
      contact: office.contact,
      workHourStart: start,
      workHourEnd: end,
    });
  }, [office, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit({
      id: office.id,
      ...data,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="mb-4">
          <DialogTitle>Edit Office</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 py-2">
          <div>
            <Input placeholder="Office Name" {...register("name", { required: true })} />
            {errors.name && <p className="text-red-500 text-sm mt-1">Office name is required</p>}
          </div>

          <div>
            <Input placeholder="Location" {...register("location", { required: true })} />
            {errors.location && <p className="text-red-500 text-sm mt-1">Location is required</p>}
          </div>

          <div>
            <Input placeholder="Contact Info" {...register("contact", { required: true })} />
            {errors.contact && <p className="text-red-500 text-sm mt-1">Contact is required</p>}
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
            <Button type="submit" className="w-full text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
