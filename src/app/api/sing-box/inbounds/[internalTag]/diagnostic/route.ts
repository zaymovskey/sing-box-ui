import { z } from "zod";

import { withRoute } from "@/shared/server";

export const POST = withRoute({
  auth: true,
  responseSchema: z.object({
    message: z.string(),
  }),
  handler: async () => {
    return {
      message: "Hello, world!",
    };
  },
});
