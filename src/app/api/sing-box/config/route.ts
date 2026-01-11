import { NextResponse } from "next/server";

import { readTextFile, serverEnv, sha256 } from "@/shared/lib/server";

type GetConfigResponse = {
  path: string;
  content: string;
  sha256: string;
  mtimeMs: number;
  size: number;
};

export async function GET() {
  const path = serverEnv.SINGBOX_CONFIG_PATH;

  try {
    const { content, stat } = await readTextFile(path);

    const body: GetConfigResponse = {
      path,
      content,
      sha256: sha256(content),
      mtimeMs: stat.mtimeMs,
      size: stat.size,
    };

    return NextResponse.json(body, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        message: "Не удалось прочитать конфиг sing-box",
        code: "SINGBOX_CONFIG_READ_FAILED",
      },
      { status: 500 },
    );
  }
}
