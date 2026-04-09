import { BrickWallFire } from "lucide-react";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { cn } from "@/shared/lib";
import { UncontrolledNumberField } from "@/shared/ui";

import {
  TCP_ONLY_PROTOCOLS,
  UDP_ONLY_PROTOCOLS,
} from "../../lib/protocols.constant";
import { useInboundFormContext } from "../../model/inbound-form-ui.context";

type FirewallProtocol = "TCP" | "UDP";

type FirewallChange = {
  type: "add" | "remove";
  protocol: FirewallProtocol;
  port: number;
};

type FirewallExposure = {
  protocol: FirewallProtocol;
  port: number;
};

function getProtocols(type: InboundFormValues["type"]): FirewallProtocol[] {
  if (TCP_ONLY_PROTOCOLS.includes(type)) {
    return ["TCP"];
  }

  if (UDP_ONLY_PROTOCOLS.includes(type)) {
    return ["UDP"];
  }

  return ["TCP", "UDP"];
}

function getFirewallExposures(
  type: InboundFormValues["type"] | undefined,
  port: number,
): FirewallExposure[] {
  if (!type) {
    return [];
  }

  return getProtocols(type).map((protocol) => ({
    protocol,
    port,
  }));
}

function isSameExposure(
  left: FirewallExposure,
  right: FirewallExposure,
): boolean {
  return left.protocol === right.protocol && left.port === right.port;
}

function getFirewallChanges(params: {
  mode: "create" | "edit";
  initialValues?: InboundFormValues;
  currentType: InboundFormValues["type"] | undefined;
  currentListenPort: number;
}): FirewallChange[] {
  const { mode, initialValues, currentType, currentListenPort } = params;

  const prevExposures =
    mode === "edit" && initialValues
      ? getFirewallExposures(initialValues.type, initialValues.listen_port)
      : [];

  const nextExposures = getFirewallExposures(currentType, currentListenPort);

  const changes: FirewallChange[] = [];

  for (const prevExposure of prevExposures) {
    const stillExists = nextExposures.some((nextExposure) =>
      isSameExposure(prevExposure, nextExposure),
    );

    if (!stillExists) {
      changes.push({
        type: "remove",
        protocol: prevExposure.protocol,
        port: prevExposure.port,
      });
    }
  }

  for (const nextExposure of nextExposures) {
    const alreadyExisted = prevExposures.some((prevExposure) =>
      isSameExposure(prevExposure, nextExposure),
    );

    if (!alreadyExisted) {
      changes.push({
        type: "add",
        protocol: nextExposure.protocol,
        port: nextExposure.port,
      });
    }
  }

  return changes;
}

export function FirewallListenPortChanger({
  className,
}: {
  className?: string;
}) {
  const { control, getFieldState, formState } =
    useFormContext<InboundFormValues>();

  const { mode, initialValues } = useInboundFormContext();

  const listenPort = useWatch({
    control,
    name: "listen_port",
  });

  const type = useWatch({
    control,
    name: "type",
  });

  const firewallChanges = useMemo(() => {
    return getFirewallChanges({
      mode,
      initialValues,
      currentType: type,
      currentListenPort: listenPort,
    });
  }, [initialValues, listenPort, mode, type]);

  const error = getFieldState("listen_port", formState).error;
  const message = error?.message?.toString() ?? "";

  return (
    <div className={cn(className, "flex flex-col gap-2")}>
      <UncontrolledNumberField<InboundFormValues>
        label="Listen port"
        name="listen_port"
        placeholder="8443"
        showErrorMessage={false}
      />

      <div className="bg-muted/30 min-h-[90px] rounded-md border px-3 py-3 text-sm">
        <div className="flex items-start gap-2">
          <BrickWallFire className="text-chart-5 mt-0.5 size-4 shrink-0" />

          <div className="flex-1 space-y-2">
            <p className="text-foreground font-medium">
              Planned firewall changes
            </p>

            <div className="space-y-1 font-mono text-xs">
              {firewallChanges.length === 0 && (
                <p className="text-foreground/70">No changes needed</p>
              )}

              {firewallChanges.map((change, index) => (
                <div
                  key={`${change.type}-${change.protocol}-${change.port}-${index}`}
                  className={cn(
                    "flex items-center gap-2",
                    change.type === "add" ? "text-green-600" : "text-red-600",
                  )}
                >
                  <span className="font-semibold">
                    {change.type === "add" ? "+" : "-"}
                  </span>

                  <span>
                    {change.type === "add" ? "allow" : "remove"}{" "}
                    {change.protocol} {change.port}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="text-destructive min-h-5 text-sm">{message}</div>
    </div>
  );
}
