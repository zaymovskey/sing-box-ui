import {
  errorJson,
  okJson,
  serverEnv,
  setSessionCookie,
  signSession,
  withApiErrors,
} from "@/shared/lib/server";

type LoginBody = {
  email?: string;
  password?: string;
};

export const POST = withApiErrors(async (req: Request) => {
  const body = (await req.json().catch(() => null)) as LoginBody | null;

  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return errorJson(400, {
      error: {
        message: "Email and password are required",
        code: "INVALID_REQUEST",
      },
    });
  }

  const demoEmail = serverEnv.AUTH_DEMO_EMAIL;
  const demoPassword = serverEnv.AUTH_DEMO_PASSWORD;

  if (email !== demoEmail || password !== demoPassword) {
    return errorJson(401, {
      error: {
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      },
    });
  }

  const token = await signSession({
    sub: "1",
    email,
    role: "admin",
  });

  await setSessionCookie(token);

  return okJson({ ok: true });
});
