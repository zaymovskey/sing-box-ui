"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import {
  type ConfigInbound,
  InboundFormSchema,
  type InboundFormValues,
  useConfigQuery,
} from "@/features/sing-box/config-core";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  serverToast,
} from "@/shared/ui";

import { useInboundBindUniqueness } from "../../lib/use-inbound-bind-uniqueness";
import { useInboundTagUniqueness } from "../../lib/use-inbound-tag-uniqueness";
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useEditInbound,
} from "../../model/commands/inbound-edit.command";
import { mapInboundToFormValues } from "../../model/inbound.form-mapper";
import { InboundFormProvider } from "../../model/inbound-form-ui.context";
import { InboundForm } from "../InboundForm/InboundForm";

const FORM_ID = "edit-inbound-form";

interface EditInboundDialogProps {
  inbound: ConfigInbound;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInboundDialog({
  inbound,
  open,
  onOpenChange,
}: EditInboundDialogProps) {
  const configQuery = useConfigQuery();
  const singBoxConfig = configQuery.data?.config;
  const configMetadata = configQuery.data?.metadata;

  const [currentInboundTag, setCurrentInboundTag] = useState(inbound.tag);

  useEffect(() => {
    setCurrentInboundTag(inbound.tag);
  }, [inbound.tag]);

  const realityPublicKeys = useMemo(
    () => configMetadata?.realityPublicKeys || {},
    [configMetadata?.realityPublicKeys],
  );
  const initialValues = useMemo(
    () => mapInboundToFormValues(inbound, realityPublicKeys),
    [inbound, realityPublicKeys],
  );

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const { editInbound, isPending } = useEditInbound();

  const tags =
    singBoxConfig?.inbounds
      ?.map((i) => i.tag)
      .filter((tag): tag is string => Boolean(tag)) ?? [];

  const checkTagUniqueAndSetFormError = useInboundTagUniqueness(
    form,
    tags,
    currentInboundTag,
  );

  const checkBindUniqueAndSetError = useInboundBindUniqueness({
    form,
    inbounds: singBoxConfig?.inbounds ?? [],
    excludeTag: currentInboundTag,
  });

  const handleSubmit = async (values: InboundFormValues) => {
    form.clearErrors("root");

    if (!checkTagUniqueAndSetFormError()) {
      return;
    }

    if (!checkBindUniqueAndSetError()) {
      return;
    }

    serverToast.loading("Сохранение...", { id: "edit-inbound" });

    try {
      if (!currentInboundTag) {
        serverToast.error("Инбаунд должен иметь тег для редактирования", {
          id: "edit-inbound",
        });
        return;
      }

      await editInbound(currentInboundTag, values);
      serverToast.success("Инбаунд успешно обновлен", {
        id: "edit-inbound",
        duration: 2000,
      });
      setCurrentInboundTag(values.tag);
      form.clearErrors();
      form.reset(values);
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
    form.reset(initialValues, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Редактировать инбаунд</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <InboundFormProvider contextValue={{ mode: "edit" }}>
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
