import { execFile } from "node:child_process";
import { promisify } from "node:util";

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

    console.log("checkContainerRunningResult", checkContainerRunningResult);

    const checkConfigResult = await checkSingBoxConfig(
      containerName,
      singBoxConfigPath,
    );

    console.log("checkConfigResult", checkConfigResult);

    return {
      status: "running",
      reason: "ok",
    } satisfies SingBoxStatusResponse;
  },
});

// 1. "service_unreachable"  await fetch("http://sing-box:9090")
// 2. Применен ли последняя ревизия конфига

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
    const { stdout } = await execFileAsync("docker", [
      "exec",
      containerName,
      "sing-box",
      "check",
      "-c",
      configPath,
    ]);
    console.log("stdout", stdout);
  } catch (error) {
    console.error("Error checking sing-box config", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new ServerApiError(
      500,
      "SINGBOX_CHECK_CONFIG_ERROR",
      `Ошибка при проверке конфигурации sing-box: ${errorMessage}`,
    );
  }

  return "ok";
};
