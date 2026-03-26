import { type Config, ConfigSchema } from "@/shared/api/contracts";
import { type IssueLike } from "@/shared/lib";

export function configValidation(
  rawConfig: unknown,
): [Set<string>, IssueLike[]] {
  const schemaIssues: IssueLike[] = [];

  const parseResult = ConfigSchema.safeParse(rawConfig);

  if (!parseResult.success) {
    schemaIssues.push(...parseResult.error.issues);
  }

  const businessIssues: IssueLike[] = parseResult.success
    ? [
        ...uniqueInboundTagsValidation(parseResult.data),
        ...uniqueVlessUsersUuidValidation(parseResult.data),
        ...uniqueHy2UsersNameValidation(parseResult.data),
      ]
    : [];

  const allIssues = [...schemaIssues, ...businessIssues];

  const invalidKeys = getInvalidKeysFromIssues(allIssues);

  return [invalidKeys, allIssues];
}

const issuePathToString = (path: PropertyKey[]) => path.map(String).join(".");

const getInvalidKeysFromIssues = (issues: IssueLike[]) => {
  const invalidKeys = new Set<string>();

  issues.forEach((issue) => {
    invalidKeys.add(issuePathToString(issue.path));
  });

  return invalidKeys;
};

const uniqueInboundTagsValidation = (config: Config): IssueLike[] => {
  const inbounds = config.inbounds;
  if (!inbounds) return [];

  const tagCount = new Map<string, number>();

  // Считаем количество инбаундов с каждым тегом
  inbounds.forEach((inbound) => {
    const tag = inbound.tag;
    if (!tag) return;

    tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
  });

  const issues: IssueLike[] = [];

  // Проверяем, есть ли теги, которые используются более одного раза
  inbounds.forEach((inbound, index) => {
    const tag = inbound.tag;
    if (!tag) return;

    if ((tagCount.get(tag) ?? 0) > 1) {
      issues.push({
        code: "custom",
        path: ["inbounds", index, "tag"],
        message: "Tag должен быть уникальным",
      });
    }
  });

  return issues;
};

const uniqueVlessUsersUuidValidation = (config: Config): IssueLike[] => {
  const inbounds = config.inbounds;
  if (!inbounds) return [];

  const issues: IssueLike[] = [];

  inbounds.forEach((inbound, inboundIndex) => {
    if (inbound.type !== "vless") return;
    if (!("users" in inbound) || !Array.isArray(inbound.users)) return;

    const uuidCount = new Map<string, number>();

    inbound.users.forEach((user) => {
      if (!user || typeof user.uuid !== "string") return;

      uuidCount.set(user.uuid, (uuidCount.get(user.uuid) ?? 0) + 1);
    });

    inbound.users.forEach((user, userIndex) => {
      if (!user || typeof user.uuid !== "string") return;

      if ((uuidCount.get(user.uuid) ?? 0) > 1) {
        issues.push({
          code: "custom",
          path: ["inbounds", inboundIndex, "users", userIndex, "uuid"],
          message: "UUID должен быть уникальным внутри inbound",
        });
      }
    });
  });

  return issues;
};

const uniqueHy2UsersNameValidation = (config: Config): IssueLike[] => {
  const inbounds = config.inbounds;
  if (!inbounds) return [];

  const issues: IssueLike[] = [];

  inbounds.forEach((inbound, inboundIndex) => {
    if (inbound.type !== "hysteria2") return;
    if (!("users" in inbound) || !Array.isArray(inbound.users)) return;

    const uuidCount = new Map<string, number>();

    inbound.users.forEach((user) => {
      if (!user || typeof user.name !== "string") return;

      uuidCount.set(user.name, (uuidCount.get(user.name) ?? 0) + 1);
    });

    inbound.users.forEach((user, userIndex) => {
      if (!user || typeof user.name !== "string") return;

      if ((uuidCount.get(user.name) ?? 0) > 1) {
        issues.push({
          code: "custom",
          path: ["inbounds", inboundIndex, "users", userIndex, "name"],
          message: "name должен быть уникальным внутри inbound",
        });
      }
    });
  });

  return issues;
};
