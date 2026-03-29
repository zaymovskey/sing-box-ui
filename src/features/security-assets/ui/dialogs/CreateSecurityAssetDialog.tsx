"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
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
  SecurityAssetFormSchema,
  type SecurityAssetFormValues,
} from "../../model/security-asset-form.schema";
import { SecurityAssetFormProvider } from "../../model/security-assets-form-ui.context";
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
  const form = useForm<SecurityAssetFormValues>({
    resolver: zodResolver(SecurityAssetFormSchema),
    mode: "onSubmit",
    defaultValues: defaultsByType.tls(),
  });

  const type = useWatch({ control: form.control, name: "type" });

  const { createSecurityAsset, isPending } = useCreateSecurityAsset();

  const handleSubmit = async (values: SecurityAssetFormValues) => {
    form.clearErrors("root");

    serverToast.loading("Сохранение...", { id: "save-security-asset" });

    try {
      await createSecurityAsset(values);

      serverToast.success("Security asset создан", {
        id: "save-security-asset",
        duration: 2000,
      });

      form.reset(defaultsByType[type]());
      form.clearErrors();

      onOpenChange(false);
    } catch {
      serverToast.error("Не удалось создать security asset", {
        id: "save-security-asset",
        duration: 2000,
      });
    }
  };

  const handleReset = () => {
    form.clearErrors();
    form.reset(defaultsByType[type]());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <PlusCircle />
          Создать security asset
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 px-6 pt-6">
          <DialogTitle>Создать security asset</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6">
          <SecurityAssetFormProvider contextValue={{ mode: "create" }}>
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

            <Button form={FORM_ID} loading={isPending} type="submit">
              Создать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
