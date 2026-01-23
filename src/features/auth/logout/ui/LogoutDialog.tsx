import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выйти из аккаунта?</DialogTitle>
          <DialogDescription>Текущая сессия будет завершена.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={logoutMutation.isPending}
            >
              Отмена
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            loading={logoutMutation.isPending}
          >
            Выйти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
