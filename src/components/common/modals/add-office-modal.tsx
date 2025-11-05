import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddOfficeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    location: string;
    workHourStart: string;
    workHourEnd: string;
  }) => void;
}

export default function AddOfficeModal({ open, onClose, onSubmit }: AddOfficeModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [workHourStart, setWorkHourStart] = useState("");
  const [workHourEnd, setWorkHourEnd] = useState("");

  const handleSubmit = () => {
    onSubmit({ name, location, workHourStart, workHourEnd });
    setName("");
    setLocation("");
    setWorkHourStart("");
    setWorkHourEnd("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Add Office</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Input placeholder="Office Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <div className="flex gap-4">
            <Input type="time" className="flex items-center" value={workHourStart} onChange={(e) => setWorkHourStart(e.target.value)} />
            <Input type="time" className="flex items-center" value={workHourEnd} onChange={(e) => setWorkHourEnd(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="text-white w-full">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}