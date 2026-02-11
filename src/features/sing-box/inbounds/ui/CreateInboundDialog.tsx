import { PlusCircle } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";

import {
  CREATE_INBOUND_FORM_ID,
  CreateInboundForm,
} from "./CreateInboundForm/CreateInboundForm";

export function CreateInboundDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <PlusCircle />
          Создать инбаунд
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Создать инбаунд</DialogTitle>
        </DialogHeader>

        <div className="scrollbar-transparent flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <CreateInboundForm />
        </div>

        <div className="bg-background sticky bottom-0 shrink-0 border-t px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Сбросить
            </Button>

            <Button form={CREATE_INBOUND_FORM_ID} type="submit">
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
