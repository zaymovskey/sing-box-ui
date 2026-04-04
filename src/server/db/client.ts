import fs from "node:fs";

import Database from "better-sqlite3";

import { runMigrations } from "./migrate";

const dbPath = process.env.SQLITE_DB_PATH ?? "/data/app.db";
console.log("dbPath:", dbPath);

let db: Database.Database | null = null;

function openDb() {
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
}

function ensureDb() {
  const dbFileExists = fs.existsSync(dbPath);

  if (!db) {
    openDb();
    return;
  }

  if (!dbFileExists) {
    db.close();
    openDb();
  }
}

export function getDb() {
  ensureDb();
  runMigrations(db!);
  return db!;
}
