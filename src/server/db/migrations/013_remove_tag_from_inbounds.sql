CREATE TABLE inbounds_new (
  id TEXT PRIMARY KEY,

  display_tag TEXT NOT NULL,
  internal_tag TEXT NOT NULL,

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

INSERT INTO inbounds_new (
  id,
  display_tag,
  internal_tag,
  type,
  listen,
  listen_port,
  sniff,
  sniff_override_destination,
  security_asset_id,
  created_at,
  updated_at
)
SELECT
  id,
  tag AS display_tag,
  tag AS internal_tag,
  type,
  listen,
  listen_port,
  sniff,
  sniff_override_destination,
  security_asset_id,
  created_at,
  updated_at
FROM inbounds;

DROP TABLE inbounds;

ALTER TABLE inbounds_new RENAME TO inbounds;

CREATE INDEX idx_inbounds_type
  ON inbounds(type);

CREATE INDEX idx_inbounds_security_asset_id
  ON inbounds(security_asset_id);

CREATE UNIQUE INDEX idx_inbounds_internal_tag
  ON inbounds(internal_tag);
