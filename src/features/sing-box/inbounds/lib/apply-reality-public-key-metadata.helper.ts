import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type ConfigWithMetadata } from "@/shared/api/contracts";

export function applyRealityPublicKeyMetadata(
  configWithMetadata: ConfigWithMetadata,
  values: Extract<InboundFormValues, { type: "vless" }>,
): ConfigWithMetadata {
  if (!values.reality_enabled) {
    return configWithMetadata;
  }

  if (!values.reality_private_key || !values._reality_public_key) {
    return configWithMetadata;
  }

  return {
    ...configWithMetadata,
    metadata: {
      ...configWithMetadata.metadata,
      realityPublicKeys: {
        ...configWithMetadata.metadata?.realityPublicKeys,
        [values.reality_private_key]: values._reality_public_key,
      },
    },
  };
}
