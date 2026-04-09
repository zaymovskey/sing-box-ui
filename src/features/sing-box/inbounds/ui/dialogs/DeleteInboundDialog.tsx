import { MessageCircleWarning } from "lucide-react";

import { type StoredInbound } from "@/shared/api/contracts";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  serverToast,
} from "@/shared/ui";

import { useDeleteInbound } from "../../model/commands/inbound-delete.command";

interface DeleteInboundDialogProps {
  inbound: StoredInbound;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteInboundDialog({
  inbound,
  open,
  onOpenChange,
}: DeleteInboundDialogProps) {
  const { deleteInbound, isPending } = useDeleteInbound();

  const handleDelete = async () => {
    serverToast.loading("Удаление...", { id: "delete-inbound" });

    try {
      await deleteInbound(inbound.internal_tag as string);
      serverToast.success("Инбаунд успешно удален", {
        id: "delete-inbound",
        duration: 3000,
      });
      onOpenChange(false);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Неизвестная ошибка";
      serverToast.error("Не удалось удалить инбаунд", {
        description: errorMessage,
        id: "delete-inbound",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Подтвердите удаление инбаунда</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 pt-4 pb-6">
          <p>
            Вы уверены, что хотите удалить инбаунд{" "}
            <span className="font-medium">{inbound.display_tag}</span>?
          </p>

          {inbound.listen_port != null && (
            <div className="bg-muted text-muted-foreground flex items-center rounded-md border px-4 py-3 text-sm">
              <MessageCircleWarning className="mr-2 size-4" /> После удаления
              порт{" "}
              <span className="mx-1 font-medium">{inbound.listen_port}</span>{" "}
              будет закрыт в firewall.
            </div>
          )}
        </div>

        <div className="bg-background sticky bottom-0 shrink-0 border-t px-6 py-4">
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button disabled={isPending} type="button" variant="outline">
                Отмена
              </Button>
            </DialogClose>

            <Button
              disabled={isPending}
              loading={isPending}
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
