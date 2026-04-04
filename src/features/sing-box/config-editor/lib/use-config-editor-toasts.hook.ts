import { useRef } from "react";

import { type ApiIssue } from "@/shared/api/contracts";
import { type IssueLike } from "@/shared/lib";
import { numWord } from "@/shared/lib/universal";
import { clientToast, serverToast, sonnerErrorCloseButton } from "@/shared/ui";

export function useConfigEditorToasts() {
  const clientErrorsToastIdsRef = useRef<(string | number)[]>([]);
  const mutationServerErrorsToastIdRef = useRef<string | number | null>(null);

  const dismissClientErrorsToasts = () => {
    clientErrorsToastIdsRef.current.forEach(clientToast.dismiss);
    clientErrorsToastIdsRef.current = [];
  };

  const dismissServerErrorsToasts = () => {
    if (mutationServerErrorsToastIdRef.current) {
      serverToast.dismiss(mutationServerErrorsToastIdRef.current);
      mutationServerErrorsToastIdRef.current = null;
    }
  };

  const showServerToast = (issues: ApiIssue[]) => {
    mutationServerErrorsToastIdRef.current = serverToast.error(
      `Конфиг не сохранён: ${issues.length} ${numWord(issues.length, ["ошибка", "ошибки", "ошибок"])}`,
      {
        ...sonnerErrorCloseButton,
        duration: 3000,
      },
    );
  };

  const showClientToasts = (issues: IssueLike[]) => {
    clientErrorsToastIdsRef.current = issues.map((issue) => {
      return clientToast.error(
        `Некорректное значение в ${issue.path.join(".")}`,
        {
          description: issue.message,
          ...sonnerErrorCloseButton,
        },
      );
    });
  };

  return {
    dismissClientErrorsToasts,
    dismissServerErrorsToasts,
    clientErrorsToastIdsRef,
    mutationServerErrorsToastIdRef,
    showServerToast,
    showClientToasts,
  };
}
