import { Check, Copy, ScanQrCode } from "lucide-react";
import { useState } from "react";

import {
  type SecurityAsset,
  type StoredInbound,
  type StoredInboundUser,
} from "@/shared/api/contracts";
import { copyText } from "@/shared/lib";
import {
  Button,
  clientToast,
  Separator,
  sonnerErrorCloseButton,
} from "@/shared/ui";

import { buildInboundShareLink } from "../../lib/build-Inbound-share-link";
import { getInboundUserName } from "../../lib/get-inbound-user-name.hepler";
import { InboundShareQrDialog } from "../dialogs/InboundShareQrDialog";

export function InboundUserRow({
  inbound,
  user,
  securityAssets,
}: {
  inbound: StoredInbound;
  user: StoredInboundUser;
  securityAssets: SecurityAsset[];
}) {
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const name = getInboundUserName(inbound.type, user);

  const host =
    typeof window !== "undefined" ? window.location.hostname : "UNKNOWN_HOST";

  const link = buildInboundShareLink(inbound, user, securityAssets ?? [], host);

  const handleCopy = async () => {
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
      if (host === "localhost") {
        clientToast.error(
          <div className="flex flex-col gap-1">
            <div>
              1. Не забудьте заменить localhost на реальный IP-адрес в вашей
              сети.
            </div>
            <Separator />
            <div>
              2. Не используйте стандартные порты типа 443, 80, 22, установите
              более специфичный, например 2001.
            </div>
            <Separator />
            <div>3. Убедитесь, что listen = 0.0.0.0</div>
            <Separator />
            <div>4. Убедитесь что порт открыт в firewall.</div>
          </div>,
          { ...sonnerErrorCloseButton },
        );
      }
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
