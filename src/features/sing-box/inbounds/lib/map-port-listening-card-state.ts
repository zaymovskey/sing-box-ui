import {
  type DiagnosticStatus,
  type InboundDiagnosticPortListening,
} from "@/shared/api/contracts";
import { ApiError } from "@/shared/lib";

export type PortListeningCardState = {
  status: DiagnosticStatus;
  message: string;
  details: string[];
};

export function mapPortListeningCardState(
  diagnostic: InboundDiagnosticPortListening | undefined,
  error: unknown,
  port: number,
): PortListeningCardState {
  if (error instanceof ApiError) {
    if (error.code === "INBOUND_NOT_APPLIED") {
      return {
        status: "unknown",
        message: "Инбаунд еще не применен",
        details: [
          "Сохраненный draft еще не попал в runtime config.",
          "Нажми reload/apply и запусти проверку еще раз.",
        ],
      };
    }

    return {
      status: "error",
      message: "Проверка не удалась",
      details: [error.uiMessage],
    };
  }

  if (diagnostic?.status === "pass") {
    return {
      status: "pass",
      message: `Порт ${port} слушается`,
      details: [
        `Проверка подтвердила, что нужный порт ${port} находится в состоянии LISTEN.`,
      ],
    };
  }

  if (
    diagnostic?.status === "error" &&
    diagnostic.details?.reason === "not_listening"
  ) {
    return {
      status: "error",
      message: `Порт ${port} не слушается`,
      details: [`На хосте не найден listening socket для порта ${port}.`],
    };
  }

  if (
    diagnostic?.status === "error" &&
    diagnostic.details?.reason === "command_failed"
  ) {
    return {
      status: "error",
      message: "Проверка не удалась",
      details: [
        "Не удалось выполнить системную проверку порта внутри окружения UI.",
      ],
    };
  }

  return {
    status: "unknown",
    message: "Проверка еще не запускалась",
    details: ["Запусти проверку, чтобы получить актуальный runtime-статус."],
  };
}
