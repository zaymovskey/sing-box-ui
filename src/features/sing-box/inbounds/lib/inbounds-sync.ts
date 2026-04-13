"use client";

const INBOUNDS_SYNC_CHANNEL = "sing-box-inbounds";
const INBOUNDS_CHANGED_EVENT = "inbounds-changed";

type InboundsSyncMessage = {
  type: typeof INBOUNDS_CHANGED_EVENT;
};

export function broadcastInboundsChanged() {
  if (
    typeof window === "undefined" ||
    typeof BroadcastChannel === "undefined"
  ) {
    return;
  }

  const channel = new BroadcastChannel(INBOUNDS_SYNC_CHANNEL);
  const message: InboundsSyncMessage = {
    type: INBOUNDS_CHANGED_EVENT,
  };

  channel.postMessage(message);
  channel.close();
}

export function subscribeToInboundsChanged(onChange: () => void) {
  if (
    typeof window === "undefined" ||
    typeof BroadcastChannel === "undefined"
  ) {
    return () => {};
  }

  const channel = new BroadcastChannel(INBOUNDS_SYNC_CHANNEL);

  channel.onmessage = (event: MessageEvent<InboundsSyncMessage>) => {
    if (event.data?.type === INBOUNDS_CHANGED_EVENT) {
      onChange();
    }
  };

  return () => {
    channel.close();
  };
}
