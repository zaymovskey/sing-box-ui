CREATE TABLE IF NOT EXISTS inbound_hysteria2 (
  inbound_id TEXT PRIMARY KEY
    REFERENCES inbounds(id)
    ON DELETE CASCADE,

  up_mbps REAL,
  down_mbps REAL,
  ignore_client_bandwidth INTEGER,

  obfs_type TEXT,
  obfs_password TEXT,

  masquerade_string TEXT,
  masquerade_type TEXT,
  masquerade_file TEXT,
  masquerade_directory TEXT,
  masquerade_url TEXT,

  bbr_profile TEXT,
  brutal_debug INTEGER
);
