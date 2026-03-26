import {
  Ban,
  CircleQuestionMark,
  Container,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import { type ReactElement } from "react";

import {
  type SingBoxStatusCheck,
  type SingBoxStatusSummary,
} from "@/shared/api/contracts";

type StatusConfig = {
  label: string;
  icon: ReactElement;
  textColor: string;
  dotColor: string;
};

export type MainStatuses = SingBoxStatusSummary | "loading" | "unknown_error";

export const checkStatuses: Record<SingBoxStatusCheck, StatusConfig> = {
  container_not_running: {
    label: "Контейнер не запущен",
    icon: <Ban className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  invalid_config: {
    label: "Неверная конфигурация",
    icon: <Ban className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  draft_not_applied: {
    label: "Перезагрузите sing-box для применения изменений",
    icon: <Ban className="h-4 w-4" />,
    textColor: "text-yellow-600",
    dotColor: "bg-yellow-500",
  },
};

export const mainStatuses: Record<MainStatuses, StatusConfig> = {
  ok: {
    label: "Работает",
    icon: <Container className="h-4 w-4" />,
    textColor: "text-green-600",
    dotColor: "bg-green-500",
  },
  error: {
    label: "Работает",
    icon: <Ban className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  warning: {
    icon: <TriangleAlert className="h-4 w-4" />,
    label: "Требуется действие",
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
    icon: <CircleQuestionMark className="h-4 w-4" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
};
