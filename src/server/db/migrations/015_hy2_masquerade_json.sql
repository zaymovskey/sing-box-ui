PRAGMA foreign_keys = OFF;

CREATE TABLE inbound_hysteria2_new (
  inbound_id TEXT PRIMARY KEY
    REFERENCES inbounds(id)
    ON DELETE CASCADE,

  up_mbps REAL,
  down_mbps REAL,
  ignore_client_bandwidth INTEGER,

  obfs_type TEXT,
  obfs_password TEXT,

  masquerade_json TEXT,

  bbr_profile TEXT,
  brutal_debug INTEGER
);

INSERT INTO inbound_hysteria2_new (
  inbound_id,
  up_mbps,
  down_mbps,
  ignore_client_bandwidth,
  obfs_type,
  obfs_password,
  masquerade_json,
  bbr_profile,
  brutal_debug
)
SELECT
  inbound_id,
  up_mbps,
  down_mbps,
  ignore_client_bandwidth,
  obfs_type,
  obfs_password,
  CASE
    WHEN masquerade_string IS NOT NULL THEN json_quote(masquerade_string)
    WHEN (
      masquerade_type IS NOT NULL
      OR masquerade_file IS NOT NULL
      OR masquerade_directory IS NOT NULL
      OR masquerade_url IS NOT NULL
    ) THEN json_object(
      'type', masquerade_type,
      'file', masquerade_file,
      'directory', masquerade_directory,
      'url', masquerade_url
    )
    ELSE NULL
  END,
  bbr_profile,
  brutal_debug
FROM inbound_hysteria2;

DROP TABLE inbound_hysteria2;

ALTER TABLE inbound_hysteria2_new RENAME TO inbound_hysteria2;

PRAGMA foreign_keys = ON;
