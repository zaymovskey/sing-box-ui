"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge, Button, Card, Separator } from "@/shared/ui";

import { useConfigQuery } from "../../config-core/model/config-core.query";
import { type Inbound } from "../../config-core/model/config-core.types";
import { mapInboundsToRows } from "../model/inbound-row.mapper";
import { type InboundRow } from "../model/inbound-row.type";
import { CreateInboundDialog } from "./dialogs/CreateInboundDialog";
import { EditInboundDialog } from "./dialogs/EditInboundDialog";
import { InboundsTable } from "./InboundsTable";

export function InboundsTableScreen() {
  const [editingInbound, setEditingInbound] = useState<Inbound | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: singBoxConfig } = useConfigQuery();

  const inboundColumns: ColumnDef<InboundRow>[] = [
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          onClick={() => {
            setEditingInbound(row.original.inbound);
            setIsEditOpen(true);
          }}
        >
          <Pencil className="size-4" />
        </Button>
      ),
      meta: {
        className: "w-[1%] whitespace-nowrap",
      },
    },
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
      {editingInbound && (
        <EditInboundDialog
          inbound={editingInbound}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </div>
  );
}
