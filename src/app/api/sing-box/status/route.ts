import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { isDeepStrictEqual, promisify } from "node:util";

import {
  type SingBoxStatusResponse,
  SingBoxStatusResponseSchema,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

const execFileAsync = promisify(execFile);

export const GET = withRoute({
  auth: true,
  responseSchema: SingBoxStatusResponseSchema,
  handler: async () => {
    const serverEnv = getServerEnv();

    const containerName = serverEnv.SINGBOX_CONTAINER_NAME;
    const singBoxConfigPath = serverEnv.SINGBOX_CONFIG_PATH;

    if (!containerName) {
      throw new ServerApiError(
        500,
        "SINGBOX_CONTAINER_NAME_MISSING",
        "Имя контейнера sing-box не задано в переменных окружения",
      );
    }

    const checkContainerRunningResult =
      await checkContainerRunning(containerName);

    if (checkContainerRunningResult === "error") {
      return {
        status: "error",
        reason: "container_not_running",
      } satisfies SingBoxStatusResponse;
    }
    const checkConfigResult = await checkSingBoxConfig(
      containerName,
      singBoxConfigPath,
    );

    if (checkConfigResult === "error") {
      return {
        status: "error",
        reason: "invalid_config",
      } satisfies SingBoxStatusResponse;
    }

    const checkDraftAppliedResult = await checkDraftApplied();

    if (checkDraftAppliedResult === "error") {
      return {
        status: "error",
        reason: "draft_not_applied",
      } satisfies SingBoxStatusResponse;
    }

    return {
      status: "running",
      reason: "ok",
    } satisfies SingBoxStatusResponse;
  },
});

type CheckResult = "ok" | "error";

const checkContainerRunning = async (
  containerName: string,
): Promise<CheckResult> => {
  const { stdout } = await execFileAsync("docker", [
    "inspect",
    "-f",
    // Взято из docker inspect <container>
    "{{.State.Status}}",
    containerName,
  ]);

  const containerState = stdout.trim();

  if (containerState !== "running") {
    return "error";
  }

  return "ok";
};

const checkSingBoxConfig = async (
  containerName: string,
  configPath: string,
): Promise<CheckResult> => {
  try {
    await execFileAsync("docker", [
      "exec",
      containerName,
      "sing-box",
      "check",
      "-c",
      configPath,
    ]);

    return "ok";
  } catch {
    return "error";
  }
};

const checkDraftApplied = async (): Promise<CheckResult> => {
  const draftPath = getServerEnv().SINGBOX_DRAFT_CONFIG_PATH;
  const configPath = getServerEnv().SINGBOX_CONFIG_PATH;

  try {
    const draft = JSON.parse(await fs.readFile(draftPath, "utf-8"));
    const real = JSON.parse(await fs.readFile(configPath, "utf-8"));

    const isSame = isDeepStrictEqual(draft, real);

    return isSame ? "ok" : "error";
  } catch {
    return "error";
  }
};
