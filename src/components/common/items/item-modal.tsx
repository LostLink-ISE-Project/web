import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function ItemInfoModal({ open, onClose, item }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-6 rounded-2xl bg-white overflow-y-auto">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>Item Information</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <img
          src={item.image}
          alt="Item"
          className="rounded-lg mb-4 w-full h-64 object-cover"
        />

        <div className="text-sm space-y-4 break-words whitespace-pre-wrap overflow-hidden w-full">
          <h3 className="text-lg font-semibold">{item.title}</h3>

          <p>
            <strong>Description:</strong>
            <br />
            {item.description}
          </p>
          <p>
            <strong>Found in:</strong> {item.location}
          </p>
          <p>
            <strong>Listing Date:</strong> {item.date}
          </p>
          <p>
            <strong>Office info: </strong>
            {item.officeInfo}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
