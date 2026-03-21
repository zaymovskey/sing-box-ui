type IsUniqueInboundTagParams = {
  tag: string;
  tags: string[];
  excludeTag?: string;
};

export function isUniqueInboundTag({
  tag,
  tags,
  excludeTag,
}: IsUniqueInboundTagParams): boolean {
  const normalizedTag = tag.trim();

  return !tags.some((t) => {
    const normalized = t.trim();

    if (excludeTag && normalized === excludeTag.trim()) {
      return false;
    }

    return normalized === normalizedTag;
  });
}
