import {
  type InboundStats,
  type SecurityAsset,
  type StoredInbound,
} from "@/shared/api/contracts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui";

import { InboundUserRow } from "../InboundsTable/InboundUserRow/InboundUserRow";

export function InboundDetailsUsersSection({
  inbound,
  inboundStats,
  securityAssets,
}: {
  inbound: StoredInbound;
  inboundStats?: InboundStats;
  securityAssets: SecurityAsset[];
}) {
  const inboundUsers = inbound.users ?? [];

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Пользователи</CardTitle>
          <CardDescription className="mb-2">
            {inboundUsers.length === 0
              ? "У этого инбаунда пока нет пользователей."
              : `Всего ${inboundUsers.length}, онлайн ${inboundStats?.online_users_count ?? 0}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          {inboundUsers.length > 0 ? (
            <div className="space-y-4">
              {inboundUsers.map((user, index) => {
                const userStats = inboundStats?.users.find(
                  (item) => item.internal_name === user.internal_name,
                );

                return (
                  <InboundUserRow
                    key={`${user.internal_name}-${index}`}
                    inbound={inbound}
                    securityAssets={securityAssets}
                    user={user}
                    userStats={userStats}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground bg-muted/30 rounded-lg border border-dashed px-4 py-8 text-center text-sm">
              Когда добавишь пользователя в конфиг инбаунда, он появится здесь.
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
