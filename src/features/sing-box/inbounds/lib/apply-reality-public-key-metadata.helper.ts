import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type Config } from "@/shared/api/contracts";

export function applyRealityPublicKeyMetadata(
  config: Config,
  values: Extract<InboundFormValues, { type: "vless" }>,
): Config {
  if (!values.reality_enabled) {
    return config;
  }

  if (!values.reality_private_key || !values._reality_public_key) {
    return config;
  }

  return {
    ...config,
    _panel: {
      ...config._panel,
      realityPublicKeys: {
        ...config._panel?.realityPublicKeys,
        [values.reality_private_key]: values._reality_public_key,
      },
    },
  };
}
