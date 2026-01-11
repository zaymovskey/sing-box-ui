import fs from "node:fs/promises";

export async function readTextFile(path: string) {
  const [content, stat] = await Promise.all([
    fs.readFile(path, "utf-8"),
    fs.stat(path),
  ]);
  return { content, stat };
}
