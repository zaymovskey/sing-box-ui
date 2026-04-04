import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { copyText } from "@/shared/lib";
import {
  Badge,
  clientToast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";

interface InboundShareQrDialogProps {
  link: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: string;
}

export function InboundShareQrDialog({
  link,
  open,
  onOpenChange,
  type,
}: InboundShareQrDialogProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyQr = async () => {
    if (!link) {
      clientToast.error("Не удалось сгенерировать ссылку для данного входа", {
        duration: 3000,
      });
      return;
    }

    const copied = await copyText(link);

    if (copied) {
      clientToast.success("Ссылка скопирована в буфер обмена", {
        duration: 3000,
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
      return;
    }

    window.prompt("Скопируй ссылку вручную:", link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card flex max-h-[90vh] w-fit flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b px-6 pt-6 pb-5">
          <DialogTitle className="text-center">QRCode</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 px-10 pt-5 pb-10">
          {type && (
            <Badge
              className="rounded-full p-10 px-2 py-2 text-xs"
              variant="default"
            >
              {type}
            </Badge>
          )}
          <button
            className="group relative cursor-pointer rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-sm active:scale-95"
            type="button"
            onClick={handleCopyQr}
          >
            <QRCodeSVG value={link} />

            <div
              className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/45 transition-all duration-200 ${isCopied ? "scale-100 opacity-100" : "scale-95 opacity-0"} `}
            >
              <span className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white">
                Скопировано
              </span>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
