"use client";

import { RefreshCcw, X } from "lucide-react";
import { useMemo, useState } from "react";

import { cn } from "@/shared/lib";
import { Button, Card, Input, MultiSelect, Separator } from "@/shared/ui";

import { mapSecurityAssetsListToRows } from "../../lib/map-security-assets-list-to-rows.mapper";
import { useSecurityAssetsColumns } from "../../lib/use-security-assets-columns.hook";
import { useSecurityAssetsListState } from "../../lib/use-security-assets-list-state";
import { useSecurityAssetsListQuery } from "../../model/security-assets-list.query";
import { CreateSecurityAssetDialog } from "../dialogs/CreateSecurityAssetDialog";
import { DeleteSecurityAssetDialog } from "../dialogs/DeleteSecurityAssetDialog";
import { EditSecurityAssetDialog } from "../dialogs/EditSecurityAssetDialog";
import { SecurityAssetsTable } from "./SecurityAssetsTable";
import { SecurityAssetsTablePagination } from "./SecurityAssetsTablePagination";
import { SecurityAssetsTableScreenSkeleton } from "./SecurityAssetsTableScreenSkeleton";

const PER_PAGE = 10;

const securityAssetTypeOptions = [
  { label: "TLS", value: "tls" },
  { label: "REALITY", value: "reality" },
];

export function SecurityAssetsTableScreen() {
  const securityAssetsColumns = useSecurityAssetsColumns();

  const { data: securityAssets, isPending: securityAssetsPending } =
    useSecurityAssetsListQuery();

  const [createSecurityAssetDialogOpen, setCreateSecurityAssetDialogOpen] =
    useState(false);

  const {
    selectedTypes,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    activePage,
    setGetParam,
  } = useSecurityAssetsListState();

  const tableRows = useMemo(() => {
    const rows = mapSecurityAssetsListToRows(securityAssets ?? []);
    const query = debouncedSearchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      const queryFilter =
        query.length === 0 ||
        row.name?.toLowerCase().includes(query) ||
        row.type?.toLowerCase().includes(query) ||
        row.serverName?.toLowerCase().includes(query);

      const typeFilter =
        selectedTypes.length === 0 || selectedTypes.includes(row.type ?? "");

      return queryFilter && typeFilter;
    });
  }, [securityAssets, debouncedSearchQuery, selectedTypes]);

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

  if (securityAssetsPending) {
    return <SecurityAssetsTableScreenSkeleton />;
  }

  return (
    <>
      <Card className="mb-4 gap-5 p-4">
        <CreateSecurityAssetDialog
          open={createSecurityAssetDialogOpen}
          onOpenChange={setCreateSecurityAssetDialogOpen}
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
              options={securityAssetTypeOptions}
              placeholder="Тип"
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

        <SecurityAssetsTable
          columns={securityAssetsColumns.columns}
          data={paginatedRows}
        />

        <SecurityAssetsTablePagination
          activePage={activePage}
          count={tableRows.length}
          perPage={PER_PAGE}
          onPageChange={(page) => setGetParam({ page: page.toString() })}
        />
      </Card>

      {securityAssetsColumns.actions.edit.securityAsset && (
        <EditSecurityAssetDialog
          open={securityAssetsColumns.actions.edit.isOpen}
          securityAsset={securityAssetsColumns.actions.edit.securityAsset}
          onOpenChange={securityAssetsColumns.actions.edit.setIsOpen}
        />
      )}

      {securityAssetsColumns.actions.delete.securityAsset && (
        <DeleteSecurityAssetDialog
          open={securityAssetsColumns.actions.delete.isOpen}
          securityAsset={securityAssetsColumns.actions.delete.securityAsset}
          onOpenChange={securityAssetsColumns.actions.delete.setIsOpen}
        />
      )}
    </>
  );
}
