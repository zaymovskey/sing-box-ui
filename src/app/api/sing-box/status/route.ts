import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { isDeepStrictEqual, promisify } from "node:util";

import {
  type SingBoxStatusCheck,
  type SingBoxStatusResponse,
  SingBoxStatusResponseSchema,
  stripDraftFields,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/lib/server";

const execFileAsync = promisify(execFile);

type CheckResult = { ok: true } | { ok: false; check: SingBoxStatusCheck };

function deriveSingBoxStatusSummary(
  checks: SingBoxStatusCheck[],
): SingBoxStatusResponse["summary"] {
  if (
    checks.some(
      (check) =>
        check.code === "container_not_running" ||
        check.code === "invalid_config",
    )
  ) {
    return "error";
  }

  if (checks.some((check) => check.code === "draft_not_applied")) {
    return "warning";
  }

  return "ok";
}

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

    const checks: SingBoxStatusCheck[] = [];

    const containerStatus = await checkContainerRunning(containerName);

    if (!containerStatus.ok) {
      checks.push(containerStatus.check);
    } else {
      const configStatus = await checkSingBoxConfig(
        containerName,
        singBoxConfigPath,
      );

      if (!configStatus.ok) {
        checks.push(configStatus.check);
      }
    }

    const draftStatus = await checkDraftApplied();

    if (!draftStatus.ok) {
      checks.push(draftStatus.check);
    }

    return {
      summary: deriveSingBoxStatusSummary(checks),
      checks,
    } satisfies SingBoxStatusResponse;
  },
});

const checkContainerRunning = async (
  containerName: string,
): Promise<CheckResult> => {
  try {
    const { stdout } = await execFileAsync("docker", [
      "inspect",
      "-f",
      "{{json .State}}",
      containerName,
    ]);

    const state = JSON.parse(stdout.trim()) as {
      Status?: string;
      Error?: string;
      ExitCode?: number;
    };

    const containerState = state.Status?.trim();

    if (containerState === "running") {
      return { ok: true };
    }

    const inspectError = state.Error?.trim();
    const logsMessage = await getContainerLastLogs(containerName);

    const details =
      inspectError ||
      logsMessage ||
      `Контейнер sing-box не запущен (status: ${containerState ?? "unknown"}, exit code: ${state.ExitCode ?? "unknown"})`;

    return {
      ok: false,
      check: {
        code: "container_not_running",
        message: details,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось проверить состояние контейнера sing-box";

    return {
      ok: false,
      check: {
        code: "container_not_running",
        message,
      },
    };
  }
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

    return { ok: true };
  } catch (error) {
    const message = extractExecErrorMessage(error);

    return {
      ok: false,
      check: {
        code: "invalid_config",
        message: message || "Конфигурация sing-box не проходит проверку",
      },
    };
  }
};

const checkDraftApplied = async (): Promise<CheckResult> => {
  const draftPath = getServerEnv().SINGBOX_DRAFT_CONFIG_PATH;
  const configPath = getServerEnv().SINGBOX_CONFIG_PATH;

  try {
    const rawDraft = JSON.parse(
      await fs.readFile(draftPath, "utf-8"),
    ) as Record<string, unknown>;
    const real = JSON.parse(await fs.readFile(configPath, "utf-8"));

    const strippedDraft = stripDraftFields(rawDraft);
    const isSame = isDeepStrictEqual(strippedDraft, real);
    console.log("isSaame", isSame);

    if (!isSame) {
      return {
        ok: false,
        check: {
          code: "draft_not_applied",
          message: "Перезагрузите sing-box",
        },
      };
    }

    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось сравнить черновик и применённый конфиг";

    return {
      ok: false,
      check: {
        code: "draft_not_applied",
        message,
      },
    };
  }
};

function extractExecErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "";
  }

  const maybeError = error as {
    stderr?: string | Buffer;
    stdout?: string | Buffer;
    message?: string;
  };

  const stderr =
    typeof maybeError.stderr === "string"
      ? maybeError.stderr
      : Buffer.isBuffer(maybeError.stderr)
        ? maybeError.stderr.toString("utf-8")
        : "";

  if (stderr.trim()) {
    return stripAnsi(stderr.trim());
  }

  const stdout =
    typeof maybeError.stdout === "string"
      ? maybeError.stdout
      : Buffer.isBuffer(maybeError.stdout)
        ? maybeError.stdout.toString("utf-8")
        : "";

  if (stdout.trim()) {
    return stripAnsi(stdout.trim());
  }

  return stripAnsi(maybeError.message ?? "");
}

async function getContainerLastLogs(containerName: string): Promise<string> {
  try {
    const { stdout, stderr } = await execFileAsync("docker", [
      "logs",
      "--tail",
      "20",
      containerName,
    ]);

    const output = `${stdout}\n${stderr}`.trim();

    if (!output) {
      return "";
    }

    const lines = output
      .split("\n")
      .map((line) => stripAnsi(line).trim())
      .filter(Boolean);

    return lines.at(-1) ?? "";
  } catch {
    return "";
  }
}

function stripAnsi(input: string): string {
  return (
    input
      // обычные ANSI escape sequences
      .replace(
        // eslint-disable-next-line no-control-regex
        /[\u001B\u009B][[\]()#;?]*(?:(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nq-uy=><~])/g,
        "",
      )
      // на случай уже битой декодировки вида "�[31m"
      .replace(/�\[[0-9;]*m/g, "")
      // на всякий случай остатки "[31m", "[0m" в начале/середине
      .replace(/\[[0-9;]*m/g, "")
  );
}
