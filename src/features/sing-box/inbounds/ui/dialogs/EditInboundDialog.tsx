"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  serverToast,
} from "@/shared/ui";

import {
  InboundFormSchema,
  type InboundFormValues,
} from "../../../config-core/model/config-core.inbounds-schema";
import { type Inbound } from "../../../config-core/model/config-core.types";
import { mapInboundToFormValues } from "../../model/inbound.form-mapper";
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useEditInbound,
} from "../../model/inbound-edit.command";
import { InboundForm } from "../InboundForm/InboundForm";

const FORM_ID = "edit-inbound-form";

interface EditInboundDialogProps {
  inbound: Inbound;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInboundDialog({
  inbound,
  open,
  onOpenChange,
}: EditInboundDialogProps) {
  // Костыль для сброса формы при переключении между типами (VLESS/Hysteria2)
  const [resetKey, setResetKey] = useState(0);

  const initialValues = useMemo(
    () => mapInboundToFormValues(inbound),
    [inbound],
  );

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const { editInbound, isPending } = useEditInbound();

  const handleSubmit = async (values: InboundFormValues) => {
    form.clearErrors("root");
    serverToast.loading("Сохранение...", { id: "edit-inbound" });

    try {
      await editInbound(values);
      serverToast.success("Инбаунд успешно обновлен", {
        id: "edit-inbound",
        duration: 2000,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        serverToast.error("Конфиг получился невалидным (баг маппера).", {
          id: "edit-inbound",
        });
        return;
      }

      serverToast.error("Не удалось обновить инбаунд", {
        id: "edit-inbound",
        duration: 2000,
      });
    }
  };

  const handleReset = () => {
    form.clearErrors();
    form.reset(initialValues);
    setResetKey((k) => k + 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Редактировать инбаунд</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <InboundForm
            key={`${inbound.tag}-${resetKey}`}
            form={form}
            formId={FORM_ID}
            onSubmit={handleSubmit}
          />
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

            <Button
              disabled={!form.formState.isDirty}
              form={FORM_ID}
              loading={isPending}
              type="submit"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
