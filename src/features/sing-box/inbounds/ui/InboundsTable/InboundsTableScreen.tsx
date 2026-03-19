"use client";

import { useMemo } from "react";

import {
  useConfigQuery,
  useConfigQueryToasts,
} from "@/features/sing-box/config-core";
import { Card, Input, MultiSelect, Separator } from "@/shared/ui";

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

export function InboundsTableScreen() {
  const inboundColumns = useInboundsColumns();

  const { data: singBoxConfig, error } = useConfigQuery();
  useConfigQueryToasts(error);

  const {
    selectedTypes,
    setSelectedTypes,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    activePage,
    setGetParam,
  } = useInboundsListState();

  const tableRows = useMemo(
    () =>
      mapInboundsToRows(singBoxConfig ?? { inbounds: [] }).filter((row) => {
        const query = debouncedSearchQuery.toLowerCase();

        const queryFilter =
          row.tag?.toLowerCase().includes(query) ||
          row.type?.toLowerCase().includes(query) ||
          row.listen_port?.toString().includes(query);

        const typeFilter =
          selectedTypes.length === 0 || selectedTypes.includes(row.type ?? "");

        return queryFilter && typeFilter;
      }),
    [singBoxConfig, debouncedSearchQuery, selectedTypes],
  );

  const paginatedRows = useMemo(() => {
    const startIndex = (activePage - 1) * PER_PAGE;
    return tableRows.slice(startIndex, startIndex + PER_PAGE);
  }, [tableRows, activePage]);

  return (
    <>
      <Card className="mb-4 gap-5 p-4">
        <CreateInboundDialog />
        <Separator />
        <div className="flex items-center justify-between">
          <Input
            className="max-w-100"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <MultiSelect
            options={inboundTypeOptions}
            placeholder="Тип инбаунда"
            value={selectedTypes}
            onValueChange={setSelectedTypes}
          />
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
          onPageChange={(page) => setGetParam(page.toString(), "page")}
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
