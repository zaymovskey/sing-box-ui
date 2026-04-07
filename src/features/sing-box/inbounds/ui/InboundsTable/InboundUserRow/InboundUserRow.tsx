import { Check, Copy, ScanQrCode } from "lucide-react";
import { useState } from "react";

import {
  type InboundUserStats,
  type SecurityAsset,
  type StoredInbound,
  type StoredInboundUser,
} from "@/shared/api/contracts";
import { cn, copyText } from "@/shared/lib";
import {
  Button,
  clientToast,
  Separator,
  sonnerErrorCloseButton,
} from "@/shared/ui";

import { buildInboundShareLink } from "../../../lib/build-Inbound-share-link";
import { getInboundUserName } from "../../../lib/get-inbound-user-name.hepler";
import { InboundShareQrDialog } from "../../dialogs/InboundShareQrDialog";
import { formatBytes, formatLastSeen, getLastActivity } from "./helpers";

export function InboundUserRow({
  inbound,
  user,
  securityAssets,
  userStats,
}: {
  inbound: StoredInbound;
  user: StoredInboundUser;
  securityAssets: SecurityAsset[];
  userStats?: InboundUserStats;
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

  const lastActivity = getLastActivity({
    last_up_traffic_at: userStats?.last_up_traffic_at ?? null,
    last_down_traffic_at: userStats?.last_down_traffic_at ?? null,
  });

  return (
    <>
      <div className="bg-background rounded-md border px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex">
            <OnlineStatus
              className="mr-10"
              isOnline={userStats?.is_online ?? false}
            />
            <div className="flex justify-center gap-5">
              <div className="min-w-0 space-y-1">
                <div className="text-muted-foreground text-[10px] tracking-wide uppercase">
                  Last Activity
                </div>

                <div className="flex items-center gap-3">
                  <span className="truncate text-sm font-medium">
                    {userStats?.is_online
                      ? "Now"
                      : formatLastSeen(lastActivity)}
                  </span>
                </div>
              </div>

              <div className="min-w-0 space-y-1">
                <div className="text-muted-foreground text-[10px] tracking-wide uppercase">
                  Name
                </div>

                <div className="flex items-center gap-3">
                  <span className="truncate text-sm font-medium">{name}</span>
                </div>
              </div>

              <div className="min-w-0 space-y-1">
                <div className="text-muted-foreground text-[10px] tracking-wide uppercase">
                  Traffic up
                </div>

                <div className="flex items-center gap-3">
                  <span className="truncate text-sm font-medium">
                    ↑ {formatBytes(userStats?.up_traffic_total)}
                  </span>
                </div>
              </div>

              <div className="min-w-0 space-y-1">
                <div className="text-muted-foreground text-[10px] tracking-wide uppercase">
                  Traffic down
                </div>

                <div className="flex items-center gap-3">
                  <span className="truncate text-sm font-medium">
                    ↓ {formatBytes(userStats?.down_traffic_total)}
                  </span>
                </div>
              </div>
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

const OnlineStatus = ({
  isOnline,
  className,
}: {
  isOnline: boolean;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex h-2.5 w-2.5">
        {isOnline && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            isOnline
              ? "bg-green-500"
              : "bg-muted-foreground/40 transition-colors duration-300",
          )}
        />
      </span>

      <span
        className={cn(
          "text-xs font-medium transition-colors duration-300",
          isOnline ? "text-green-500" : "text-muted-foreground",
        )}
      >
        {isOnline ? "Online" : "Offline"}
      </span>
    </div>
  );
};
