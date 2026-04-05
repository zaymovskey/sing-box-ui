ALTER TABLE inbounds ADD COLUMN internal_tag TEXT;
ALTER TABLE inbounds ADD COLUMN display_tag TEXT;

UPDATE inbounds
SET
  internal_tag = tag,
  display_tag = tag;
