import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";

import { useLogoutMutation } from "../model/logout.mutation";

type RenderTriggerProps = {
  disabled: boolean;
};

type LogoutDialogProps = {
  renderTrigger: (props: RenderTriggerProps) => React.ReactElement;
};

export function LogoutDialog({ renderTrigger }: LogoutDialogProps) {
  const logoutMutation = useLogoutMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {renderTrigger({ disabled: logoutMutation.isPending })}
      </DialogTrigger>

      <DialogContent
        className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Выйти из аккаунта?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-1 pb-1">
          Текущая сессия будет завершена.
        </div>

        <div className="bg-background sticky bottom-0 shrink-0 border-t px-6 py-4">
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                disabled={logoutMutation.isPending}
                type="button"
                variant="outline"
              >
                Отмена
              </Button>
            </DialogClose>

            <Button
              disabled={logoutMutation.isPending}
              loading={logoutMutation.isPending}
              type="button"
              onClick={() => logoutMutation.mutate()}
            >
              Выйти
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
