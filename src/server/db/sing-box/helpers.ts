import { randomUUID } from "node:crypto";

import {
  type SaveInboundInput,
  type SecurityAsset,
  type StoredHysteria2Inbound,
  type StoredInbound,
  type StoredVlessInbound,
} from "@/shared/api/contracts";

export function sqliteBoolToBoolean(value: 0 | 1 | null): boolean | undefined {
  if (value === null) {
    return undefined;
  }

  return value === 1;
}

export function mapTlsFromSecurityAssetForVless(
  asset: SecurityAsset | undefined,
  tlsEnabled: boolean | undefined,
  realityPublicKey: string | null,
): StoredVlessInbound["tls"] | undefined {
  if (!tlsEnabled) {
    return undefined;
  }

  if (!asset || asset.type !== "reality") {
    return {
      enabled: true,
      reality: {
        _reality_public_key: realityPublicKey ?? undefined,
      },
    };
  }

  return {
    enabled: true,
    server_name: asset.serverName,
    reality: {
      enabled: true,
      handshake: {
        server: asset.handshake.server,
        server_port: asset.handshake.serverPort,
      },
      private_key: asset.privateKey,
      short_id: asset.shortId,
      max_time_difference: asset.maxTimeDifference ?? undefined,
      _reality_public_key: realityPublicKey ?? asset._publicKey ?? undefined,
    },
  };
}

export function mapTlsFromSecurityAssetForHy2(
  asset: SecurityAsset | undefined,
): StoredHysteria2Inbound["tls"] | undefined {
  if (!asset || asset.type !== "tls") {
    return undefined;
  }

  if (asset.source.sourceType === "inline") {
    return {
      enabled: true,
      server_name: asset.serverName,
      certificate: asset.source.certificatePem,
      key: asset.source.keyPem,
    };
  }

  return {
    enabled: true,
    server_name: asset.serverName,
    certificate_path: asset.source.certificatePath,
    key_path: asset.source.keyPath,
  };
}

export function mapMasqueradeFromRow(row: {
  masquerade_json: string | null;
}): StoredHysteria2Inbound["masquerade"] | undefined {
  if (!row.masquerade_json) {
    return undefined;
  }

  try {
    return JSON.parse(
      row.masquerade_json,
    ) as StoredHysteria2Inbound["masquerade"];
  } catch {
    return undefined;
  }
}

export function booleanToSqliteBool(value: boolean | undefined): 0 | 1 | null {
  if (value === undefined) {
    return null;
  }

  return value ? 1 : 0;
}

export function mapMasqueradeToRow(
  masquerade: StoredHysteria2Inbound["masquerade"],
): {
  masquerade_json: string | null;
} {
  if (!masquerade) {
    return {
      masquerade_json: null,
    };
  }

  return {
    masquerade_json: JSON.stringify(masquerade),
  };
}

export function mapTransportFromRow(row: {
  transport_json: string | null;
}): StoredVlessInbound["transport"] | undefined {
  if (!row.transport_json) {
    return undefined;
  }

  try {
    return JSON.parse(row.transport_json) as StoredVlessInbound["transport"];
  } catch {
    return undefined;
  }
}

export function mapTransportToRow(transport: StoredVlessInbound["transport"]): {
  transport_json: string | null;
} {
  if (!transport) {
    return {
      transport_json: null,
    };
  }

  return {
    transport_json: JSON.stringify(transport),
  };
}

export function ensureInternalNames(input: SaveInboundInput): StoredInbound {
  return {
    ...input,
    users: input.users.map((user) => ({
      ...user,
      internal_name:
        "internal_name" in user && user.internal_name
          ? user.internal_name
          : randomUUID(),
    })),
  } as StoredInbound;
}
