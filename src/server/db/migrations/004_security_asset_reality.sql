CREATE TABLE IF NOT EXISTS security_asset_reality (
  asset_id TEXT PRIMARY KEY
    REFERENCES security_assets(id)
    ON DELETE CASCADE,

  private_key TEXT NOT NULL,
  short_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  spider_x TEXT,
  handshake_server TEXT NOT NULL,
  handshake_server_port INTEGER NOT NULL,
  max_time_difference TEXT,
  public_key TEXT NOT NULL
);
