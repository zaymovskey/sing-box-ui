"use client";

import { type SecurityAsset } from "@/shared/api/contracts";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  serverToast,
} from "@/shared/ui";

import { useDeleteSecurityAsset } from "../../model/commands/security-assets-delete.command";

interface DeleteSecurityAssetDialogProps {
  securityAsset: SecurityAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSecurityAssetDialog({
  securityAsset,
  open,
  onOpenChange,
}: DeleteSecurityAssetDialogProps) {
  const { deleteSecurityAsset, isPending } = useDeleteSecurityAsset();

  const handleDelete = async () => {
    serverToast.loading("Удаление...", { id: "delete-security-asset" });

    try {
      await deleteSecurityAsset(securityAsset.id);

      serverToast.success("TLS / Reality успешно удален", {
        id: "delete-security-asset",
        duration: 2000,
      });

      onOpenChange(false);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Неизвестная ошибка";

      serverToast.error("Не удалось удалить TLS / Reality", {
        description: errorMessage,
        id: "delete-security-asset",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Подтвердите удаление TLS / Reality</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          Вы уверены, что хотите удалить TLS / Reality{" "}
          <span className="font-medium">{securityAsset.name}</span>?
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
