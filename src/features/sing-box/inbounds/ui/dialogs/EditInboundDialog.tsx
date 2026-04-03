"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
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
  serverToast,
} from "@/shared/ui";

import { useInboundBindUniqueness } from "../../lib/use-inbound-bind-uniqueness";
import { useInboundTagUniqueness } from "../../lib/use-inbound-tag-uniqueness";
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useEditInbound,
} from "../../model/commands/inbound-edit.command";
import { InboundFormProvider } from "../../model/inbound-form-ui.context";
import { useInboundsListQuery } from "../../model/inbounds-list.query";
import { mapInboundToFormValues } from "../../model/mappers/inbound.form-mapper";
import { InboundForm } from "../InboundForm/InboundForm";

const FORM_ID = "edit-inbound-form";

function getRawInbounds(
  response: InboundsListResponse | undefined,
): DraftInbound[] {
  return Array.isArray(response?.list) ? response.list : [];
}

interface EditInboundDialogProps {
  inbound: DraftInbound;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInboundDialog({
  inbound,
  open,
  onOpenChange,
}: EditInboundDialogProps) {
  const { data: inboundsListResponse } = useInboundsListQuery();

  const rawInbounds = useMemo(
    () => getRawInbounds(inboundsListResponse),
    [inboundsListResponse],
  );

  const initialValues = useMemo(() => {
    return mapInboundToFormValues(inbound);
  }, [inbound]);

  const [currentInboundTag, setCurrentInboundTag] = useState<
    string | undefined
  >(inbound.tag);

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setCurrentInboundTag(inbound.tag);
    form.reset(initialValues, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  }, [open, inbound.tag, initialValues, form]);

  const { editInbound, isPending } = useEditInbound();

  const tags = useMemo(() => {
    return rawInbounds
      .map((item) => item.tag)
      .filter((tag): tag is string => Boolean(tag));
  }, [rawInbounds]);

  const checkTagUniqueAndSetFormError = useInboundTagUniqueness(
    form,
    tags,
    currentInboundTag,
  );

  const checkBindUniqueAndSetError = useInboundBindUniqueness({
    form,
    inbounds: rawInbounds,
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

    if (!currentInboundTag) {
      serverToast.error("Инбаунд должен иметь тег для редактирования", {
        id: "edit-inbound",
        duration: 2000,
      });
      return;
    }

    serverToast.loading("Сохранение...", { id: "edit-inbound" });

    try {
      await editInbound(currentInboundTag, values);

      serverToast.success("Инбаунд успешно обновлен", {
        id: "edit-inbound",
        duration: 2000,
      });

      setCurrentInboundTag(values.tag);

      form.clearErrors();
      form.reset(values, {
        keepDirty: false,
        keepTouched: false,
        keepErrors: false,
        keepSubmitCount: false,
        keepIsSubmitted: false,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        serverToast.error("Конфиг получился невалидным (баг маппера).", {
          id: "edit-inbound",
          duration: 2000,
        });
        return;
      }

      serverToast.error("Не удалось обновить инбаунд", {
        description: `Message: ${msg}`,
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
