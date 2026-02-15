"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";

import {
  InboundFormSchema,
  type InboundFormValues,
} from "../../config-core/model/config-core.inbounds-schema";
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useCreateInbound,
} from "../model/inbound-create.command";
import { InboundForm } from "./InboundForm/InboundForm";
import { defaultsByType } from "./InboundForm/InboundForm.constants";

const FORM_ID = "create-inbound-form";

export function CreateInboundDialog() {
  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: defaultsByType.vless,
  });

  const type = useWatch({ control: form.control, name: "type" });

  const { createInbound, isPending } = useCreateInbound();

  const handleSubmit = async (values: InboundFormValues) => {
    form.clearErrors("root");
    toast.loading("Сохранение...", { id: "save-inbound" });

    try {
      await createInbound(values);
      toast.success("Инбаунд успешно создан", { id: "save-inbound" });
      form.reset(defaultsByType[type]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        toast.error("Конфиг получился невалидным (баг маппера).", {
          id: "save-inbound",
        });
        return;
      }

      toast.error("Не удалось создать инбаунд", { id: "save-inbound" });
    }
  };

  const handleReset = () => {
    form.clearErrors();
    form.reset(defaultsByType[type]);
  };

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

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <InboundForm form={form} formId={FORM_ID} onSubmit={handleSubmit} />
        </div>

        <div className="bg-background sticky bottom-0 shrink-0 border-t px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button
              disabled={isPending}
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Сбросить
            </Button>

            <Button form={FORM_ID} loading={isPending} type="submit">
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
