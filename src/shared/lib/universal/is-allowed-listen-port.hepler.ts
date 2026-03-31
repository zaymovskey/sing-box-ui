export function isAllowedListenPort(
  port: number,
  rangeStart: number,
  rangeEnd: number,
): boolean {
  return (
    port === 443 || port === 8443 || (port >= rangeStart && port <= rangeEnd)
  );
}
