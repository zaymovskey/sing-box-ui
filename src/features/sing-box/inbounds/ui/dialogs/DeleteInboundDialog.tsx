import { type DraftInbound } from "@/shared/api/contracts";
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
  inbound: DraftInbound;
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
      await deleteInbound(inbound.tag as string);
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
      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Подтвердите удаление инбаунда</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          Вы уверены, что хотите удалить инбаунд {inbound.tag}?
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
