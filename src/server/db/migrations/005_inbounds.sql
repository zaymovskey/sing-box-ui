CREATE TABLE IF NOT EXISTS inbounds (
  id TEXT PRIMARY KEY,
  tag TEXT UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('vless', 'hysteria2')),

  listen TEXT,
  listen_port INTEGER,
  sniff INTEGER,
  sniff_override_destination INTEGER,

  security_asset_id TEXT
    REFERENCES security_assets(id)
    ON DELETE SET NULL,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inbounds_type
  ON inbounds(type);

CREATE INDEX IF NOT EXISTS idx_inbounds_security_asset_id
  ON inbounds(security_asset_id);
