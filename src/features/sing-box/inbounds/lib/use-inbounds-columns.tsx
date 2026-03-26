import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { type DraftInbound } from "@/shared/api/contracts";
import { Badge, Button } from "@/shared/ui";

import { type InboundRow } from "../model/inbound-row.type";

export function useInboundsColumns() {
  const [expandedRowTags, setExpandedRowTags] = useState<
    Record<string, boolean>
  >({});

  const toggleExpandedRow = (rowTag: string) => {
    setExpandedRowTags((prev) => ({
      ...prev,
      [rowTag]: !prev[rowTag],
    }));
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editingInbound, setEditingInbound] = useState<DraftInbound | null>(
    null,
  );
  const [deletingInbound, setDeletingInbound] = useState<DraftInbound | null>(
    null,
  );

  const inboundColumns: ColumnDef<InboundRow>[] = [
    {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const isExpanded = !!expandedRowTags[row.original.inbound.tag!];

        if (row.original.usersCount === 0) {
          return null;
        }

        return (
          <Button
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleExpandedRow(row.original.inbound.tag!)}
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
        className: "w-[48px] whitespace-nowrap",
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
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
        </div>
      ),
      meta: {
        className: "w-[96px] whitespace-nowrap",
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

  return {
    columns: inboundColumns,
    actions: {
      edit: {
        isOpen: isEditOpen,
        inbound: editingInbound,
        setIsOpen: setIsEditOpen,
      },
      delete: {
        isOpen: isDeleteOpen,
        inbound: deletingInbound,
        setIsOpen: setIsDeleteOpen,
      },
    },
    expandedRowTags: {
      tags: expandedRowTags,
      toggle: toggleExpandedRow,
    },
  } as const;
}
