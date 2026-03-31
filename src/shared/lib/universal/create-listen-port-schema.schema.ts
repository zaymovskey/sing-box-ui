import { z } from "zod";

import { isAllowedListenPort } from "./is-allowed-listen-port.hepler";

interface CreateListenPortSchemaParams {
  rangeStart: number;
  rangeEnd: number;
  requiredMessage?: string;
  integerMessage?: string;
  minMessage?: string;
  maxMessage?: string;
  rangeMessage?: string;
}

export function createListenPortSchema({
  rangeStart,
  rangeEnd,
  requiredMessage = "Порт должен быть числом",
  integerMessage = "Порт должен быть целым числом",
  minMessage = "Минимум 1",
  maxMessage = "Максимум 65535",
  rangeMessage = `Порт должен быть 443, 8443 или в диапазоне ${rangeStart}-${rangeEnd}`,
}: CreateListenPortSchemaParams) {
  return z
    .number(requiredMessage)
    .int(integerMessage)
    .min(1, minMessage)
    .max(65535, maxMessage)
    .refine((port) => isAllowedListenPort(port, rangeStart, rangeEnd), {
      message: rangeMessage,
    });
}
