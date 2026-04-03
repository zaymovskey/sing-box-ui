CREATE TABLE security_asset_tls (
  asset_id TEXT PRIMARY KEY
    REFERENCES security_assets(id)
    ON DELETE CASCADE,

  source_type TEXT NOT NULL CHECK (source_type IN ('inline', 'file')),

  certificate_pem TEXT,
  key_pem TEXT,

  certificate_path TEXT,
  key_path TEXT,

  is_selfsigned_cert INTEGER NOT NULL DEFAULT 0,

  CHECK (
    (source_type = 'inline'
      AND certificate_pem IS NOT NULL
      AND key_pem IS NOT NULL
      AND certificate_path IS NULL
      AND key_path IS NULL)
    OR
    (source_type = 'file'
      AND certificate_path IS NOT NULL
      AND key_path IS NOT NULL
      AND certificate_pem IS NULL
      AND key_pem IS NULL)
  )
);
