import { type SecurityAsset } from "@/shared/api/contracts";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";

export function mapFormToSecurityAsset(
  values: SecurityAssetFormValues,
): SecurityAsset {
  const now = new Date().toISOString();

  if (values.type === "tls") {
    return {
      id: values.id ?? crypto.randomUUID(),
      name: values.name,
      type: "tls",
      createdAt: values.createdAt ?? now,
      updatedAt: now,
      serverName: values.serverName || undefined,
      source:
        values.source.sourceType === "inline"
          ? {
              sourceType: "inline",
              certificatePem: values.source.certificatePem,
              keyPem: values.source.keyPem,
            }
          : {
              sourceType: "file",
              certificatePath: values.source.certificatePath,
              keyPath: values.source.keyPath,
            },
    };
  }

  return {
    id: values.id ?? crypto.randomUUID(),
    name: values.name,
    type: "reality",
    createdAt: values.createdAt ?? now,
    updatedAt: now,
    serverName: values.serverName,
    privateKey: values.privateKey,
    shortId: values.shortId,
    publicKey: values.publicKey || undefined,
  };
}

export function mapSecurityAssetToFormValues(
  asset: SecurityAsset,
): SecurityAssetFormValues {
  if (asset.type === "tls") {
    return {
      id: asset.id,
      name: asset.name,
      type: "tls",
      createdAt: asset.createdAt,
      serverName: asset.serverName ?? "",
      source:
        asset.source.sourceType === "inline"
          ? {
              sourceType: "inline",
              certificatePem: asset.source.certificatePem,
              keyPem: asset.source.keyPem,
            }
          : {
              sourceType: "file",
              certificatePath: asset.source.certificatePath,
              keyPath: asset.source.keyPath,
            },
    };
  }

  return {
    id: asset.id,
    name: asset.name,
    type: "reality",
    createdAt: asset.createdAt,
    serverName: asset.serverName,
    privateKey: asset.privateKey,
    shortId: asset.shortId,
    publicKey: asset.publicKey ?? "",
  };
}
