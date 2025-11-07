import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface EditOfficeModalProps {
  open: boolean;
  onClose: () => void;
  office: {
    id: number;
    name: string;
    location: string;
    contact: string;
    workHours: string; // format: "09:00 - 17:00"
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
  const [name, setName] = useState(office.name);
  const [location, setLocation] = useState(office.location);
  const [contact, setContact] = useState(office.contact);
  const [workHourStart, setWorkHourStart] = useState("");
  const [workHourEnd, setWorkHourEnd] = useState("");

  useEffect(() => {
    setName(office.name);
    setLocation(office.location);
    setContact(office.contact);
    const [start, end] = office.workHours.split(" - ");
    setWorkHourStart(start);
    setWorkHourEnd(end);
  }, [office]);

  const handleSubmit = () => {
    onSubmit({
      id: office.id,
      name,
      location,
      contact,
      workHourStart,
      workHourEnd,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Edit Office</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <Input
            placeholder="Office Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Contact Info"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <div className="flex gap-4">
            <Input
              type="time"
              value={workHourStart}
              onChange={(e) => setWorkHourStart(e.target.value)}
            />
            <Input
              type="time"
              value={workHourEnd}
              onChange={(e) => setWorkHourEnd(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="text-white w-full">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}