import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ControlledSelectField } from "@/shared/ui";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { TLSFileToolsSection } from "../tools/TLSFileTools/TLSFileToolsSection";
import { TLSInlineToolsSection } from "../tools/TLSInlineTools/TLSInlineToolsSection";

export function SecurityAssetFormTlsFields() {
  const form = useFormContext<SecurityAssetFormValues>();

  const sourceType = useWatch({
    control: form.control,
    name: "source.sourceType",
  });

  useEffect(() => {
    if (sourceType === "inline") {
      form.setValue("source._tlsChecked", undefined, {
        shouldDirty: true,
        shouldValidate: form.formState.submitCount > 0,
      });

      form.setValue("source._is_selfsigned_cert", undefined, {
        shouldDirty: true,
        shouldValidate: form.formState.submitCount > 0,
      });

      form.setValue("source.certificatePath", "", {
        shouldDirty: true,
        shouldValidate: false,
      });

      form.setValue("source.keyPath", "", {
        shouldDirty: true,
        shouldValidate: false,
      });

      return;
    }

    form.setValue("source.certificatePem", "", {
      shouldDirty: true,
      shouldValidate: false,
    });

    form.setValue("source.keyPem", "", {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [sourceType, form]);

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
