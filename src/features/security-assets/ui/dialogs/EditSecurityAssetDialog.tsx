"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { type SecurityAsset } from "@/shared/api/contracts";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  serverToast,
} from "@/shared/ui";

import {
  SECURITY_ASSET_INVALID_AFTER_MAPPING,
  useEditSecurityAsset,
} from "../../model/commands/security-assets-edit.command";
import { mapSecurityAssetToFormValues } from "../../model/mappers/security-assets.form-mapper";
import {
  createSecurityAssetFormSchema,
  type SecurityAssetFormValues,
} from "../../model/security-asset-form.schema";
import { SecurityAssetFormProvider } from "../../model/security-assets-form-ui.context";
import { useSecurityAssetsListQuery } from "../../model/security-assets-list.query";
import { SecurityAssetForm } from "../SecurityAssetForm/SecurityAssetForm";

const FORM_ID = "edit-security-asset-form";

interface EditSecurityAssetDialogProps {
  securityAsset: SecurityAsset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSecurityAssetDialog({
  securityAsset,
  open,
  onOpenChange,
}: EditSecurityAssetDialogProps) {
  const initialValues = useMemo(() => {
    return mapSecurityAssetToFormValues(securityAsset);
  }, [securityAsset]);

  const { data: securityAssets } = useSecurityAssetsListQuery();

  const existingNames = useMemo(
    () => securityAssets?.map((asset) => asset.name) ?? [],
    [securityAssets],
  );

  const SecurityAssetFormSchema = useMemo(
    () => createSecurityAssetFormSchema(existingNames, securityAsset.name),
    [existingNames, securityAsset.name],
  );

  const form = useForm<SecurityAssetFormValues>({
    resolver: zodResolver(SecurityAssetFormSchema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!open) return;

    form.reset(mapSecurityAssetToFormValues(securityAsset));
  }, [open, securityAsset, form]);

  const { editSecurityAsset, isPending } = useEditSecurityAsset();

  const handleSubmit = async (values: SecurityAssetFormValues) => {
    form.clearErrors("root");

    serverToast.loading("Сохранение...", { id: "edit-security-asset" });

    try {
      await editSecurityAsset(securityAsset.id, values);

      serverToast.success("TLS / Reality успешно обновлён", {
        id: "edit-security-asset",
        duration: 2000,
      });

      form.clearErrors();
      form.reset(values);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === SECURITY_ASSET_INVALID_AFTER_MAPPING) {
        serverToast.error(
          "TLS / Reality получился невалидным после маппинга.",
          {
            id: "edit-security-asset",
            duration: 2000,
          },
        );
        return;
      }

      serverToast.error("Не удалось обновить TLS / Reality", {
        description: `Message: ${msg}`,
        id: "edit-security-asset",
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
          <DialogTitle>Редактировать TLS / Reality</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <SecurityAssetFormProvider contextValue={{ mode: "edit" }}>
            <SecurityAssetForm
              form={form}
              formId={FORM_ID}
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
