import { Check, Copy, ScanQrCode } from "lucide-react";
import { useState } from "react";

import { type Inbound, useConfigQuery } from "@/features/sing-box/config-core";
import { clientEnv } from "@/shared/lib";
import { Button, clientToast, TableCell, TableRow } from "@/shared/ui";

import { buildInboundShareLink } from "../../lib/build-Inbound-share-link";
import { InboundShareQrDialog } from "../dialogs/InboundShareQrDialog";

export function InboundUserRow({
  inbound,
  user,
}: {
  inbound: Inbound;
  user: unknown;
}) {
  const { data: singBoxConfig } = useConfigQuery();

  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);

  const name =
    typeof user === "object" &&
    user &&
    "name" in user &&
    typeof user.name === "string"
      ? user.name
      : "Без имени";

  const realityPublicKeys = singBoxConfig?._panel?.realityPublicKeys || {};
  const link = buildInboundShareLink(
    inbound,
    user,
    clientEnv.NEXT_PUBLIC_HOST_IP || "UNKNOWN_HOST",
    realityPublicKeys,
  );

  const handleCopy = async () => {
    try {
      if (link) {
        await navigator.clipboard.writeText(link);
        clientToast.success("Ссылка скопирована в буфер обмена", {
          duration: 2000,
        });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } else {
        clientToast.error("Не удалось сгенерировать ссылку для данного входа", {
          duration: 2000,
        });
      }
    } catch {
      clientToast.error("Не удалось сгенерировать ссылку для данного входа", {
        duration: 2000,
      });
    }
  };

  const [isCopied, setIsCopied] = useState(false);

  return (
    <TableRow>
      <TableCell className="bg-muted/30 py-3 pl-15" colSpan={999}>
        <div className="bg-background rounded-md border px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{name}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                className="transition-transform active:scale-95"
                type="button"
                onClick={handleCopy}
              >
                {isCopied ? <Check /> : <Copy />}
                Ссылка
              </Button>
              <Button type="button" onClick={() => setQrCodeDialogOpen(true)}>
                <ScanQrCode />
                QR
              </Button>
            </div>
          </div>
        </div>
      </TableCell>
      {link && (
        <InboundShareQrDialog
          link={link}
          open={qrCodeDialogOpen}
          type={inbound.type}
          onOpenChange={setQrCodeDialogOpen}
        />
      )}
    </TableRow>
  );
}
