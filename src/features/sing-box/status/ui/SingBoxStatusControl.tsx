"use client";

import {
  Container,
  FileExclamationPoint,
  FileX,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { type ReactElement, useEffect, useState } from "react";

import { useReloadSingBox } from "@/features/sing-box/reload";
import { type SingBoxStatusReason } from "@/shared/api/contracts";
import { cn } from "@/shared/lib";
import { Button, serverToast } from "@/shared/ui";

import { useSingBoxStatusQuery } from "../model/sing-box-status.query";

type StatusConfig = {
  label: string;
  icon: ReactElement;
  textColor: string;
  dotColor: string;
};

type SingBoxStatusControlStatus =
  | SingBoxStatusReason
  | "loading"
  | "unknown_error";

export function SingBoxStatusControl() {
  const {
    data: statusData,
    isLoading: statusIsLoading,
    isFetching: statusIsFetching,
    isError: statusIsError,
  } = useSingBoxStatusQuery();

  const reloadMutation = useReloadSingBox();

  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (!isApplying) return;
    if (statusIsFetching) return;
    if (!statusData && !statusIsError) return;
    if (statusIsError) return;

    if (statusData.reason !== "ok") return;

    setIsApplying(false);
  }, [isApplying, statusIsFetching, statusData, statusIsError]);

  const getStatus = (): SingBoxStatusControlStatus => {
    if (statusIsLoading || reloadMutation.isPending || isApplying) {
      return "loading";
    }

    if (statusIsError) {
      return "unknown_error";
    }

    return statusData?.reason ?? "unknown_error";
  };

  const currentStatus = getStatus();
  const current = statuses[currentStatus];

  const handleReload = async () => {
    setIsApplying(true);
    try {
      await reloadMutation.mutateAsync();
      serverToast.success("sing-box перезагружен", {
        duration: 3000,
      });
    } catch {
      serverToast.error("Не удалось перезагрузить sing-box", {
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm",
          "bg-card dark:bg-input/30 dark:border-input border shadow-xs",
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", current.dotColor)} />
        <span className={cn(current.textColor)}>{current.icon}</span>
        <span className={cn("font-medium", current.textColor)}>
          {current.label}
        </span>
      </div>
      <Button
        className="gap-2"
        loading={currentStatus === "loading"}
        size="sm"
        variant="outline"
        onClick={handleReload}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}

const statuses: Record<SingBoxStatusControlStatus, StatusConfig> = {
  ok: {
    label: "Работает",
    icon: <Container className="h-4 w-4" />,
    textColor: "text-green-600",
    dotColor: "bg-green-500",
  },
  container_not_running: {
    label: "Контейнер не запущен",
    icon: <Container className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  invalid_config: {
    label: "Конфигурация не валидна",
    icon: <FileX className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  draft_not_applied: {
    label: "Перезагрузите для применения изменений",
    icon: <FileExclamationPoint className="h-4 w-4" />,
    textColor: "text-yellow-600",
    dotColor: "bg-yellow-500",
  },
  loading: {
    label: "Загрузка...",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    textColor: "text-muted-foreground",
    dotColor: "bg-muted",
  },
  unknown_error: {
    label: "Неизвестная ошибка",
    icon: <FileX className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
};
