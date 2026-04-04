import { type SecurityAsset } from "@/shared/api/contracts";

export type SecurityAssetRow = {
  name: string | null;
  type: "tls" | "reality" | null;
  serverName: string | null;
  sourceType: "inline" | "file" | null;
  updatedAt: string | null;
  securityAsset: SecurityAsset;
};
