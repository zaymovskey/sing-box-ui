import { spawn } from "node:child_process";

type generateSelfSignedInlineCertParams = {
  commonName: string;
  days?: number;
};

export function generateSelfSignedInlineCert({
  commonName,
  days = 3650,
}: generateSelfSignedInlineCertParams): Promise<{
  certificate: string;
  key: string;
}> {
  return new Promise((resolve, reject) => {
    const child = spawn("openssl", [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-days",
      String(days),
      "-subj",
      `/CN=${commonName}`,
      "-keyout",
      "-",
      "-out",
      "-",
    ]);

    let stdout = "";
    let stderr = "";

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
      if (code !== 0) {
        return reject(
          new Error(
            `OpenSSL завершился с кодом ${code}. stderr: ${stderr || "<empty>"}`,
          ),
        );
      }

      const keyMatch = stdout.match(
        /-----BEGIN PRIVATE KEY-----[\s\S]+?-----END PRIVATE KEY-----/,
      );

      const certMatch = stdout.match(
        /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/,
      );

      if (!keyMatch || !certMatch) {
        return reject(
          new Error(
            `Не удалось распарсить PEM. stdout: ${stdout || "<empty>"}`,
          ),
        );
      }

      resolve({
        key: keyMatch[0].trim(),
        certificate: certMatch[0].trim(),
      });
    });
  });
}
