import { Activity } from "lucide-react";

import { type DiagnosticStatus } from "@/shared/api/contracts";

import { DiagnosticCard } from "../DiagnosticCard";

export function PortListeningInboundDiagnosticCard({
  status,
  message,
  details,
  isLoading = false,
  onRun,
}: {
  status: DiagnosticStatus;
  message: string;
  details: string[];
  isLoading?: boolean;
  onRun: () => void;
}) {
  return (
    <DiagnosticCard
      actionLabel="Запустить проверку"
      description="Проверяет, что нужный порт реально слушается на хосте и доступен для входящих подключений."
      details={details}
      icon={<Activity className="size-4" />}
      isLoading={isLoading}
      message={message}
      status={status}
      title="Port listening"
      onActionClick={onRun}
    />
  );
}
