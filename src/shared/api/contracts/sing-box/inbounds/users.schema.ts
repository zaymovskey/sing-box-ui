import { z } from "zod";

import { NonEmptyStringSchema, VlessFlowSchema } from "../core/inbounds.schema";
import {
  SaveBaseInboundUserSchema,
  StoredBaseInboundUserSchema,
} from "./base.schema";

export const VlessUserSchema = StoredBaseInboundUserSchema.extend({
  uuid: NonEmptyStringSchema,
  flow: VlessFlowSchema.optional(),
});

export const Hysteria2UserSchema = StoredBaseInboundUserSchema.extend({
  password: NonEmptyStringSchema,
});

export const SaveVlessUserSchema = SaveBaseInboundUserSchema.extend({
  uuid: NonEmptyStringSchema,
  flow: VlessFlowSchema.optional(),
});

export const SaveHysteria2UserSchema = SaveBaseInboundUserSchema.extend({
  password: NonEmptyStringSchema,
});

export const StoredInboundUserSchema = z.union([
  VlessUserSchema,
  Hysteria2UserSchema,
]);

export const SaveInboundUserSchema = z.union([
  SaveVlessUserSchema,
  SaveHysteria2UserSchema,
]);

export type Hysteria2User = z.infer<typeof Hysteria2UserSchema>;
export type VlessUser = z.infer<typeof VlessUserSchema>;

export type SaveHysteria2User = z.infer<typeof SaveHysteria2UserSchema>;
export type SaveVlessUser = z.infer<typeof SaveVlessUserSchema>;

export type StoredInboundUser = z.infer<typeof StoredInboundUserSchema>;
export type SaveInboundUser = z.infer<typeof SaveInboundUserSchema>;
