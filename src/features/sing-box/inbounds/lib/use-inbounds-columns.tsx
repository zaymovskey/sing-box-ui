import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { type StoredInbound } from "@/shared/api/contracts";
import { Badge, Button } from "@/shared/ui";
import { buttonVariants } from "@/shared/ui/button";

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
  const [deletingInbound, setDeletingInbound] = useState<StoredInbound | null>(
    null,
  );

  const inboundColumns: ColumnDef<InboundRow>[] = [
    {
      id: "expand",
      header: "",
      cell: ({ row }) => {
        const isExpanded = !!expandedRowTags[row.original.inbound.display_tag!];

        if (row.original.usersCount === 0) {
          return null;
        }

        return (
          <Button
            size="icon"
            type="button"
            variant="ghost"
            onClick={() => toggleExpandedRow(row.original.inbound.display_tag!)}
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
          <Link
            className={buttonVariants({ variant: "ghost", size: "default" })}
            href={`/inbounds/${row.original.inbound.internal_tag}`}
            rel="noreferrer"
            target="_blank"
          >
            <Pencil className="size-4" />
          </Link>

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
      cell: ({ row }) => (
        <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
          {row.original.type ?? "—"}
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

  return {
    columns: inboundColumns,
    actions: {
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
