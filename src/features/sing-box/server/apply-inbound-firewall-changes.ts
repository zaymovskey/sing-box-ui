import {
  TCP_ONLY_PROTOCOLS,
  TCP_UDP_PROTOCOLS,
  UDP_ONLY_PROTOCOLS,
} from "@/features/sing-box";
import { type InboundDbType } from "@/shared/api/contracts";
import { ApiError } from "@/shared/lib";
import { allowPort, removePort } from "@/shared/server";

type FirewallProtocol = "tcp" | "udp";

type FirewallExposure = {
  port: number;
  protocol: FirewallProtocol;
};

type FirewallChange = {
  port: number;
  protocol: FirewallProtocol;
  action: "add" | "delete";
};

function getFirewallProtocols(vpnProtocol: InboundDbType): FirewallProtocol[] {
  if (TCP_UDP_PROTOCOLS.includes(vpnProtocol)) {
    return ["tcp", "udp"];
  }

  if (UDP_ONLY_PROTOCOLS.includes(vpnProtocol)) {
    return ["udp"];
  }

  if (TCP_ONLY_PROTOCOLS.includes(vpnProtocol)) {
    return ["tcp"];
  }

  throw new ApiError(400, "Unsupported protocol type");
}

function getExposures(
  vpnProtocol: InboundDbType,
  listenPort: number | null | undefined,
): FirewallExposure[] {
  if (
    typeof listenPort !== "number" ||
    !Number.isInteger(listenPort) ||
    listenPort < 1 ||
    listenPort > 65535
  ) {
    return [];
  }

  return getFirewallProtocols(vpnProtocol).map((protocol) => ({
    port: listenPort,
    protocol,
  }));
}

function isSameExposure(a: FirewallExposure, b: FirewallExposure): boolean {
  return a.port === b.port && a.protocol === b.protocol;
}

function buildFirewallChanges(
  prev: FirewallExposure[],
  next: FirewallExposure[],
): FirewallChange[] {
  const changes: FirewallChange[] = [];

  for (const prevExposure of prev) {
    const stillExists = next.some((nextExposure) =>
      isSameExposure(prevExposure, nextExposure),
    );

    if (!stillExists) {
      changes.push({
        ...prevExposure,
        action: "delete",
      });
    }
  }

  for (const nextExposure of next) {
    const alreadyExists = prev.some((prevExposure) =>
      isSameExposure(prevExposure, nextExposure),
    );

    if (!alreadyExists) {
      changes.push({
        ...nextExposure,
        action: "add",
      });
    }
  }

  return changes;
}

type AllowParams =
  | {
      mode: "add";
      vpnProtocol: InboundDbType;
      listenPort: number;
    }
  | {
      mode: "remove";
      vpnProtocol: InboundDbType;
      prevPort: number;
    }
  | {
      mode: "update";
      vpnProtocol: InboundDbType;
      listenPort: number;
      prevPort: number;
    };

export async function applyInboundFirewallChanges(
  params: AllowParams,
): Promise<void> {
  let prevExposures: FirewallExposure[] = [];
  let nextExposures: FirewallExposure[] = [];

  if (params.mode === "add") {
    nextExposures = getExposures(params.vpnProtocol, params.listenPort);
  }

  if (params.mode === "remove") {
    prevExposures = getExposures(params.vpnProtocol, params.prevPort);
  }

  if (params.mode === "update") {
    prevExposures = getExposures(params.vpnProtocol, params.prevPort);
    nextExposures = getExposures(params.vpnProtocol, params.listenPort);
  }

  const changeList = buildFirewallChanges(prevExposures, nextExposures);

  for (const change of changeList) {
    if (change.action === "add") {
      await allowPort(change.port, change.protocol);
    } else {
      await removePort(change.port, change.protocol);
    }
  }
}
