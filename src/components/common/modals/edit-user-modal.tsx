import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { ShieldCheck, ShieldOff } from "lucide-react";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: { name: string; status: "active" | "disabled" };
  onSubmit: (data: { name: string; status: "active" | "disabled" }) => void;
}

export default function EditUserModal({ open, onClose, user, onSubmit }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [status, setStatus] = useState<"active" | "disabled">(user.status);

  useEffect(() => {
    setName(user.name);
    setStatus(user.status);
  }, [user]);

  const handleSubmit = () => {
    onSubmit({ name, status });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Edit User</DialogTitle>
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
          <Button onClick={handleSubmit} className="text-white w-full">Edit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
