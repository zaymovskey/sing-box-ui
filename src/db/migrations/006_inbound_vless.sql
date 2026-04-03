CREATE TABLE IF NOT EXISTS inbound_vless (
  inbound_id TEXT PRIMARY KEY
    REFERENCES inbounds(id)
    ON DELETE CASCADE,

  tls_enabled INTEGER,
  reality_public_key TEXT
);
