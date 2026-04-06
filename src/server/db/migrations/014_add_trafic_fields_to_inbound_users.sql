ALTER TABLE inbound_users
ADD COLUMN up_traffic_total INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_users
ADD COLUMN down_traffic_total INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_users
ADD COLUMN last_seen_up_counter INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_users
ADD COLUMN last_seen_down_counter INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_users
ADD COLUMN last_up_traffic_at TEXT;

ALTER TABLE inbound_users
ADD COLUMN last_down_traffic_at TEXT;
