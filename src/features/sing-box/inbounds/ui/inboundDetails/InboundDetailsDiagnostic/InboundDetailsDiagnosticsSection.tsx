import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui";

import { mapPortListeningCardState } from "../../../lib/map-port-listening-card-state";
import { useRunInboundDiagnosticMutation } from "../../../model/mutations/run-inbound-diagnostic.mutation";
import { PortListeningInboundDiagnosticCard } from "./cards/PortListeningInboundDiagnosticCard";

export function InboundDetailsDiagnosticsSection({
  internalTag,
}: {
  internalTag: string;
}) {
  const {
    mutate: runInboundDiagnostic,
    isPending: diagnosticIsPending,
    data: diagnostic,
    error: diagnosticError,
  } = useRunInboundDiagnosticMutation();

  const portListeningDiagnostic = diagnostic?.find(
    (item) => item.key === "port_listening",
  );
  const portListeningCardState = mapPortListeningCardState(
    portListeningDiagnostic,
    diagnosticError,
  );

  const handleRunPortListeningDiagnostic = () => {
    runInboundDiagnostic({ internalTag, diagnostics: ["port_listening"] });
  };

  useEffect(() => {
    runInboundDiagnostic({ internalTag, diagnostics: ["port_listening"] });
  }, [runInboundDiagnostic, internalTag]);

  const handleRunAllDiagnostics = () => {
    runInboundDiagnostic({ internalTag, diagnostics: ["port_listening"] });
  };

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <CardTitle>Диагностика</CardTitle>
              <CardDescription>
                Быстрые runtime-проверки для этого инбаунда после применения
                конфига.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                loading={diagnosticIsPending}
                type="button"
                variant="outline"
                onClick={handleRunAllDiagnostics}
              >
                <RefreshCcw />
                Проверить заново
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <div className="grid gap-4 xl:grid-cols-3">
            <PortListeningInboundDiagnosticCard
              details={portListeningCardState.details}
              isLoading={diagnosticIsPending}
              message={portListeningCardState.message}
              status={portListeningCardState.status}
              onRun={handleRunPortListeningDiagnostic}
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
