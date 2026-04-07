"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment } from "react";

import { useSecurityAssetsListQuery } from "@/features/security-assets";
import { type InboundsStatsResponse } from "@/shared/api/contracts";
import {
  EmptyTableState,
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

import { type InboundRow } from "../../model/inbound-row.type";
import { ExpandedRow } from "./ExpandedRow";
import { MainRow } from "./MainRow";

type InboundsTableProps = {
  columns: ColumnDef<InboundRow>[];
  data: InboundRow[];
  expandedRowTags: Record<string, boolean>;
  inboundsStats?: InboundsStatsResponse;
};

export function InboundsTable({
  columns,
  data,
  expandedRowTags,
  inboundsStats,
}: InboundsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { data: securityAssets } = useSecurityAssetsListQuery();

  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                >
                  {!header.isPlaceholder &&
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.length === 0 && (
            <EmptyTableState
              colSpan={columns.length}
              text="Инбаунды не найдены"
            />
          )}

          {rows.map((row) => {
            const inbound = row.original.inbound;
            const isExpanded = !!expandedRowTags[inbound.display_tag!];

            const users = inbound.users ?? [];
            const hasUsers = users.length > 0;

            return (
              <Fragment key={row.id}>
                <MainRow row={row} />

                {isExpanded && hasUsers && (
                  <ExpandedRow
                    inbound={inbound}
                    inboundStats={inboundsStats?.items.find(
                      (item) => item.id === inbound.id,
                    )}
                    row={row}
                    securityAssets={securityAssets ?? []}
                    users={users}
                  />
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
