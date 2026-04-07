/* eslint-disable @typescript-eslint/no-explicit-any */

import { type InboundStats } from "@/shared/api/contracts";
import { TableCell, TableRow } from "@/shared/ui";

import { InboundUserRow } from "./InboundUserRow/InboundUserRow";

export function ExpandedRow({
  row,
  inbound,
  users,
  securityAssets,
  inboundStats,
}: {
  row: any;
  inbound: any;
  users: any[];
  securityAssets: any[];
  inboundStats?: InboundStats;
}) {
  return (
    <TableRow>
      <TableCell
        className="bg-muted/20 p-0"
        colSpan={row.getVisibleCells().length}
      >
        <div className="py-4 pr-4 pl-15">
          <div className="space-y-4">
            {users.map((user, index) => {
              const userStats = inboundStats?.users.find(
                (userStats) => userStats.internal_name === user.internal_name,
              );

              return (
                <InboundUserRow
                  key={`${row.id}-${index}`}
                  inbound={inbound}
                  securityAssets={securityAssets}
                  user={user}
                  userStats={userStats}
                />
              );
            })}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
