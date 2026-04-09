import { spawn } from "node:child_process";

export type Protocol = "tcp" | "udp";

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: "pipe" });

    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `${command} exited with code ${code}`));
    });
  });
}

export async function allowPort(port: number, protocol: Protocol) {
  await run("iptables", [
    "-C",
    "INPUT",
    "-p",
    protocol,
    "--dport",
    String(port),
    "-j",
    "ACCEPT",
  ]).catch(async () => {
    await run("iptables", [
      "-A",
      "INPUT",
      "-p",
      protocol,
      "--dport",
      String(port),
      "-j",
      "ACCEPT",
    ]);
  });
}

export async function removePort(port: number, protocol: Protocol) {
  await run("iptables", [
    "-C",
    "INPUT",
    "-p",
    protocol,
    "--dport",
    String(port),
    "-j",
    "ACCEPT",
  ])
    .then(async () => {
      await run("iptables", [
        "-D",
        "INPUT",
        "-p",
        protocol,
        "--dport",
        String(port),
        "-j",
        "ACCEPT",
      ]);
    })
    .catch(() => {
      // правила нет — считаем ок
    });
}
