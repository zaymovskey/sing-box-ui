import { type SecurityAsset } from "@/shared/api/contracts";
import { clientEnv } from "@/shared/lib";

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
              certificatePath:
                clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR +
                values.source.certificatePath,
              keyPath:
                clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR + values.source.keyPath,
              _is_selfsigned_cert: values.source._is_selfsigned_cert,
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
    _publicKey: values._publicKey || undefined,
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
    _publicKey: asset._publicKey ?? "",
  };
}
