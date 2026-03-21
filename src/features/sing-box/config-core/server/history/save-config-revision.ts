import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type SaveConfigRevisionParams = {
  historyDirPath: string;
  currentConfig: unknown;
  action: string;
  label: string;
};

export async function saveConfigRevision({
  historyDirPath,
  currentConfig,
  action,
  label,
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
}
