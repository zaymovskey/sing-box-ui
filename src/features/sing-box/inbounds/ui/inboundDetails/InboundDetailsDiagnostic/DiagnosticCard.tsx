import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import { cn } from "@/shared/lib";
import { Button, Skeleton } from "@/shared/ui";

type DemoDiagnosticStatus = "pass" | "warn" | "fail" | "unknown";

function getTone(status: DemoDiagnosticStatus) {
  switch (status) {
    case "pass":
      return {
        label: "Healthy",
        badgeClass:
          "bg-emerald-500/10 text-emerald-600 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        iconWrapClass:
          "bg-emerald-500/10 text-emerald-600 flex size-9 items-center justify-center rounded-xl",
        messageIconClass:
          "bg-emerald-500/10 text-emerald-600 flex size-8 shrink-0 items-center justify-center rounded-lg",
        messageIcon: <CheckCircle2 className="size-4" />,
      };
    case "warn":
      return {
        label: "Warning",
        badgeClass:
          "bg-amber-500/10 text-amber-600 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        iconWrapClass:
          "bg-amber-500/10 text-amber-600 flex size-9 items-center justify-center rounded-xl",
        messageIconClass:
          "bg-amber-500/10 text-amber-600 flex size-8 shrink-0 items-center justify-center rounded-lg",
        messageIcon: <AlertTriangle className="size-4" />,
      };
    case "fail":
      return {
        label: "Failed",
        badgeClass:
          "bg-red-500/10 text-red-600 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        iconWrapClass:
          "bg-red-500/10 text-red-600 flex size-9 items-center justify-center rounded-xl",
        messageIconClass:
          "bg-red-500/10 text-red-600 flex size-8 shrink-0 items-center justify-center rounded-lg",
        messageIcon: <XCircle className="size-4" />,
      };
    case "unknown":
      return {
        label: "Unknown",
        badgeClass:
          "bg-muted text-muted-foreground flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        iconWrapClass:
          "bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-xl",
        messageIconClass:
          "bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg",
        messageIcon: <Info className="size-4" />,
      };
  }
}

export function DiagnosticCard({
  title,
  subtitle,
  message,
  description,
  details,
  status,
  icon,
  actionLabel,
  isLoading = false,
}: {
  title: string;
  subtitle: string;
  message: string;
  description: string;
  details: string[];
  status: DemoDiagnosticStatus;
  icon: React.ReactNode;
  actionLabel: string;
  isLoading?: boolean;
}) {
  const tone = getTone(status);

  return (
    <div
      className={cn(
        "bg-background rounded-2xl border p-5 shadow-sm transition-all",
        isLoading && "relative overflow-hidden",
      )}
    >
      {isLoading && (
        <div className="from-primary/0 via-primary/5 to-primary/0 pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.2s_infinite] bg-linear-to-r" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                tone.iconWrapClass,
                isLoading && "border-primary/20 bg-primary/8 text-primary",
              )}
            >
              {isLoading ? (
                <RefreshCcw className="size-4 animate-spin" />
              ) : (
                icon
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{title}</div>
              {isLoading ? (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-primary text-xs font-medium">
                    Проверка выполняется...
                  </span>
                </div>
              ) : (
                <div className="text-muted-foreground text-xs">{subtitle}</div>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-primary/10 text-primary flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <RefreshCcw className="size-3.5 animate-spin" />
            Running
          </div>
        ) : (
          <div className={tone.badgeClass}>
            {tone.messageIcon}
            {tone.label}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-xl border px-4 py-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              tone.messageIconClass,
              isLoading && "border-primary/20 bg-primary/8 text-primary",
            )}
          >
            {isLoading ? (
              <RefreshCcw className="size-4 animate-spin" />
            ) : (
              tone.messageIcon
            )}
          </div>
          <div className="space-y-1">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3.5 w-full max-w-80" />
                <Skeleton className="h-3.5 w-48" />
              </div>
            ) : (
              <>
                <div className="text-sm font-medium">{message}</div>
                <div className="text-muted-foreground text-sm">
                  {description}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {isLoading
          ? Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm"
              >
                <Skeleton className="size-3.5 shrink-0 rounded-full" />
                <Skeleton className="h-3.5 w-full" />
              </div>
            ))
          : details.map((item) => (
              <div
                key={item}
                className="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm"
              >
                <Info className="mt-0.5 size-3.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
        <div className="text-muted-foreground text-xs">
          {isLoading
            ? "Идет запуск только этой проверки"
            : "Можно прогнать только эту проверку отдельно"}
        </div>
        <Button
          loading={isLoading}
          size="sm"
          type="button"
          variant={isLoading ? "secondary" : "outline"}
        >
          <RefreshCcw />
          {isLoading ? "Запуск..." : actionLabel}
        </Button>
      </div>
    </div>
  );
}
