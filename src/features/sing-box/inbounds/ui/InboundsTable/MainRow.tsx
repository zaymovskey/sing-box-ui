/* eslint-disable @typescript-eslint/no-explicit-any */
import { flexRender } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/shared/ui";

export function MainRow({ row }: { row: any }) {
  return (
    <TableRow>
      {row.getVisibleCells().map((cell: any) => (
        <TableCell
          key={cell.id}
          className={cell.column.columnDef.meta?.className}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
