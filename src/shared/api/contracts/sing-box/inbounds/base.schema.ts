import { z } from "zod";

import {
  ListenPortSchema,
  ListenSchema,
  NonEmptyStringSchema,
  SniffSchema,
} from "../core/inbounds.schema";

export const StoredBaseInboundSchema = z.object({
  id: NonEmptyStringSchema,
  display_tag: NonEmptyStringSchema,
  internal_tag: NonEmptyStringSchema,
  listen: ListenSchema.optional(),
  listen_port: ListenPortSchema.optional(),
  sniff: SniffSchema,
});

export const SaveBaseInboundSchema = z.object({
  display_tag: NonEmptyStringSchema,
  internal_tag: NonEmptyStringSchema.optional(),
  listen: ListenSchema.optional(),
  listen_port: ListenPortSchema,
  sniff: SniffSchema,
});

export const StoredBaseInboundUserSchema = z.object({
  internal_name: NonEmptyStringSchema,
  display_name: NonEmptyStringSchema,
});

export const SaveBaseInboundUserSchema = z.object({
  internal_name: NonEmptyStringSchema.optional(),
  display_name: NonEmptyStringSchema,
});

export type StoredBaseInbound = z.infer<typeof StoredBaseInboundSchema>;
export type SaveBaseInbound = z.infer<typeof SaveBaseInboundSchema>;

export type StoredBaseInboundUser = z.infer<typeof StoredBaseInboundUserSchema>;
export type SaveBaseInboundUser = z.infer<typeof SaveBaseInboundUserSchema>;
