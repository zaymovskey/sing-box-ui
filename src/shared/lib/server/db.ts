import Database from "better-sqlite3";

import { runMigrations } from "@/db/migrate";

const dbPath = process.env.SQLITE_DB_PATH ?? "/data/app.db";

let db: Database.Database | null = null;
let initialized = false;

function ensureDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
}

export function getDb() {
  ensureDb();

  if (!initialized) {
    runMigrations(db!);
    initialized = true;
  }

  return db!;
}
