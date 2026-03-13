"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, type JSX } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

import { type InboundRow } from "../model/inbound-row.type";
import { InboundUserRow } from "./InboundUserRow";

type InboundsTableProps = {
  columns: ColumnDef<InboundRow>[];
  data: InboundRow[];
  expandedRowIds: Record<string, boolean>;
};

export function InboundsTable({
  columns,
  data,
  expandedRowIds,
}: InboundsTableProps) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
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
              let usersRows: JSX.Element[] = [];
              const inbound = row.original.inbound;

              const isExpanded = !!expandedRowIds[row.id];

              if (
                isExpanded &&
                "users" in inbound &&
                Array.isArray(inbound.users)
              ) {
                usersRows = inbound.users.map((user, index) => {
                  return (
                    <InboundUserRow key={index} inbound={inbound} user={user} />
                  );
                });
              }

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

                  {usersRows}
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
