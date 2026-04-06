ALTER TABLE inbound_users ADD COLUMN internal_name TEXT;
ALTER TABLE inbound_users ADD COLUMN display_name TEXT;

UPDATE inbound_users
SET
  internal_name = name,
  display_name = name;
