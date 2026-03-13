"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, type JSX } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

import { type InboundRow } from "../model/inbound-row.type";

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
                  const name =
                    typeof user === "object" && "name" in user
                      ? user.name
                      : null;

                  return (
                    <TableRow key={`${row.id}-user-${index}`}>
                      <TableCell
                        className="bg-muted/30 py-3 pl-15"
                        colSpan={columns.length}
                      >
                        <div className="bg-background rounded-md border px-4 py-3">
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {name}
                                </span>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <Button type="button">Ссылка</Button>
                              <Button type="button">QR</Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
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
