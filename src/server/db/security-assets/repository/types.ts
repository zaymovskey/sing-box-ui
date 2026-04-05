import { type SecurityAssetType } from "@/shared/api/contracts";

export type SecurityAssetRow = {
  id: string;
  name: string;
  kind: SecurityAssetType;
  server_name: string | null;
  created_at: string;
  updated_at: string;
};

export type SecurityAssetTlsRow = {
  asset_id: string;
  source_type: "inline" | "file";
  certificate_pem: string | null;
  key_pem: string | null;
  certificate_path: string | null;
  key_path: string | null;
  is_selfsigned_cert: number;
};

export type SecurityAssetRealityRow = {
  asset_id: string;
  private_key: string;
  short_id: string;
  fingerprint: string;
  spider_x: string | null;
  handshake_server: string;
  handshake_server_port: number;
  max_time_difference: string | null;
  public_key: string;
};
