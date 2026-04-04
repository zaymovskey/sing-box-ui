import { generateClientUuid } from "@/shared/lib";
import { type SelectFieldItem } from "@/shared/ui";

import type { SecurityAssetFormValues } from "../../model/security-asset-form.schema";

export const typeItems: SelectFieldItem[] = [
  { label: "TLS", value: "tls" },
  { label: "Reality", value: "reality" },
];

function createMeta() {
  return {
    id: generateClientUuid(),
    createdAt: new Date().toISOString(),
  };
}

export const defaultsByType = {
  tls: (): Extract<SecurityAssetFormValues, { type: "tls" }> => ({
    ...createMeta(),
    type: "tls",
    name: "",
    serverName: "www.cloudflare.com",
    source: {
      sourceType: "file",
      certificatePath: "certificate.crt",
      keyPath: "key.key",
      _is_selfsigned_cert: false,
      _tlsChecked: false,
    },
  }),

  reality: (): Extract<SecurityAssetFormValues, { type: "reality" }> => ({
    ...createMeta(),
    type: "reality",
    name: "",
    serverName: "www.cloudflare.com",
    privateKey: "",
    shortId: "",
    fingerprint: "chrome",
    spiderX: "/",
    handshakeServer: "www.cloudflare.com",
    handshakeServerPort: 443,
    maxTimeDifference: "",
    _publicKey: "",
  }),
} satisfies Record<
  SecurityAssetFormValues["type"],
  () => SecurityAssetFormValues
>;
