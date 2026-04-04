"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  serverToast,
} from "@/shared/ui";

import { useCreateSecurityAsset } from "../../model/commands/security-assets-create.command";
import {
  createSecurityAssetFormSchema,
  type SecurityAssetFormValues,
} from "../../model/security-asset-form.schema";
import { SecurityAssetFormProvider } from "../../model/security-assets-form-ui.context";
import { useSecurityAssetsListQuery } from "../../model/security-assets-list.query";
import { SecurityAssetForm } from "../SecurityAssetForm/SecurityAssetForm";
import { defaultsByType } from "../SecurityAssetForm/SecurityAssetForm.constants";

const FORM_ID = "create-security-asset-form";

interface CreateSecurityAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSecurityAssetDialog({
  open,
  onOpenChange,
}: CreateSecurityAssetDialogProps) {
  const { data: securityAssets } = useSecurityAssetsListQuery();

  const existingNames = useMemo(
    () => securityAssets?.map((asset) => asset.name) ?? [],
    [securityAssets],
  );

  const SecurityAssetFormSchema = useMemo(
    () => createSecurityAssetFormSchema(existingNames),
    [existingNames],
  );

  const initialValues = defaultsByType.tls();

  const form = useForm<SecurityAssetFormValues>({
    resolver: zodResolver(SecurityAssetFormSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const type = useWatch({
    control: form.control,
    name: "type",
    defaultValue: initialValues.type,
  });

  const { createSecurityAsset, isPending } = useCreateSecurityAsset();

  const handleSubmit = async (values: SecurityAssetFormValues) => {
    form.clearErrors("root");

    serverToast.loading("Сохранение...", {
      id: "save-security-asset",
    });

    const typeTitle = values.type === "tls" ? "TLS" : "Reality";

    try {
      await createSecurityAsset(values);

      serverToast.success(`${typeTitle} создан`, {
        id: "save-security-asset",
        duration: 3000,
      });

      onOpenChange(false);
    } catch {
      serverToast.error(`Не удалось создать ${typeTitle}`, {
        id: "save-security-asset",
        duration: 3000,
      });
    }
  };

  const handleReset = () => {
    form.clearErrors();

    form.reset(defaultsByType[type](), {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  };

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.clearErrors();

      form.reset(initialValues, {
        keepDirty: false,
        keepTouched: false,
        keepErrors: false,
        keepSubmitCount: false,
        keepIsSubmitted: false,
      });
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <PlusCircle />
          Создать TLS / Reality
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Создать TLS / Reality</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <SecurityAssetFormProvider contextValue={{ mode: "create" }}>
            <SecurityAssetForm
              form={form}
              formId={FORM_ID}
              initialValues={initialValues}
              onSubmit={handleSubmit}
            />
          </SecurityAssetFormProvider>
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
