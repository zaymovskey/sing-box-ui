"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, type UseFormReturn, useWatch } from "react-hook-form";

import {
  InboundFormSchema,
  type InboundFormValues,
  isUniqueInboundTag,
  useConfigQuery,
} from "@/features/sing-box/config-core";
import {
  Button,
  clientToast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  serverToast,
} from "@/shared/ui";

import {
  CONFIG_INVALID_AFTER_MAPPING,
  useCreateInbound,
} from "../../model/commands/inbound-create.command";
import { InboundForm } from "../InboundForm/InboundForm";
import { defaultsByType } from "../InboundForm/InboundForm.constants";

const FORM_ID = "create-inbound-form";

const isFormTagUnique = (
  tag: string,
  configTags: string[],
  form: UseFormReturn<InboundFormValues>,
) => {
  const isTagError = isUniqueInboundTag({
    tag: tag,
    tags: configTags,
  });

  if (isTagError) {
    form.setError("tag", {
      type: "custom",
      message: "Тег должен быть уникальным",
    });
  }

  return !isTagError;
};

export function CreateInboundDialog() {
  const { data: singBoxConfig } = useConfigQuery();

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: defaultsByType.vless,
  });

  const type = useWatch({ control: form.control, name: "type" });

  const { createInbound, isPending } = useCreateInbound();

  const handleSubmit = async (values: InboundFormValues) => {
    if (!singBoxConfig || !singBoxConfig.inbounds) {
      clientToast.error("Конфиг не загружен", { duration: 2000 });
      return;
    }

    form.clearErrors("root");

    if (
      !isFormTagUnique(
        values.tag,
        singBoxConfig.inbounds
          .map((i) => i.tag)
          .filter((tag): tag is string => Boolean(tag)),
        form,
      )
    ) {
      return;
    }

    serverToast.loading("Сохранение...", { id: "save-inbound" });

    try {
      await createInbound(values);
      serverToast.success("Инбаунд успешно создан", {
        id: "save-inbound",
        duration: 2000,
      });
      form.reset(defaultsByType[type]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        serverToast.error("Конфиг получился невалидным (баг маппера).", {
          id: "save-inbound",
        });
        return;
      }

      serverToast.error("Не удалось создать инбаунд", {
        id: "save-inbound",
        duration: 2000,
      });
    }
  };

  const tag = useWatch({
    control: form.control,
    name: "tag",
  });

  const {
    formState: { submitCount, errors },
  } = form;

  useEffect(() => {
    if (submitCount === 0) {
      return;
    }

    if (!tag?.trim()) {
      return;
    }

    if (!singBoxConfig?.inbounds) {
      return;
    }

    if (
      !isFormTagUnique(
        tag,
        singBoxConfig.inbounds
          .map((i) => i.tag)
          .filter((tag): tag is string => Boolean(tag)),
        form,
      )
    ) {
      return;
    }

    if (errors.tag?.type === "custom") {
      form.clearErrors("tag");
      void form.trigger("tag");
    }
  }, [tag, submitCount, errors.tag?.type, form, singBoxConfig]);

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
              disabled={!form.formState.isDirty}
              loading={isPending}
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
