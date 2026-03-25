import type z from "zod";

import { type Config, ConfigSchema } from "@/shared/api/contracts";

export function configValidation(
  config: Config,
): [Set<string>, z.core.$ZodIssue[]] {
  const resOfParse = ConfigSchema.safeParse(config);
  if (!resOfParse.success) {
    const invalidKeys = new Set(
      resOfParse.error.issues.map((issue) => {
        return issue.path.join(".");
      }),
    );

    return [invalidKeys, resOfParse.error.issues];
  }

  return [new Set<string>(), []];
}
