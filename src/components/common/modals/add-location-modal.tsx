import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [workHourStart, setWorkHourStart] = useState("");
  const [workHourEnd, setWorkHourEnd] = useState("");

  const handleSubmit = () => {
    onSubmit({ name, details, workHourStart, workHourEnd });
    setName("");
    setDetails("");
    setWorkHourStart("");
    setWorkHourEnd("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Add Location</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Input placeholder="Location Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Details (e.g., Building A, Room 101)" value={details} onChange={(e) => setDetails(e.target.value)} />
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