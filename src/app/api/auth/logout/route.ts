import { clearSessionCookie, okJson, withApiErrors } from "@/shared/lib/server";

export const POST = withApiErrors(async () => {
  await clearSessionCookie();
  return okJson({ ok: true });
});
