import fs from "node:fs";
import path from "node:path";

import type Database from "better-sqlite3";

type MigrationRow = {
  id: string;
};

function ensureMigrationsTable(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
}

function getMigrationFiles(migrationsDir: string): string[] {
  if (!fs.existsSync(migrationsDir)) {
    console.log("[db] migrations dir does not exist:", migrationsDir);
    return [];
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  console.log("[db] migration files:", files);

  return files;
}

function getAppliedMigrationIds(db: Database.Database): Set<string> {
  const rows = db
    .prepare("SELECT id FROM schema_migrations ORDER BY id ASC")
    .all() as MigrationRow[];

  console.log("[db] applied migrations:", rows);

  return new Set(rows.map((row) => row.id));
}

export function runMigrations(db: Database.Database) {
  console.log("[db] running migrations");
  ensureMigrationsTable(db);

  const migrationsDir = path.join(process.cwd(), "src/server/db/migrations");
  console.log("[db] cwd:", process.cwd());
  console.log("[db] migrations dir:", migrationsDir);

  const files = getMigrationFiles(migrationsDir);
  const appliedIds = getAppliedMigrationIds(db);

  for (const file of files) {
    if (appliedIds.has(file)) {
      console.log("[db] skip already applied:", file);
      continue;
    }

    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    console.log("[db] applying migration:", file);
    console.log("[db] sql preview:", sql.slice(0, 200));

    const trx = db.transaction(() => {
      db.exec(sql);

      db.prepare(
        `
        INSERT INTO schema_migrations (id, applied_at)
        VALUES (?, ?)
      `,
      ).run(file, new Date().toISOString());
    });

    trx();

    console.log("[db] applied migration:", file);
  }
}
