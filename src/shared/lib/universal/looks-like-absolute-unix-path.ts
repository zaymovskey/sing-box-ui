export const looksLikeAbsoluteUnixPath = (value: string) => {
  return value.startsWith("/") && !value.endsWith("/");
};
