import { type SelectFieldItem } from "@/shared/ui";

import type { SecurityAssetFormValues } from "../../model/security-asset-form.schema";

export const typeItems: SelectFieldItem[] = [
  { label: "TLS", value: "tls" },
  { label: "Reality", value: "reality" },
];

function createMeta() {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export const defaultsByType = {
  tls: (): Extract<SecurityAssetFormValues, { type: "tls" }> => ({
    ...createMeta(),
    type: "tls",
    name: "",
    serverName: "",
    source: {
      sourceType: "file",
      certificatePath: "",
      keyPath: "",
    },
  }),

  reality: (): Extract<SecurityAssetFormValues, { type: "reality" }> => ({
    ...createMeta(),
    type: "reality",
    name: "",
    serverName: "",
    privateKey: "",
    shortId: "",
    _publicKey: "",
  }),
} satisfies Record<
  SecurityAssetFormValues["type"],
  () => SecurityAssetFormValues
>;
