import { useFormContext } from "react-hook-form";

import { clientToast } from "@/shared/ui";

import { useGenerateRealityKeysPairMutation } from "../../../model/mutations/reality-key-pair-generate.mutation";
import { type SecurityAssetFormValues } from "../../../model/security-asset-form.schema";
import { TLSTextTools } from "./TLSTextTools";

export function TLSTextToolsSection() {
  const { setValue, clearErrors, getFieldState, formState } =
    useFormContext<SecurityAssetFormValues>();

  const { mutateAsync: generateMutateAsync, isPending } =
    useGenerateRealityKeysPairMutation();

  const handleGenerate = async () => {
    try {
      const { privateKey, publicKey } = await generateMutateAsync();
      setValue("privateKey", privateKey, { shouldDirty: true });
      setValue("_publicKey", publicKey, { shouldDirty: true });
      clearErrors("privateKey");
      clearErrors("_publicKey");
    } catch {
      clientToast.error("Не удалось сгенерировать ключи", {
        duration: 2000,
      });
    }
  };

  const error = getFieldState("privateKey", formState).error;

  return (
    <div className="mb-4">
      <TLSTextTools
        error={error?.message}
        loading={isPending}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
