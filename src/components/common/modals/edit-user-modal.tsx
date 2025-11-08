import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

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
  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname || "");
  const [status, setStatus] = useState<"ACTIVE" | "DISABLED">(user.status);

  useEffect(() => {
    setName(user.name);
    setSurname(user.surname || "");
    setStatus(user.status);
  }, [user]);

  const handleSubmit = () => {
    onSubmit({ id: user.id, name, surname, status });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex gap-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as "ACTIVE" | "DISABLED")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Active
              </SelectItem>
              <SelectItem value="DISABLED">
                <ShieldOff className="w-4 h-4 text-orange-500" />
                Disabled
              </SelectItem>
            </SelectContent>
          </Select>
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
