import { useFormContext } from "react-hook-form";

import { clientToast } from "@/shared/ui";

import { useGenerateInlineTLSMutation } from "../../../model/mutations/TLS/inline-tls-generate.mutation";
import { type SecurityAssetFormValues } from "../../../model/security-asset-form.schema";
import { TLSInlineTools } from "./TLSInlineTools";

export function TLSInlineToolsSection() {
  const {
    setValue,
    clearErrors,
    getFieldState,
    formState,
    getValues,
    trigger,
  } = useFormContext<SecurityAssetFormValues>();

  const { mutateAsync: generateMutateAsync, isPending } =
    useGenerateInlineTLSMutation();

  const handleGenerate = async () => {
    const isServerNameValid = await trigger("serverName");

    if (!isServerNameValid) {
      clientToast.error("Укажите serverName для генерации TLS", {
        duration: 3000,
      });
      return;
    }

    try {
      const serverName = getValues("serverName");
      if (!serverName) {
        clientToast.error("Укажите serverName для генерации TLS", {
          duration: 3000,
        });
        return;
      }

      const { certificatePem, keyPem } = await generateMutateAsync({
        serverName,
      });

      setValue("source.certificatePem", certificatePem, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("source.keyPem", keyPem, {
        shouldDirty: true,
        shouldValidate: true,
      });

      clearErrors("source.certificatePem");
      clearErrors("source.keyPem");
    } catch {
      clientToast.error("Не удалось сгенерировать TLS", {
        duration: 3000,
      });
    }
  };

  const error = getFieldState("source.keyPem", formState).error;

  return (
    <div className="mb-4">
      <TLSInlineTools
        error={error?.message}
        loading={isPending}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
