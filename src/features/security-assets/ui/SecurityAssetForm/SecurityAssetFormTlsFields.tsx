"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { ControlledSelectField } from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { TLSFileToolsSection } from "../tools/TLSFileTools/TLSFileToolsSection";
import { TLSInlineToolsSection } from "../tools/TLSInlineTools/TLSInlineToolsSection";
import { defaultsByType } from "./SecurityAssetForm.constants";

type TlsFormValues = Extract<SecurityAssetFormValues, { type: "tls" }>;
type TlsSourceType = TlsFormValues["source"]["sourceType"];

interface SecurityAssetFormTlsFieldsProps {
  initialValues?: TlsFormValues;
}

export function SecurityAssetFormTlsFields({
  initialValues,
}: SecurityAssetFormTlsFieldsProps) {
  const form = useFormContext<SecurityAssetFormValues>();

  const sourceType = useWatch({
    control: form.control,
    name: "source.sourceType",
    defaultValue: initialValues?.source.sourceType ?? "inline",
  });

  const onSourceTypeValueChangeExternal = (nextType: string) => {
    const defaultValues = defaultsByType.tls();
    const nextSourceType = nextType as TlsSourceType;

    if (nextSourceType === "inline") {
      form.setValue("source.certificatePem", "", {
        shouldDirty: true,
        shouldValidate: form.formState.submitCount > 0,
      });

      form.setValue("source.keyPem", "", {
        shouldDirty: true,
        shouldValidate: form.formState.submitCount > 0,
      });

      return;
    }

    if (defaultValues.source.sourceType === "file") {
      form.setValue(
        "source.certificatePath",
        defaultValues.source.certificatePath,
        {
          shouldDirty: true,
          shouldValidate: form.formState.submitCount > 0,
        },
      );

      form.setValue("source.keyPath", defaultValues.source.keyPath, {
        shouldDirty: true,
        shouldValidate: form.formState.submitCount > 0,
      });
    }
  };

  return (
    <div className="space-y-4">
      <ControlledSelectField<SecurityAssetFormValues>
        items={[
          { label: "Inline", value: "inline" },
          { label: "File", value: "file" },
        ]}
        label="Certificate Source"
        name="source.sourceType"
        placeholder="Выбери источник сертификата"
        showErrorMessage={false}
        onValueChangeExternal={onSourceTypeValueChangeExternal}
      />

      <div className="bg-muted/30 rounded-md border px-3 py-3 text-sm">
        <p className="text-foreground font-medium">Источник TLS сертификата</p>
        <p className="text-muted-foreground mt-1">
          Inline хранит сертификат и ключ прямо в конфигурации. File использует
          пути к файлам на сервере и подходит, если сертификаты уже лежат в
          управляемой директории.
        </p>
      </div>

      {sourceType === "inline" && <TLSInlineToolsSection />}
      {sourceType === "file" && <TLSFileToolsSection />}
    </div>
  );
}
