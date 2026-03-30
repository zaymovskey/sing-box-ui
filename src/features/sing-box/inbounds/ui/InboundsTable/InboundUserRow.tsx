import { Check, Copy, ScanQrCode } from "lucide-react";
import { useState } from "react";

import { useSecurityAssetsListQuery } from "@/features/security-assets";
import {
  type DraftInbound,
  type DraftInboundUser,
} from "@/shared/api/contracts";
import { clientEnv, copyText } from "@/shared/lib";
import { Button, clientToast } from "@/shared/ui";

import { buildInboundShareLink } from "../../lib/build-Inbound-share-link";
import { getInboundUserName } from "../../lib/get-inbound-user-name.hepler";
import { InboundShareQrDialog } from "../dialogs/InboundShareQrDialog";

export function InboundUserRow({
  inbound,
  user,
}: {
  inbound: DraftInbound;
  user: DraftInboundUser;
}) {
  const { data: securityAssets } = useSecurityAssetsListQuery();
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const name = getInboundUserName(inbound.type, user);

  const link = buildInboundShareLink(
    inbound,
    user,
    securityAssets ?? [],
    clientEnv.NEXT_PUBLIC_HOST_IP || "UNKNOWN_HOST",
  );

  const handleCopy = async () => {
    if (!link) {
      clientToast.error("Не удалось сгенерировать ссылку для данного входа", {
        duration: 2000,
      });
      return;
    }

    const copied = await copyText(link);

    if (copied) {
      clientToast.success("Ссылка скопирована в буфер обмена", {
        duration: 2000,
      });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
      return;
    }

    window.prompt("Скопируй ссылку вручную:", link);
  };

  return (
    <>
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

      {link && (
        <InboundShareQrDialog
          link={link}
          open={qrCodeDialogOpen}
          type={inbound.type}
          onOpenChange={setQrCodeDialogOpen}
        />
      )}
    </>
  );
}
