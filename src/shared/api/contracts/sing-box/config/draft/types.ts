import { type Configuration } from "@black-duty/sing-box-schema";
import type z from "zod";

type BaseConfig = z.output<typeof Configuration>;
type BaseInbound = NonNullable<BaseConfig["inbounds"]>[number];

type BaseVlessInbound = Extract<BaseInbound, { type: "vless" }>;
type BaseHysteria2Inbound = Extract<BaseInbound, { type: "hysteria2" }>;
type OtherInbound = Exclude<
  BaseInbound,
  BaseVlessInbound | BaseHysteria2Inbound
>;

export type DraftVlessInbound = Omit<BaseVlessInbound, "tls"> & {
  tls?: BaseVlessInbound["tls"] & {
    reality?: NonNullable<BaseVlessInbound["tls"]>["reality"] & {
      _reality_public_key?: string;
    };
  };
};

export type DraftHysteria2Inbound = Omit<BaseHysteria2Inbound, "tls"> & {
  tls?: BaseHysteria2Inbound["tls"] & {
    _is_selfsigned_cert?: boolean;
  };
};

export type DraftInbound =
  | DraftVlessInbound
  | DraftHysteria2Inbound
  | OtherInbound;

export type DraftConfig = Omit<BaseConfig, "inbounds"> & {
  inbounds?: DraftInbound[];
};
