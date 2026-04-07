import { TableCell, TableRow } from "../table";

export function EmptyTableState({
  colSpan,
  text,
}: {
  colSpan: number;
  text: string;
}) {
  return (
    <TableRow>
      <TableCell className="h-24 text-center" colSpan={colSpan}>
        {text}
      </TableCell>
    </TableRow>
  );
}
