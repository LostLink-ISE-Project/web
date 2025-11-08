import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
  const [name, setName] = useState(location.name);
  const [details, setDetails] = useState("");
  const [workHourStart, setWorkHourStart] = useState("");
  const [workHourEnd, setWorkHourEnd] = useState("");

  useEffect(() => {
    setName(location.name);

    // Extract description and work hours from description string
    const match = location.description.match(/^(.*) \((.*) - (.*)\)$/);
    if (match) {
      setDetails(match[1]);
      setWorkHourStart(match[2]);
      setWorkHourEnd(match[3]);
    } else {
      setDetails(location.description);
      setWorkHourStart("");
      setWorkHourEnd("");
    }
  }, [location]);

  const handleSubmit = () => {
    onSubmit({
      id: location.id,
      name,
      details,
      workHourStart,
      workHourEnd,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <Input
            placeholder="Location Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
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
