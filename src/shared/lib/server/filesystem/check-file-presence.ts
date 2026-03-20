import { constants as fsConstants } from "node:fs";
import { access, stat } from "node:fs/promises";

export async function checkFilePresence(
  filePath: string,
): Promise<"exists" | "not_found" | "no_access"> {
  try {
    const fileStat = await stat(filePath);

    if (!fileStat.isFile()) {
      return "not_found";
    }

    await access(filePath, fsConstants.R_OK);
    return "exists";
  } catch (error) {
    const code =
      typeof error === "object" &&
      error &&
      "code" in error &&
      typeof error.code === "string"
        ? error.code
        : "";

    if (code === "ENOENT") {
      return "not_found";
    }

    if (code === "EACCES" || code === "EPERM") {
      return "no_access";
    }

    return "no_access";
  }
}
