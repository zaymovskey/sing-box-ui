import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";

import { VlessTlsTools } from "./VlessTlsTools";

export function VlessTlsToolsSection() {
  const { control } = useFormContext<InboundFormValues>();

  const tlsEnabled = useWatch({
    control,
    name: "tls_enabled",
  });

  const realityEnabled = useWatch({
    control,
    name: "reality_enabled",
  });

  return (
    <div className="mb-4">
      <VlessTlsTools disabled={!tlsEnabled || !realityEnabled} />
    </div>
  );
}
