import { Check, Copy, ScanQrCode } from "lucide-react";
import { useState } from "react";

import { type Inbound, useConfigQuery } from "@/features/sing-box/config-core";
import { clientEnv } from "@/shared/lib";
import { Button, clientToast, TableCell, TableRow } from "@/shared/ui";

import { buildInboundShareLink } from "../lib/build-Inbound-share-link";

export function InboundUserRow({
  inbound,
  user,
}: {
  inbound: Inbound;
  user: unknown;
}) {
  const { data: singBoxConfig } = useConfigQuery();

  const name =
    typeof user === "object" &&
    user &&
    "name" in user &&
    typeof user.name === "string"
      ? user.name
      : "Без имени";

  const handleCopy = async (inbound: Inbound, user: unknown) => {
    try {
      const realityPublicKeys = singBoxConfig?._panel?.realityPublicKeys || {};
      const link = buildInboundShareLink(
        inbound,
        user,
        clientEnv.NEXT_PUBLIC_HOST_IP || "localhost",
        realityPublicKeys,
      );
      if (link) {
        await navigator.clipboard.writeText(link);
        clientToast.success("Ссылка скопирована в буфер обмена", {
          duration: 2000,
        });
        setCopyIcon(<Check />);
        setTimeout(() => setCopyIcon(<Copy />), 1000);
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

  const [copyIcon, setCopyIcon] = useState(<Copy />);

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
              <Button type="button" onClick={() => handleCopy(inbound, user)}>
                {copyIcon}
                Ссылка
              </Button>
              <Button type="button">
                <ScanQrCode />
                QR
              </Button>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
