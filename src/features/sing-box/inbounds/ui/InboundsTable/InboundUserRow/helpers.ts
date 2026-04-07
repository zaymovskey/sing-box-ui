export function getLastActivity(user: {
  last_up_traffic_at: string | null;
  last_down_traffic_at: string | null;
}) {
  const up = user.last_up_traffic_at
    ? new Date(user.last_up_traffic_at).getTime()
    : 0;

  const down = user.last_down_traffic_at
    ? new Date(user.last_down_traffic_at).getTime()
    : 0;

  const last = Math.max(up, down);

  return last === 0 ? null : last;
}

export function formatLastSeen(timestamp: number | null): string {
  if (!timestamp) return "—";

  const diffMs = Date.now() - timestamp;

  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 5) return "just now";

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const base = 1024;

  const exponent = Math.floor(Math.log(bytes) / Math.log(base));
  const value = bytes / Math.pow(base, exponent);

  const formatted =
    value >= 10
      ? Math.round(value) // 12 MB
      : Number(value.toFixed(1)); // 1.5 GB

  return `${formatted} ${units[exponent]}`;
}
