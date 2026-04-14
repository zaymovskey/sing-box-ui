"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { cn } from "@/shared/lib";
import { Button, Card, Input, MultiSelect, Separator } from "@/shared/ui";

import { subscribeToInboundsChanged } from "../../lib/inbounds-sync";
import { mapInboundsListToRows } from "../../lib/map-inbounds-list-to-rows.mapper";
import { useInboundsColumns } from "../../lib/use-inbounds-columns";
import { useInboundsListState } from "../../lib/use-inbounds-list-state";
import { useInboundsListQuery } from "../../model/queries/inbounds-list.query";
import { useInboundsStatsQuery } from "../../model/queries/inbounds-stats.query";
import { CreateInboundDialog } from "../dialogs/CreateInboundDialog";
import { DeleteInboundDialog } from "../dialogs/DeleteInboundDialog";
import { InboundsTable } from "./InboundsTable";
import { InboundsTablePagination } from "./InboundsTablePagination";
import { InboundsTableScreenSkeleton } from "./InboundsTableScreenSkeleton";

const PER_PAGE = 10;

const inboundTypeOptions = [
  { label: "VLESS", value: "vless" },
  { label: "Hysteria2", value: "hysteria2" },
];

export function InboundsTableScreen() {
  const qc = useQueryClient();
  const inboundColumns = useInboundsColumns();

  const { data: inboundsList, isPending: inboundsListPending } =
    useInboundsListQuery();
  const { data: inboundsStats } = useInboundsStatsQuery();

  const [createInboundDialogOpen, setCreateInboundDialogOpen] = useState(false);

  const {
    selectedTypes,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    activePage,
    setGetParam,
  } = useInboundsListState();

  const tableRows = useMemo(() => {
    const rows = mapInboundsListToRows(inboundsList?.list ?? []);
    const query = debouncedSearchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      const queryFilter =
        query.length === 0 ||
        row.tag?.toLowerCase().includes(query) ||
        row.type?.toLowerCase().includes(query) ||
        row.listen_port?.toString().includes(query);

      const typeFilter =
        selectedTypes.length === 0 || selectedTypes.includes(row.type ?? "");

      return queryFilter && typeFilter;
    });
  }, [inboundsList, debouncedSearchQuery, selectedTypes]);

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

  useEffect(() => {
    return subscribeToInboundsChanged(() => {
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.inbounds() });
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.inboundsStats() });
    });
  }, [qc]);

  if (inboundsListPending) {
    return <InboundsTableScreenSkeleton />;
  }

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
          inboundsStats={inboundsStats}
        />

        {tableRows.length > PER_PAGE && (
          <InboundsTablePagination
            activePage={activePage}
            count={tableRows.length}
            perPage={PER_PAGE}
            onPageChange={(page) => setGetParam({ page: page.toString() })}
          />
        )}
      </Card>

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
