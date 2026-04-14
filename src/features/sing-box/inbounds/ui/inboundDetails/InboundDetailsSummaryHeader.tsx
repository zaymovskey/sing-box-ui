import { type InboundStats, type StoredInbound } from "@/shared/api/contracts";
import { Badge, Card } from "@/shared/ui";

function getInboundTypeLabel(type: StoredInbound["type"]) {
  switch (type) {
    case "vless":
      return "VLESS";
    case "hysteria2":
      return "Hysteria2";
    default:
      return type;
  }
}

export function InboundDetailsSummaryHeader({
  inbound,
  usersCount,
  inboundStats,
}: {
  inbound: StoredInbound;
  usersCount: number;
  inboundStats?: InboundStats;
}) {
  const endpointLabel = `${inbound.listen ?? "0.0.0.0"}:${inbound.listen_port ?? "—"}`;

  return (
    <Card className="gap-0 overflow-hidden border py-0">
      <div className="from-background to-muted/30 bg-linear-to-br">
        <div className="mx-auto w-full max-w-6xl px-6 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full px-2 py-0 text-xs">
                  {getInboundTypeLabel(inbound.type)}
                </Badge>
                <Badge
                  className="rounded-full px-2 py-0 text-xs"
                  variant="outline"
                >
                  Sniff {inbound.sniff ? "on" : "off"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {inbound.display_tag}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Внутренний тег: {inbound.internal_tag}
                </p>
              </div>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-4">
              <SummaryStat label="Endpoint" value={endpointLabel} />
              <SummaryStat label="Пользователи" value={String(usersCount)} />
              <SummaryStat
                label="Онлайн"
                value={String(inboundStats?.online_users_count ?? 0)}
              />
              <SummaryStat
                label="Протокол"
                value={getInboundTypeLabel(inbound.type)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/80 rounded-xl border px-4 py-3 shadow-sm">
      <div className="text-muted-foreground text-[11px] tracking-wide uppercase">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold break-all">{value}</div>
    </div>
  );
}
