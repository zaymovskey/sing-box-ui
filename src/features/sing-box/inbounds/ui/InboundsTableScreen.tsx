"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge, Card } from "@/shared/ui";

import { InboundsTable } from "./InboundsTable";

type InboundTableItem = {
  type: string;
  tag?: string;
  listen?: string;
  listen_port?: number;
  users?: Array<{ name?: string; uuid?: string; password?: string }>;
  tls?: {
    enabled?: boolean;
    reality?: { enabled?: boolean };
  };
};

const inboundsMock: InboundTableItem[] = [
  {
    type: "hysteria2",
    tag: "hy2-in",
    listen: "::",
    listen_port: 443,
    users: [{ name: "SEREGAAAA111", password: "seroga-hy2-pass" }],
    tls: { enabled: true },
  },
  {
    type: "vless",
    tag: "reality-in",
    listen: "::",
    listen_port: 8443,
    users: [{ name: "seroga", uuid: "c2b6b3d9-7570-4f87-9a97-1afa4fa403a8" }],
    tls: { enabled: true, reality: { enabled: true } },
  },
];

const inboundColumns: ColumnDef<InboundTableItem>[] = [
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) => row.original.tag ?? "—",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge className="rounded-full px-2 py-0 text-xs" variant="outline">
        {row.original.type}
      </Badge>
    ),
  },
  {
    id: "listen",
    header: "Listen",
    cell: ({ row }) => {
      const { listen, listen_port } = row.original;
      if (!listen && !listen_port) return "—";
      return `${listen ?? "0.0.0.0"}:${listen_port ?? "—"}`;
    },
  },
  {
    id: "users",
    header: "Users",
    cell: ({ row }) => row.original.users?.length ?? 0,
  },
  {
    id: "security",
    header: "Security",
    cell: ({ row }) => {
      const tls = Boolean(row.original.tls?.enabled);
      const reality = Boolean(row.original.tls?.reality?.enabled);

      if (reality) return "reality";
      if (tls) return "tls";
      return "—";
    },
  },
];

export function InboundsTableScreen() {
  return (
    <div>
      <Card className="mb-4 p-4">
        <InboundsTable columns={inboundColumns} data={inboundsMock} />
      </Card>
    </div>
  );
}
