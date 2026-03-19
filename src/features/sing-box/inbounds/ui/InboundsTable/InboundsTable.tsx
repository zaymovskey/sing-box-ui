"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

import { type InboundRow } from "../../model/inbound-row.type";
import { InboundUserRow } from "./InboundUserRow";

type InboundsTableProps = {
  columns: ColumnDef<InboundRow>[];
  data: InboundRow[];
  expandedRowTags: Record<string, boolean>;
};

export function InboundsTable({
  columns,
  data,
  expandedRowTags,
}: InboundsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="w-full table-fixed">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => {
              const inbound = row.original.inbound;
              const isExpanded = !!expandedRowTags[inbound.tag!];

              const hasUsers =
                "users" in inbound &&
                Array.isArray(inbound.users) &&
                inbound.users.length > 0;

              return (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cell.column.columnDef.meta?.className}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {isExpanded && hasUsers && (
                    <TableRow>
                      <TableCell
                        className="bg-muted/20 p-0"
                        colSpan={row.getVisibleCells().length}
                      >
                        <div className="py-4 pr-4 pl-15">
                          <div className="space-y-4">
                            {inbound.users?.map((user, index) => (
                              <InboundUserRow
                                key={`${row.id}-${index}`}
                                inbound={inbound}
                                user={user}
                              />
                            ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell className="h-24 text-center" colSpan={columns.length}>
                Inbounds не найдены.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
