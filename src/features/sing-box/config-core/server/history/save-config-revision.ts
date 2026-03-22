import fs, { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type SaveConfigRevisionParams = {
  historyDirPath: string;
  currentConfig: unknown;
  action: string;
  label: string;
  maxRevisions?: number;
};

export async function saveConfigRevision({
  historyDirPath,
  currentConfig,
  action,
  label,
  maxRevisions = 20,
}: SaveConfigRevisionParams): Promise<void> {
  await mkdir(historyDirPath, { recursive: true });

  const createdAt = new Date().toISOString();
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const id = `${ts}__${action}`;

  const filePath = path.join(historyDirPath, `${id}.json`);

  const revisionPayload = {
    id,
    createdAt,
    action,
    label,
    config: currentConfig,
  };

  await writeFile(filePath, JSON.stringify(revisionPayload, null, 2), "utf-8");

  if (maxRevisions <= 0) {
    return;
  }

  const entries = await fs.readdir(historyDirPath, { withFileTypes: true });

  const revisionFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));

  const excessCount = revisionFiles.length - maxRevisions;

  if (excessCount <= 0) {
    return;
  }

  const filesToDelete = revisionFiles.slice(0, excessCount);

  await Promise.all(
    filesToDelete.map((filename) =>
      fs.unlink(path.join(historyDirPath, filename)),
    ),
  );
}
