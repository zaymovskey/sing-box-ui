"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import {
  useConfigQuery,
  useConfigQueryToasts,
} from "@/features/sing-box/config-core";
import { type Inbound } from "@/features/sing-box/config-core";
import { Badge, Button, Card, MultiSelect, Separator } from "@/shared/ui";

import { mapInboundsToRows } from "../../model/inbound-row.mapper";
import { type InboundRow } from "../../model/inbound-row.type";
import { CreateInboundDialog } from "../dialogs/CreateInboundDialog";
import { DeleteInboundDialog } from "../dialogs/DeleteInboundDialog";
import { EditInboundDialog } from "../dialogs/EditInboundDialog";
import { InboundsTable } from "./InboundsTable";
import { InboundsTableSearch } from "./InboundsTableSearch";

export function InboundsTableScreen() {
  const [editingInbound, setEditingInbound] = useState<Inbound | null>(null);
  const [deletingInbound, setDeletingInbound] = useState<Inbound | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: singBoxConfig, error } = useConfigQuery();
  useConfigQueryToasts(error);

  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>(
    {},
  );

  const toggleExpandedRow = (rowId: string) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const inboundColumns: ColumnDef<InboundRow>[] = [
    {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const isExpanded = !!expandedRowIds[row.id];

        if (row.original.usersCount === 0) {
          return null;
        }

        return (
          <Button
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleExpandedRow(row.id)}
          >
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </Button>
        );
      },
      meta: {
        className: "w-[1%] whitespace-nowrap",
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              setEditingInbound(row.original.inbound);
              setIsEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDeletingInbound(row.original.inbound);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="text-destructive-foreground size-4" />
          </Button>
        </>
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
      cell: ({ row }) => {
        const inbound = row.original.inbound;
        const badges: string[] = [];
        badges.push(row.original.type!);
        if (inbound.type === "vless") {
          if (inbound.tls?.reality?.enabled) {
            badges.push("reality");
          }
        }
        return (
          <>
            {badges.map((badge, index) => (
              <Badge
                key={index}
                className="mr-1 rounded-full px-2 py-0 text-xs"
                variant="outline"
              >
                {badge}
              </Badge>
            ))}
          </>
        );
      },
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

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const tableRows = useMemo(
    () =>
      mapInboundsToRows(singBoxConfig ?? { inbounds: [] }).filter((row) => {
        const query = searchQuery.toLowerCase();
        const queryFilter =
          row.tag?.toLowerCase().includes(query) ||
          row.type?.toLowerCase().includes(query) ||
          row.listen_port?.toString().includes(query);

        const typeFilter =
          selectedTypes.length === 0 || selectedTypes.includes(row.type ?? "");
        return queryFilter && typeFilter;
      }),
    [searchQuery, singBoxConfig, selectedTypes],
  );

  const inboundTypeOptions = [
    { label: "VLESS", value: "vless" },
    { label: "Hysteria2", value: "hysteria2" },
  ];

  return (
    <>
      <Card className="mb-4 gap-5 p-4">
        <CreateInboundDialog />
        <Separator />
        <div className="flex items-center justify-between">
          <InboundsTableSearch onSearch={(query) => setSearchQuery(query)} />
          <MultiSelect
            options={inboundTypeOptions}
            placeholder="Тип инбаунда"
            value={selectedTypes}
            onValueChange={setSelectedTypes}
          />
        </div>

        <InboundsTable
          columns={inboundColumns}
          data={tableRows}
          expandedRowIds={expandedRowIds}
        />
      </Card>
      {editingInbound && (
        <EditInboundDialog
          inbound={editingInbound}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
      {deletingInbound && (
        <DeleteInboundDialog
          inbound={deletingInbound}
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
        />
      )}
    </>
  );
}
