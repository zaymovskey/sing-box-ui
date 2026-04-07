import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { runMigrations } from "./migrate";

const dbPath = process.env.SQLITE_DB_PATH ?? "/data/app.db";

const snapshotsDir = path.join(path.dirname(dbPath), "snapshots");
const latestSnapshotPath = path.join(snapshotsDir, "latest.db");
const latestSnapshotTmpPath = path.join(snapshotsDir, "latest.tmp.db");

let rawDb: Database.Database | null = null;
let wrappedDb: Database.Database | null = null;
let migrationsRan = false;

let snapshotTimer: NodeJS.Timeout | null = null;
let snapshotInProgress = false;
let snapshotRequestedWhileRunning = false;

function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

function ensureSnapshotsDir() {
  fs.mkdirSync(snapshotsDir, { recursive: true });
}

function isWriteSql(sqlText: string) {
  const normalized = sqlText.trim().toUpperCase();

  return (
    normalized.startsWith("INSERT") ||
    normalized.startsWith("UPDATE") ||
    normalized.startsWith("DELETE") ||
    normalized.startsWith("REPLACE") ||
    normalized.startsWith("CREATE") ||
    normalized.startsWith("ALTER") ||
    normalized.startsWith("DROP")
  );
}

function createLatestSnapshot() {
  ensureSnapshotsDir();

  if (fs.existsSync(latestSnapshotTmpPath)) {
    fs.rmSync(latestSnapshotTmpPath, { force: true });
  }

  const snapshotDb = new Database(dbPath);

  try {
    snapshotDb.pragma("busy_timeout = 5000");
    snapshotDb.exec(
      `VACUUM INTO '${latestSnapshotTmpPath.replace(/\\/g, "/")}'`,
    );

    /**
     * Идея такая:
     * 1) создаём новый снимок во временный файл
     * 2) потом атомарно подменяем latest.db
     *
     * Для клиента, который уже открыл latest.db:
     * - старый файловый дескриптор не ломается
     * - просто останется смотреть старую версию, пока не переподключится
     *
     * Для новых открытий:
     * - откроется уже новый latest.db
     */
    fs.renameSync(latestSnapshotTmpPath, latestSnapshotPath);
  } finally {
    snapshotDb.close();

    if (fs.existsSync(latestSnapshotTmpPath)) {
      fs.rmSync(latestSnapshotTmpPath, { force: true });
    }
  }
}

function flushSnapshot() {
  if (!isDevelopment()) {
    return;
  }

  if (snapshotInProgress) {
    snapshotRequestedWhileRunning = true;
    return;
  }

  snapshotInProgress = true;

  try {
    createLatestSnapshot();
  } catch (error) {
    console.error("[db snapshot] failed to create latest snapshot:", error);
  } finally {
    snapshotInProgress = false;

    if (snapshotRequestedWhileRunning) {
      snapshotRequestedWhileRunning = false;
      scheduleSnapshot();
    }
  }
}

function scheduleSnapshot() {
  if (!isDevelopment()) {
    return;
  }

  if (snapshotTimer) {
    return;
  }

  /**
   * Небольшой debounce нужен, чтобы при серии write-операций
   * не долбить VACUUM INTO на каждый чих.
   *
   * Но при этом снапшот всё равно будет почти "после каждого изменения"
   * с практической точки зрения.
   */
  snapshotTimer = setTimeout(() => {
    snapshotTimer = null;
    flushSnapshot();
  }, 300);
}

function wrapStatement<T extends Database.Statement>(
  stmt: T,
  sqlText: string,
): T {
  const shouldScheduleSnapshot = isWriteSql(sqlText);

  return new Proxy(stmt, {
    get(target, prop, receiver) {
      if (prop === "run") {
        return (...args: unknown[]) => {
          const result = target.run(...args);

          if (shouldScheduleSnapshot) {
            scheduleSnapshot();
          }

          return result;
        };
      }

      const value = Reflect.get(target, prop, receiver);

      if (typeof value === "function") {
        return value.bind(target);
      }

      return value;
    },
  }) as T;
}

function wrapDb(database: Database.Database): Database.Database {
  return new Proxy(database, {
    get(target, prop, receiver) {
      if (prop === "prepare") {
        return (sqlText: string) => {
          const stmt = target.prepare(sqlText);
          return wrapStatement(stmt, sqlText);
        };
      }

      if (prop === "exec") {
        return (sqlText: string) => {
          const result = target.exec(sqlText);

          if (isWriteSql(sqlText)) {
            scheduleSnapshot();
          }

          return result;
        };
      }

      if (prop === "transaction") {
        return <T extends (...args: never[]) => unknown>(fn: T) => {
          const tx = target.transaction(fn);

          return ((...args: Parameters<typeof tx>): ReturnType<typeof tx> => {
            const result = tx(...args);
            scheduleSnapshot();
            return result;
          }) as typeof tx;
        };
      }

      const value = Reflect.get(target, prop, receiver);

      if (typeof value === "function") {
        return value.bind(target);
      }

      return value;
    },
  }) as Database.Database;
}

function openDb() {
  rawDb = new Database(dbPath);
  rawDb.pragma("journal_mode = WAL");
  rawDb.pragma("foreign_keys = ON");

  wrappedDb = wrapDb(rawDb);
  migrationsRan = false;
}

function ensureDb() {
  const dbFileExists = fs.existsSync(dbPath);

  if (!rawDb) {
    openDb();
    return;
  }

  if (!dbFileExists) {
    rawDb.close();
    openDb();
  }
}

export function getDb() {
  ensureDb();

  if (!migrationsRan) {
    runMigrations(rawDb!);
    migrationsRan = true;
  }

  return wrappedDb!;
}
