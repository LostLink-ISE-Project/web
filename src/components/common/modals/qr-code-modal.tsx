import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  qrValue: string;
  label?: string;
}

export default function QrCodeModal({ open, onClose, qrValue, label }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${label || "qr-code"}.png`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code {label ? `for ${label}` : ""}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-10 pt-10">
          <QRCodeCanvas value={qrValue} size={200} ref={canvasRef} />
          
          <Button className="flex text-white text-md items-center py-5 rounded-lg" onClick={handleDownload}>
            <Download className="size-5"/>
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}