import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import OptimizedImage from '@/components/ui/optimized-image';

export default function ItemInfoModal({ open, onClose, item, isForPublic }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-6 rounded-2xl bg-white overflow-y-auto">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Item Information</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <OptimizedImage
          src={item.image}
          alt="Item"
          className="rounded-lg mb-4 w-full h-[400px] object-scale-down shadow-md"
          thumbnailSize={400}
          priority={true}
        />

        <div className="text-sm space-y-4 break-words whitespace-pre-wrap overflow-hidden w-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <Badge
              variant="default"
              className="rounded-full border-primary text-primary font-semibold w-fit"
            >
              {item.category ?? 'Uncategorized'}
            </Badge>
          </div>

          <p>{item.description}</p>
          <p>
            <strong>Found at:</strong> {item.location}
          </p>
          {!isForPublic && (
            <p>
              <strong>Found by:</strong> {item.submitterEmail}
            </p>
          )}
          <p>
            <strong>Listing Date:</strong> {format(new Date(item.date), 'PPP')}
          </p>
          <p>
            <strong>Office info:</strong> {item.officeInfo}{' '}
            {item.locationAndHours && `(${item.locationAndHours})`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
