"use client";

import { RefreshCcw, X } from "lucide-react";
import { useMemo, useState } from "react";

import {
  useConfigQuery,
  useConfigQueryToasts,
} from "@/features/sing-box/config-core";
import { cn } from "@/shared/lib";
import { Button, Card, Input, MultiSelect, Separator } from "@/shared/ui";

import { useInboundsColumns } from "../../lib/use-inbounds-columns";
import { useInboundsListState } from "../../lib/use-inbounds-list-state";
import { mapInboundsToRows } from "../../model/inbound-row.mapper";
import { CreateInboundDialog } from "../dialogs/CreateInboundDialog";
import { DeleteInboundDialog } from "../dialogs/DeleteInboundDialog";
import { EditInboundDialog } from "../dialogs/EditInboundDialog";
import { InboundsTable } from "./InboundsTable";
import { InboundsTablePagination } from "./InboundsTablePagination";

const PER_PAGE = 10;

const inboundTypeOptions = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
];

function getRawInbounds(rawDraftConfig: unknown): unknown[] {
  if (!rawDraftConfig || typeof rawDraftConfig !== "object") {
    return [];
  }

  const maybeInbounds = (rawDraftConfig as { inbounds?: unknown }).inbounds;

  return Array.isArray(maybeInbounds) ? maybeInbounds : [];
}

export function InboundsTableScreen() {
  const inboundColumns = useInboundsColumns();

  const { data: rawDraftConfig, error } = useConfigQuery();

  const [createInboundDialogOpen, setCreateInboundDialogOpen] = useState(false);

  useConfigQueryToasts(error);

  const {
    selectedTypes,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    activePage,
    setGetParam,
  } = useInboundsListState();

  const rawInbounds = useMemo(
    () => getRawInbounds(rawDraftConfig),
    [rawDraftConfig],
  );

  const tableRows = useMemo(
    () =>
      mapInboundsToRows({ inbounds: rawInbounds as never[] }).filter((row) => {
        const query = debouncedSearchQuery.toLowerCase();

        const queryFilter =
          row.tag?.toLowerCase().includes(query) ||
          row.type?.toLowerCase().includes(query) ||
          row.listen_port?.toString().includes(query);

        const typeFilter =
          selectedTypes.length === 0 || selectedTypes.includes(row.type ?? "");

        return queryFilter && typeFilter;
      }),
    [rawInbounds, debouncedSearchQuery, selectedTypes],
  );

  const paginatedRows = useMemo(() => {
    const startIndex = (activePage - 1) * PER_PAGE;
    return tableRows.slice(startIndex, startIndex + PER_PAGE);
  }, [tableRows, activePage]);

  const handleReset = () => {
    setSearchQuery("");
    setGetParam({
      page: "1",
      types: null,
    });
  };

  return (
    <>
      <Card className="mb-4 gap-5 p-4">
        <CreateInboundDialog
          open={createInboundDialogOpen}
          onOpenChange={setCreateInboundDialogOpen}
        />
        <Separator />
        <div className="flex items-center justify-between">
          <div className="relative flex items-center justify-between gap-1">
            <Input
              className="w-[400px]"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className={cn(
                "text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer p-1 duration-200",
                searchQuery ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              type="button"
              onClick={() => setSearchQuery("")}
            >
              <X className="size-4" />
              <span className="sr-only">Сбросить поиск</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <MultiSelect
              options={inboundTypeOptions}
              placeholder="Тип инбаунда"
              value={selectedTypes}
              onValueChange={(values) =>
                setGetParam({
                  types: values.length > 0 ? values.join(",") : null,
                  page: "1",
                })
              }
            />
            <Button variant="outline" onClick={handleReset}>
              <RefreshCcw />
              Сброс
            </Button>
          </div>
        </div>

        <InboundsTable
          columns={inboundColumns.columns}
          data={paginatedRows}
          expandedRowTags={inboundColumns.expandedRowTags.tags}
        />

        <InboundsTablePagination
          activePage={activePage}
          count={tableRows.length}
          perPage={PER_PAGE}
          onPageChange={(page) => setGetParam({ page: page.toString() })}
        />
      </Card>

      {inboundColumns.actions.edit.inbound && (
        <EditInboundDialog
          inbound={inboundColumns.actions.edit.inbound}
          open={inboundColumns.actions.edit.isOpen}
          onOpenChange={inboundColumns.actions.edit.setIsOpen}
        />
      )}

      {inboundColumns.actions.delete.inbound && (
        <DeleteInboundDialog
          inbound={inboundColumns.actions.delete.inbound}
          open={inboundColumns.actions.delete.isOpen}
          onOpenChange={inboundColumns.actions.delete.setIsOpen}
        />
      )}
    </>
  );
}
