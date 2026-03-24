import {
  Container,
  FileExclamationPoint,
  FileX,
  RefreshCcw,
  ShieldX,
} from "lucide-react";
import { type ReactElement } from "react";

import { type SingBoxStatusReason } from "@/shared/api/contracts";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

type StatusConfig = {
  label: string;
  icon: ReactElement;
  textColor: string;
  dotColor: string;
};

export function SingBoxStatusControl({
  status,
}: {
  status: SingBoxStatusReason;
}) {
  const statuses: Record<SingBoxStatusReason, StatusConfig> = {
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
    service_unreachable: {
      label: "Сервис недоступен",
      icon: <ShieldX className="h-4 w-4" />,
      textColor: "text-red-600",
      dotColor: "bg-red-500",
    },
    last_revision_not_applied: {
      label: "Ревизия не применена",
      icon: <FileExclamationPoint className="h-4 w-4" />,
      textColor: "text-yellow-600",
      dotColor: "bg-yellow-500",
    },
  };

  const current = statuses[status];

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm",
          "bg-muted/50",
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", current.dotColor)} />
        <span className={cn(current.textColor)}>{current.icon}</span>
        <span className={cn("font-medium", current.textColor)}>
          {current.label}
        </span>
      </div>
      <Button className="gap-2" size="sm" variant="outline">
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
