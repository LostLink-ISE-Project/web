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
import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    surname: string;
    username: string;
    password: string;
    status: "ACTIVE" | "DISABLED";
  }) => void;
}

export default function AddUserModal({ open, onClose, onSubmit }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "DISABLED">("ACTIVE");

  const handleSubmit = () => {
    onSubmit({ name, surname, username, password, status });
    setName("");
    setSurname("");
    setUsername("");
    setPassword("");
    setStatus("ACTIVE");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Add User</DialogTitle>
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
          <div className="flex gap-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as "ACTIVE" | "DISABLED")}>
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
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
