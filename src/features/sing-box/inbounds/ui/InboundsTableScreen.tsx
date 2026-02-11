"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import { Badge, Card, Separator } from "@/shared/ui";

import { useConfigQuery } from "../../config-core/model/config-core.query";
import { mapInboundsToRows } from "../model/inbound-row.mapper";
import { type InboundRow } from "../model/inbound-row.type";
import { CreateInboundDialog } from "./CreateInboundDialog";
import { InboundsTable } from "./InboundsTable";

const inboundColumns: ColumnDef<InboundRow>[] = [
  {
    accessorKey: "tag",
    header: "Тег (Tag)",
    cell: ({ row }) => row.original.tag ?? "—",
  },
  {
    accessorKey: "type",
    header: "Тип (Type)",
    cell: ({ row }) => (
      <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
        {row.original.type}
      </Badge>
    ),
  },
  {
    id: "listen",
    header: "Порт (Listen)",
    cell: ({ row }) => row.original.listen_port ?? "—",
  },
  {
    id: "users",
    header: "Пользователи (Users)",
    cell: ({ row }) => (
      <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
        {row.original.usersCount}
      </Badge>
    ),
  },
];

export function InboundsTableScreen() {
  const { data: singBoxConfig } = useConfigQuery();

  const tableRows = useMemo(
    () => mapInboundsToRows(singBoxConfig ?? { inbounds: [] }),
    [singBoxConfig],
  );

  return (
    <div>
      <Card className="mb-4 gap-5 p-4">
        <CreateInboundDialog />
        <Separator />
        <InboundsTable columns={inboundColumns} data={tableRows} />
      </Card>
    </div>
  );
}
