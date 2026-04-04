import { type SecurityAsset } from "@/shared/api/contracts";
import { clientEnv, generateClientUuid } from "@/shared/lib";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";

export function mapFormToSecurityAsset(
  values: SecurityAssetFormValues,
  meta?: {
    id?: string;
    createdAt?: string;
  },
): SecurityAsset {
  const now = new Date().toISOString();

  if (values.type === "tls") {
    return {
      id: meta?.id ?? generateClientUuid(),
      name: values.name,
      type: "tls",
      createdAt: meta?.createdAt ?? now,
      updatedAt: now,
      serverName: values.serverName || undefined,
      source:
        values.source.sourceType === "inline"
          ? {
              sourceType: "inline",
              certificatePem: values.source.certificatePem,
              keyPem: values.source.keyPem,
              _is_selfsigned_cert: true,
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
    id: meta?.id ?? generateClientUuid(),
    name: values.name,
    type: "reality",
    createdAt: meta?.createdAt ?? now,
    updatedAt: now,
    serverName: values.serverName,
    privateKey: values.privateKey,
    shortId: values.shortId,
    fingerprint: values.fingerprint,
    spiderX: values.spiderX || undefined,
    handshake: {
      server: values.handshakeServer,
      serverPort: values.handshakeServerPort,
    },
    maxTimeDifference: values.maxTimeDifference || undefined,
    _publicKey: values._publicKey,
  };
}

export function mapSecurityAssetToFormValues(
  asset: SecurityAsset,
): SecurityAssetFormValues {
  if (asset.type === "tls") {
    return {
      type: "tls",
      serverName: asset.serverName ?? "",
      name: asset.name,
      source:
        asset.source.sourceType === "inline"
          ? {
              sourceType: "inline",
              certificatePem: asset.source.certificatePem,
              keyPem: asset.source.keyPem,
            }
          : {
              sourceType: "file",
              certificatePath: asset.source.certificatePath.replace(
                clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR,
                "",
              ),
              keyPath: asset.source.keyPath.replace(
                clientEnv.NEXT_PUBLIC_SINGBOX_CERTS_DIR,
                "",
              ),
              _tlsChecked: false,
              _is_selfsigned_cert: asset.source._is_selfsigned_cert ?? false,
            },
    };
  }

  return {
    name: asset.name,
    type: "reality",
    serverName: asset.serverName,
    privateKey: asset.privateKey,
    shortId: asset.shortId,
    fingerprint: asset.fingerprint,
    spiderX: asset.spiderX ?? "/",
    handshakeServer: asset.handshake.server,
    handshakeServerPort: asset.handshake.serverPort,
    maxTimeDifference: asset.maxTimeDifference ?? "",
    _publicKey: asset._publicKey ?? "",
  };
}
