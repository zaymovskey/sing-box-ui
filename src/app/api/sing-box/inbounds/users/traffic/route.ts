// import fs from "node:fs/promises";

// import {
//   type StoredInbound,
//   InboundUserConntectionStatusResponseSchema,
// } from "@/shared/api/contracts";
// import { getServerEnv, withRoute } from "@/shared/lib/server";

// export const GET = withRoute({
//   auth: true,
//   responseSchema: InboundUserConntectionStatusResponseSchema,
//   handler: async () => {
//     const serverEnv = getServerEnv();
//     const draftPath = serverEnv.SINGBOX_DRAFT_CONFIG_PATH;

//     const draftContent = await fs.readFile(draftPath, "utf-8");
//     const rawDraftContent = JSON.parse(draftContent);

//     const rawDraftConfig = JSON.parse(draftContent) as {
//       inbounds?: StoredInbound[];
//     };
//   },
// });
export async function GET() {
  return Response.json({ message: "Not implemented yet" }, { status: 501 });
}
