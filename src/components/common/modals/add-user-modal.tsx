import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; status: "active" | "disabled" }) => void;
}

export default function AddUserModal({ open, onClose, onSubmit }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"active" | "disabled">("active");

  const handleSubmit = () => {
    onSubmit({ name, status });
    setName("");
    setStatus("active");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 py-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={status} onValueChange={(v) => setStatus(v as "active" | "disabled")}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Active
              </SelectItem>
              <SelectItem value="disabled">
                <ShieldOff className="w-4 h-4 text-orange-500" />
                Disabled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="text-white w-full">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
