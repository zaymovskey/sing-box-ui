import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
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
    portListeningDiagnostic?.details?.port ?? 0,
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
    <div>
      <Card className="w-full gap-0 overflow-hidden rounded-t-none py-0">
        <div className="max-w-6xl px-6 pt-4 pb-6">
          <CardHeader className="px-0 pt-0">
            <div className="flex flex-col gap-4 lg:items-start lg:justify-between">
              <div className="space-y-1">
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
                  Запустить все проверки заново
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 px-0 pb-0">
            <PortListeningInboundDiagnosticCard
              details={portListeningCardState.details}
              isLoading={diagnosticIsPending}
              message={portListeningCardState.message}
              status={portListeningCardState.status}
              onRun={handleRunPortListeningDiagnostic}
            />
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
