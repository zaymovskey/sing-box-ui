export const hasExtension = (value: string, ext: string) => {
  return value.toLowerCase().endsWith(ext);
};

export const looksLikeAbsoluteUnixPath = (value: string) => {
  return value.startsWith("/") && !value.endsWith("/");
};
