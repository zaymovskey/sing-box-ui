"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  InboundFormSchema,
  type InboundFormValues,
  useConfigQuery,
} from "@/features/sing-box/config-core";
import { DraftConfigSchema } from "@/shared/api/contracts";
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

import { useInboundBindUniqueness } from "../../lib/use-inbound-bind-uniqueness";
import { useInboundTagUniqueness } from "../../lib/use-inbound-tag-uniqueness";
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useCreateInbound,
} from "../../model/commands/inbound-create.command";
import { InboundFormProvider } from "../../model/inbound-form-ui.context";
import { InboundForm } from "../InboundForm/InboundForm";
import { defaultsByType } from "../InboundForm/InboundForm.constants";

const FORM_ID = "create-inbound-form";

interface CreateInboundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInboundDialog({
  open,
  onOpenChange,
}: CreateInboundDialogProps) {
  const { data: rawDraftConfig } = useConfigQuery();

  const parsedDraftResult = useMemo(() => {
    return DraftConfigSchema.safeParse(rawDraftConfig);
  }, [rawDraftConfig]);

  const draftConfig = parsedDraftResult.success ? parsedDraftResult.data : null;

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: defaultsByType.vless,
  });

  const type = useWatch({ control: form.control, name: "type" });

  const tags =
    draftConfig?.inbounds
      ?.map((i) => i.tag)
      .filter((tag): tag is string => Boolean(tag)) ?? [];

  const checkTagUniqueAndSetFormError = useInboundTagUniqueness(form, tags);

  const checkBindUniqueAndSetError = useInboundBindUniqueness({
    form,
    inbounds: draftConfig?.inbounds ?? [],
  });

  const { createInbound, isPending } = useCreateInbound();

  const handleSubmit = async (values: InboundFormValues) => {
    if (!draftConfig) {
      clientToast.error("Конфиг не загружен или повреждён", {
        duration: 2000,
      });
      return;
    }

    form.clearErrors("root");

    if (!checkTagUniqueAndSetFormError()) {
      return;
    }

    if (!checkBindUniqueAndSetError()) {
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
      form.clearErrors();
      onOpenChange(false);
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

  const handleReset = () => {
    form.clearErrors();
    form.reset(defaultsByType[type]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <InboundFormProvider contextValue={{ mode: "create" }}>
            <InboundForm form={form} formId={FORM_ID} onSubmit={handleSubmit} />
          </InboundFormProvider>
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
