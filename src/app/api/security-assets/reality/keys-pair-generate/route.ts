import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { RealityKeysPairResponseSchema } from "@/shared/api/contracts";
import { ServerApiError, withRoute } from "@/shared/server";

export const POST = withRoute({
  auth: true,
  responseSchema: RealityKeysPairResponseSchema,
  handler: async () => {
    try {
      return await generateRealityKeypair();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось сгенерировать пару Reality-ключей";

      throw new ServerApiError(
        500,
        "SINGBOX_REALITY_KEYPAIR_GENERATE_FAILED",
        message,
      );
    }
  },
});

const execFileAsync = promisify(execFile);

type GenerateRealityKeypairResult = {
  privateKey: string;
  publicKey: string;
};

function parseRealityKeypairOutput(
  stdout: string,
): GenerateRealityKeypairResult {
  const privateKeyMatch = stdout.match(/PrivateKey:\s*(.+)/i);
  const publicKeyMatch = stdout.match(/PublicKey:\s*(.+)/i);

  if (!privateKeyMatch || !publicKeyMatch) {
    throw new Error(
      "Не удалось распарсить вывод sing-box generate reality-keypair",
    );
  }

  return {
    privateKey: privateKeyMatch[1].trim(),
    publicKey: publicKeyMatch[1].trim(),
  };
}

export async function generateRealityKeypair(): Promise<GenerateRealityKeypairResult> {
  const { stdout, stderr } = await execFileAsync("sing-box", [
    "generate",
    "reality-keypair",
  ]);

  if (stderr?.trim()) {
    throw new Error(`sing-box stderr: ${stderr.trim()}`);
  }

  return parseRealityKeypairOutput(stdout);
}
