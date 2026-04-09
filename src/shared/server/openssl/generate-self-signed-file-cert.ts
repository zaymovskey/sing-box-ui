import { spawn } from "node:child_process";

type generateSelfSignedFilesCertParams = {
  certificatePath: string;
  keyPath: string;
  commonName: string;
  days?: number;
};

export function generateSelfSignedFilesCert({
  certificatePath,
  keyPath,
  commonName,
  days = 3650,
}: generateSelfSignedFilesCertParams): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("openssl", [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      keyPath,
      "-out",
      certificatePath,
      "-days",
      String(days),
      "-subj",
      `/CN=${commonName}`,
    ]);

    let stderr = "";
    let stdout = "";

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", (error) => {
      reject(new Error(`Не удалось запустить openssl: ${error.message}`));
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `OpenSSL завершился с кодом ${code}. stderr: ${stderr || "<empty>"}. stdout: ${stdout || "<empty>"}`,
        ),
      );
    });
  });
}
