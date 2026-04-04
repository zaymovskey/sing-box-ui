ALTER TABLE inbound_users ADD COLUMN total_uplink BIGINT NOT NULL DEFAULT 0;
ALTER TABLE inbound_users ADD COLUMN total_downlink BIGINT NOT NULL DEFAULT 0;
ALTER TABLE inbound_users ADD COLUMN last_raw_uplink BIGINT NOT NULL DEFAULT 0;
ALTER TABLE inbound_users ADD COLUMN last_raw_downlink BIGINT NOT NULL DEFAULT 0;
ALTER TABLE inbound_users ADD COLUMN last_identifier TEXT;
