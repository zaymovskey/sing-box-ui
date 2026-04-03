CREATE TABLE security_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('tls', 'reality')),
  server_name TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
