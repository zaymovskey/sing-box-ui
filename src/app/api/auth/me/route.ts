import { okJson, withApiErrors, withSession } from "@/shared/lib/server";

export const GET = withSession(
  withApiErrors(async ({ session }) => {
    return okJson({
      id: session.sub,
      email: session.email,
      role: session.role,
    });
  }),
);
