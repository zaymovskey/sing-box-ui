import { getDb } from "../client";

export function getAllSecurityAssets() {
  const db = getDb();

  return db
    .prepare(
      `
    SELECT * FROM security_assets
  `,
    )
    .all();
}
