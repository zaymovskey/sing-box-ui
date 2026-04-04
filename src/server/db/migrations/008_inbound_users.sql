CREATE TABLE IF NOT EXISTS inbound_users (
  id TEXT PRIMARY KEY,
  inbound_id TEXT NOT NULL
    REFERENCES inbounds(id)
    ON DELETE CASCADE,

  kind TEXT NOT NULL CHECK (kind IN ('vless', 'hysteria2')),
  sort_order INTEGER NOT NULL,

  name TEXT,

  uuid TEXT,
  flow TEXT,

  password TEXT
);

CREATE INDEX IF NOT EXISTS idx_inbound_users_inbound_id
  ON inbound_users(inbound_id);
