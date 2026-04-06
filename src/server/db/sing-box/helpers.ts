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
  masquerade_string: string | null;
  masquerade_type: string | null;
  masquerade_file: string | null;
  masquerade_directory: string | null;
  masquerade_url: string | null;
}): StoredHysteria2Inbound["masquerade"] | undefined {
  if (row.masquerade_string) {
    return row.masquerade_string;
  }

  const hasObjectFields =
    row.masquerade_type ||
    row.masquerade_file ||
    row.masquerade_directory ||
    row.masquerade_url;

  if (!hasObjectFields) {
    return undefined;
  }

  return {
    type: row.masquerade_type ?? undefined,
    file: row.masquerade_file ?? undefined,
    directory: row.masquerade_directory ?? undefined,
    url: row.masquerade_url ?? undefined,
  };
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
  masquerade_string: string | null;
  masquerade_type: string | null;
  masquerade_file: string | null;
  masquerade_directory: string | null;
  masquerade_url: string | null;
} {
  if (!masquerade) {
    return {
      masquerade_string: null,
      masquerade_type: null,
      masquerade_file: null,
      masquerade_directory: null,
      masquerade_url: null,
    };
  }

  if (typeof masquerade === "string") {
    return {
      masquerade_string: masquerade,
      masquerade_type: null,
      masquerade_file: null,
      masquerade_directory: null,
      masquerade_url: null,
    };
  }

  return {
    masquerade_string: null,
    masquerade_type: masquerade.type ?? null,
    masquerade_file: masquerade.file ?? null,
    masquerade_directory: masquerade.directory ?? null,
    masquerade_url: masquerade.url ?? null,
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
