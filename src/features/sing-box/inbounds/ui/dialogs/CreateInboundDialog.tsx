"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  InboundFormSchema,
  type InboundFormValues,
} from "@/features/sing-box/config-core";
import {
  type DraftInbound,
  type InboundsListResponse,
} from "@/shared/api/contracts";
import {
  Button,
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
import { useInboundsListQuery } from "../../model/inbounds-list.query";
import { InboundForm } from "../InboundForm/InboundForm";
import { defaultsByType } from "../InboundForm/InboundForm.constants";

const FORM_ID = "create-inbound-form";

function getRawInbounds(
  response: InboundsListResponse | undefined,
): DraftInbound[] {
  return Array.isArray(response?.list) ? response.list : [];
}

interface CreateInboundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInboundDialog({
  open,
  onOpenChange,
}: CreateInboundDialogProps) {
  const { data: inboundsListResponse } = useInboundsListQuery();

  const initialValues = defaultsByType.vless;

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const rawInbounds = useMemo(
    () => getRawInbounds(inboundsListResponse),
    [inboundsListResponse],
  );

  const tags = useMemo(() => {
    return rawInbounds
      .map((inbound) => inbound.tag)
      .filter((tag): tag is string => Boolean(tag));
  }, [rawInbounds]);

  const checkTagUniqueAndSetFormError = useInboundTagUniqueness(form, tags);

  const checkBindUniqueAndSetError = useInboundBindUniqueness({
    form,
    inbounds: rawInbounds,
  });

  const { createInbound, isPending } = useCreateInbound();

  const handleSubmit = async (values: InboundFormValues) => {
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

      onOpenChange(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        serverToast.error("Конфиг получился невалидным (баг маппера).", {
          id: "save-inbound",
          duration: 2000,
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

    form.reset(initialValues, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(initialValues, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  }, [open, form, initialValues]);

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
            <InboundForm
              form={form}
              formId={FORM_ID}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
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
