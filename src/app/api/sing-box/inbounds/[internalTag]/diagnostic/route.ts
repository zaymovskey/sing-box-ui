import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

import z from "zod";

import { getNetworkProtocol } from "@/features/sing-box/inbounds";
import { getStoredInboundDetailsByInternalTag } from "@/server/db/sing-box/inbounds";
import {
  type InboundDiagnostic,
  InboundDiagnosticRequestSchema,
  InboundDiagnosticResponseSchema,
  type RuntimeConfig,
} from "@/shared/api/contracts";
import { getServerEnv, ServerApiError, withRoute } from "@/shared/server";

const TagParamsSchema = z.object({
  internalTag: z.string().min(1),
});

export const POST = withRoute({
  auth: true,
  paramsSchema: TagParamsSchema,
  responseSchema: InboundDiagnosticResponseSchema,
  requestSchema: InboundDiagnosticRequestSchema,
  handler: async ({ params, body }) => {
    const { internalTag } = params;
    const storedInbound = getStoredInboundDetailsByInternalTag(internalTag);

    if (!storedInbound) {
      throw new ServerApiError(404, "INBOUND_NOT_FOUND", "Inbound not found");
    }

    const { SINGBOX_CONFIG_PATH } = getServerEnv();
    const raw = await fs.readFile(SINGBOX_CONFIG_PATH, "utf-8");
    const config = JSON.parse(raw) as RuntimeConfig;
    const runtimeInbound = config.inbounds?.find(
      (inbound) => inbound.tag === internalTag,
    );

    if (!runtimeInbound) {
      throw new ServerApiError(
        409,
        "INBOUND_NOT_APPLIED",
        "Inbound exists in draft but is not applied to runtime config",
      );
    }

    const { diagnostics } = body;

    if (diagnostics.length === 0) {
      throw new ServerApiError(
        400,
        "INVALID_REQUEST",
        "No diagnostics provided",
      );
    }

    const diagnosticsResults: InboundDiagnostic[] = [];

    if (diagnostics.includes("port_listening")) {
      try {
        const portListening = await isPortListening(
          runtimeInbound.listen_port,
          getNetworkProtocol(runtimeInbound.type),
        );

        diagnosticsResults.push({
          key: "port_listening",
          title: "Port Listening",
          status: portListening ? "pass" : "error",
          message: portListening
            ? "Port is listening"
            : "Port is not listening",
          checkedAt: new Date().toISOString(),
          source: "live",
          details: {
            reason: portListening ? undefined : "not_listening",
            port: runtimeInbound.listen_port,
          },
        });
      } catch {
        diagnosticsResults.push({
          key: "port_listening",
          title: "Failed to check if port is listening",
          status: "error",
          message: "Failed to check if port is listening",
          checkedAt: new Date().toISOString(),
          source: "live",
          details: {
            reason: "command_failed",
            port: runtimeInbound.listen_port,
          },
        });
      }
    }

    return diagnosticsResults;
  },
});

async function isPortListening(
  port: number,
  protocol: "tcp" | "udp" | "tcp-udp",
): Promise<boolean> {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Invalid port");
  }

  const command =
    protocol === "tcp"
      ? ["-H", "-ltn", `sport = :${port}`]
      : protocol === "udp"
        ? ["-H", "-lun", `sport = :${port}`]
        : ["-H", "-ltun", `sport = :${port}`];

  const { stdout } = await execFileAsync("ss", command, {
    timeout: 2000,
  });

  return stdout.trim().length > 0;
}
