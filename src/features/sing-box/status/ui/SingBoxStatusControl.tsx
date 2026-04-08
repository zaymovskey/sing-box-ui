"use client";

import { RefreshCcw } from "lucide-react";
import { useState } from "react";

import { useReloadSingBoxMutation } from "@/features/sing-box/reload";
import { type SingBoxStatusCheck } from "@/shared/api/contracts";
import { cn } from "@/shared/lib";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  serverToast,
} from "@/shared/ui";

import {
  checkStatuses,
  type MainStatuses,
  mainStatuses,
} from "../lib/sing-box-status-control.constants";
import { useSingBoxStatusQuery } from "../model/sing-box-status.query";

export function SingBoxStatusControl() {
  const {
    data: statusData,
    isPending: statusIsPending,
    isError: statusIsError,
    refetch: refetchStatus,
  } = useSingBoxStatusQuery();

  const { isPending: reloadIsPending, mutateAsync: reloadMutateAsync } =
    useReloadSingBoxMutation();

  const [isApplyFlowActive, setIsApplyFlowActive] = useState(false);

  const getMainStatus = (): MainStatuses => {
    if (reloadIsPending || statusIsPending || isApplyFlowActive) {
      return "loading";
    }

    if (statusIsError) {
      return "unknown_error";
    }

    return statusData?.summary ?? "unknown_error";
  };

  const handleApply = async () => {
    try {
      setIsApplyFlowActive(true);

      await reloadMutateAsync();
      await refetchStatus();

      serverToast.success("sing-box перезагружен", {
        duration: 3000,
      });
    } catch {
      serverToast.error("Не удалось перезагрузить sing-box", {
        duration: 3000,
      });
    } finally {
      setIsApplyFlowActive(false);
    }
  };

  const currentMainStatus = getMainStatus();
  const currentMainStatusConfig = mainStatuses[currentMainStatus];

  const shouldShowChecks =
    !statusIsPending && !statusIsError && (statusData?.checks?.length ?? 0) > 0;

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                currentMainStatusConfig.dotColor,
              )}
            />
            <span
              className={cn("font-medium", currentMainStatusConfig.textColor)}
            >
              {currentMainStatusConfig.label}
            </span>
            <span className={cn(currentMainStatusConfig.textColor)}>
              {currentMainStatusConfig.icon}
            </span>
          </Button>
        </PopoverTrigger>

        {shouldShowChecks && (
          <PopoverContent className="w-[420px] p-0">
            <div className="divide-y">
              {statusData!.checks.map((check) => (
                <StatusListItem
                  key={`${check.code}-${check.message}`}
                  status={check}
                />
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>

      <Button
        className="gap-2"
        loading={currentMainStatus === "loading"}
        size="sm"
        variant="outline"
        onClick={handleApply}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function StatusListItem({ status }: { status: SingBoxStatusCheck }) {
  const config = checkStatuses[status.code];

  return (
    <div className="flex items-stretch gap-3 px-3 py-3">
      <div
        className={cn("mt-0.5 w-1 shrink-0 rounded-full", config.dotColor)}
      />
      <div className="min-w-0 space-y-1">
        <div className={cn("text-sm font-semibold", config.textColor)}>
          {config.label}
        </div>
        <div className="text-muted-foreground text-sm wrap-break-word">
          {status.message}
        </div>
      </div>
    </div>
  );
}
