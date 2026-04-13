ALTER TABLE inbound_vless
ADD COLUMN multiplex_enabled INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_vless
ADD COLUMN multiplex_padding INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_vless
ADD COLUMN multiplex_brutal_enabled INTEGER NOT NULL DEFAULT 0;

ALTER TABLE inbound_vless
ADD COLUMN multiplex_brutal_up_mbps REAL NOT NULL DEFAULT 0;

ALTER TABLE inbound_vless
ADD COLUMN multiplex_brutal_down_mbps REAL NOT NULL DEFAULT 0;
