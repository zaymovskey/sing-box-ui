import { Ban, CircleQuestionMark, Container, Loader2 } from "lucide-react";
import { type ReactElement } from "react";

import {
  type SingBoxStatusCheckCode,
  type SingBoxStatusSummary,
} from "@/shared/api/contracts";
import { SingBoxLogo } from "@/shared/assets/icons";

type StatusConfig = {
  label: string;
  icon: ReactElement;
  textColor: string;
  dotColor: string;
};

export type MainStatuses = SingBoxStatusSummary | "loading" | "unknown_error";

export const checkStatuses: Record<SingBoxStatusCheckCode, StatusConfig> = {
  container_not_running: {
    label: "Контейнер не запущен",
    icon: <Ban className="h-10 w-10 shrink-0" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  invalid_config: {
    label: "Неверная конфигурация",
    icon: <Ban className="h-10 w-10 shrink-0" />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  draft_not_applied: {
    label: "Перезагрузите sing-box",
    icon: <Ban className="h-10 w-10 shrink-0" />,
    textColor: "text-yellow-600",
    dotColor: "bg-yellow-500",
  },
  all_ok: {
    label: "Все проверки пройдены успешно",
    icon: <Container className="h-10 w-10 shrink-0" />,
    textColor: "text-green-600",
    dotColor: "bg-green-500",
  },
};

const iconSizeStyle = {
  height: "20px",
  width: "20px",
};

export const mainStatuses: Record<MainStatuses, StatusConfig> = {
  ok: {
    label: "Работает",
    icon: <SingBoxLogo status="success" style={iconSizeStyle} />,
    textColor: "text-green-600",
    dotColor: "bg-green-500",
  },
  error: {
    label: "Ошибка",
    icon: <SingBoxLogo status="error" style={iconSizeStyle} />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
  warning: {
    icon: <SingBoxLogo status="warning" style={iconSizeStyle} />,
    label: "Требуется действие",
    textColor: "text-yellow-600",
    dotColor: "bg-yellow-500",
  },
  loading: {
    label: "Загрузка...",
    icon: <Loader2 className="animate-spin" style={iconSizeStyle} />,
    textColor: "text-muted-foreground",
    dotColor: "bg-muted",
  },
  unknown_error: {
    label: "Неизвестная ошибка",
    icon: <CircleQuestionMark className="shrink-0" style={iconSizeStyle} />,
    textColor: "text-red-600",
    dotColor: "bg-red-500",
  },
};
