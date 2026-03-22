import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { clientToast } from "@/shared/ui";

import { useVlessTlsGenerateMutation } from "../../../model/commands/vless/vless-tls-generate.mutation";
import { VlessTlsTools } from "./VlessTlsTools";

export function VlessTlsToolsSection() {
  const { control, setValue, clearErrors } =
    useFormContext<InboundFormValues>();

  const { mutateAsync: generateMutateAsync, isPending } =
    useVlessTlsGenerateMutation();

  const tlsEnabled = useWatch({
    control,
    name: "tls_enabled",
  });

  const realityEnabled = useWatch({
    control,
    name: "reality_enabled",
  });

  const handleGenerate = async () => {
    try {
      const { privateKey, publicKey } = await generateMutateAsync();
      setValue("reality_private_key", privateKey, { shouldDirty: true });
      setValue("_reality_public_key", publicKey, { shouldDirty: true });
      clearErrors("reality_private_key");
      clearErrors("_reality_public_key");
    } catch {
      clientToast.error("Не удалось сгенерировать ключи", {
        duration: 2000,
      });
    }
  };

  const form = useFormContext<InboundFormValues>();

  const error = form.getFieldState("reality_private_key", form.formState).error;

  return (
    <div className="mb-4">
      <VlessTlsTools
        disabled={!tlsEnabled || !realityEnabled}
        error={error?.message}
        loading={isPending}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
