type IsUniqueInboundTagParams = {
  tag: string;
  tags: string[];
};

export function isUniqueInboundTag({
  tag,
  tags,
}: IsUniqueInboundTagParams): boolean {
  const normalizedTag = tag.trim();

  return tags.some((tag) => {
    return tag.trim() === normalizedTag;
  });
}
