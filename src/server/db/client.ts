import fs from "node:fs";

import Database from "better-sqlite3";

import { getServerEnv } from "@/shared/lib/server";

import { runMigrations } from "./migrate";

let db: Database.Database | null = null;

function openDb() {
  const serverEnv = getServerEnv();
  db = new Database(serverEnv.SQLITE_DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
}

function ensureDb() {
  const serverEnv = getServerEnv();
  const dbFileExists = fs.existsSync(serverEnv.SQLITE_DB_PATH);

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
