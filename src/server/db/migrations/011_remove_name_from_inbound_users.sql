CREATE TABLE inbound_users_new (
  id TEXT PRIMARY KEY,
  inbound_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  internal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  uuid TEXT,
  flow TEXT,
  password TEXT,
  FOREIGN KEY (inbound_id) REFERENCES inbounds(id) ON DELETE CASCADE
);

INSERT INTO inbound_users_new (
  id,
  inbound_id,
  kind,
  sort_order,
  internal_name,
  display_name,
  uuid,
  flow,
  password
)
SELECT
  id,
  inbound_id,
  kind,
  sort_order,
  internal_name,
  display_name,
  uuid,
  flow,
  password
FROM inbound_users;

DROP TABLE inbound_users;

ALTER TABLE inbound_users_new RENAME TO inbound_users;
