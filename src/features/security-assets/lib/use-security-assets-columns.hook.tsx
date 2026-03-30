import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { type SecurityAsset } from "@/shared/api/contracts";
import { Badge, Button } from "@/shared/ui";

import { type SecurityAssetRow } from "../model/security-assets-row.type";

export function useSecurityAssetsColumns() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editingSecurityAsset, setEditingSecurityAsset] =
    useState<SecurityAsset | null>(null);
  const [deletingSecurityAsset, setDeletingSecurityAsset] =
    useState<SecurityAsset | null>(null);

  const securityAssetsColumns: ColumnDef<SecurityAssetRow>[] = [
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => {
              setEditingSecurityAsset(row.original.securityAsset);
              setIsEditOpen(true);
            }}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setDeletingSecurityAsset(row.original.securityAsset);
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
      accessorKey: "name",
      header: "Название",
      cell: ({ row }) => row.original.name ?? "—",
    },
    {
      accessorKey: "type",
      header: "Тип",
      cell: ({ row }) => (
        <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
          {row.original.type ?? "—"}
        </Badge>
      ),
    },
    {
      accessorKey: "serverName",
      header: "Server Name",
      cell: ({ row }) => row.original.serverName ?? "—",
    },
    {
      accessorKey: "sourceType",
      header: "Источник",
      cell: ({ row }) => {
        if (row.original.type === "reality") {
          return (
            <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
              built-in
            </Badge>
          );
        }

        return (
          <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
            {row.original.sourceType ?? "—"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Обновлён",
      cell: ({ row }) => row.original.updatedAt ?? "—",
    },
  ];

  return {
    columns: securityAssetsColumns,
    actions: {
      edit: {
        isOpen: isEditOpen,
        securityAsset: editingSecurityAsset,
        setIsOpen: setIsEditOpen,
      },
      delete: {
        isOpen: isDeleteOpen,
        securityAsset: deletingSecurityAsset,
        setIsOpen: setIsDeleteOpen,
      },
    },
  } as const;
}
