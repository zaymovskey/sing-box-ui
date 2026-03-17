import { Loader2, ShieldCheck, ShieldX, Wand2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

export type Status = "idle" | "loading" | "success" | "error";

export type TlsStatus = {
  status: Status;
  message?: string;
};

export type TlsStatuses = {
  crt: TlsStatus;
  key: TlsStatus;
  pair: TlsStatus;
};

interface Hy2TlsToolsProps {
  statuses: TlsStatuses;
  onCheck: () => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export function Hy2TlsTools({
  statuses,
  onCheck,
  onGenerate,
  disabled = false,
}: Hy2TlsToolsProps) {
  const isChecking = [
    statuses.crt.status,
    statuses.key.status,
    statuses.pair.status,
  ].includes("loading");

  const form = useFormContext<InboundFormValues>();

  const error = form.getFieldState("_tlsChecked", form.formState).error;

  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border p-4",
        disabled && "opacity-70",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">TLS certificates</div>
      </div>

      <StatusRow label="Сертификат (.crt)" status={statuses.crt} />
      <StatusRow label="Ключ (.key)" status={statuses.key} />
      <StatusRow label="Пара" status={statuses.pair} />

      <p className="text-muted-foreground text-xs">
        Проверка и генерация TLS сертификатов для inbound.
      </p>

      {error && (
        <div className="border-destructive/40 bg-destructive/5 mt-2 rounded-md border px-3 py-2">
          <p className="text-destructive text-sm font-medium">
            {error.message}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          disabled={disabled}
          loading={isChecking}
          size="sm"
          type="button"
          variant="outline"
          onClick={onCheck}
        >
          Проверить
        </Button>

        <Button
          disabled={disabled}
          loading={isChecking}
          size="sm"
          type="button"
          onClick={onGenerate}
        >
          <Wand2 />
          Сгенерировать
        </Button>
      </div>
    </div>
  );
}

const StatusRow = ({ status, label }: { status: TlsStatus; label: string }) => {
  const statusConfig = {
    idle: {
      label: "Не проверено",
      color: "bg-zinc-400 dark:bg-zinc-500",
      text: "text-muted-foreground",
      icon: null,
    },
    loading: {
      label: "Проверка...",
      color: "bg-blue-500",
      text: "text-blue-500",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
    },
    success: {
      label: "ОК",
      color: "bg-green-500",
      text: "text-green-600",
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    error: {
      label: "Ошибка",
      color: "bg-red-500",
      text: "text-red-600",
      icon: <ShieldX className="h-4 w-4" />,
    },
  };

  const current = statusConfig[status.status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={cn("h-2.5 w-2.5 rounded-full", current.color)} />
      <span className={current.text}>
        {label}: {status.message || "Неизвестно"}
      </span>
    </div>
  );
};
