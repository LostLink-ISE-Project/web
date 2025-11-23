import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface ClaimItemModalProps {
  open: boolean;
  itemTitle: string;
  currentDescription: string;
  onConfirm: (newDescription: string) => void;
  onCancel: () => void;
}

export default function ClaimItemModal({
  open,
  itemTitle,
  currentDescription,
  onConfirm,
  onCancel,
}: ClaimItemModalProps) {
  const [claimDescription, setClaimDescription] = useState('');
  const [claimDate, setClaimDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0]; // YYYY-MM-DD format
  });
  const [claimTime, setClaimTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM format
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatClaimDateTime = () => {
    const dateTime = new Date(`${claimDate}T${claimTime}`);
    return format(dateTime, "MMMM do, yyyy 'at' h:mm a");
  };

  const handleConfirm = async () => {
    if (!claimDescription.trim()) return;

    setIsSubmitting(true);
    try {
      // Send the complete formatted description instead of just claim details
      await onConfirm(newDescription);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setClaimDescription('');
    // Reset to current date/time
    const now = new Date();
    setClaimDate(now.toISOString().split('T')[0]);
    setClaimTime(now.toTimeString().slice(0, 5));
    onCancel();
  };

  const newDescription = `${currentDescription}

---

Claimed by: ${claimDescription}
Claimed at: ${formatClaimDateTime()}`;

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="rounded-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle>Claim Item: {itemTitle}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="text-sm text-gray-600">
            Please provide details about who claimed this item and any additional information.
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">Claim Details</Label>
            <Textarea
              placeholder="Enter details about who claimed the item (e.g., 'John Doe - Student ID: 12345')"
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claim-date" className="block text-sm font-medium mb-2">
                Claim Date
              </Label>
              <Input
                id="claim-date"
                type="date"
                value={claimDate}
                onChange={(e) => setClaimDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="claim-time" className="block text-sm font-medium mb-2">
                Claim Time
              </Label>
              <Input
                id="claim-time"
                type="time"
                value={claimTime}
                onChange={(e) => setClaimTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-sm font-medium mb-2">Preview of updated description:</div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap">{newDescription}</div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="text-white"
            onClick={handleConfirm}
            disabled={!claimDescription.trim() || isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Confirm Claim'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
