import { useCallback, useEffect } from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";

import {
  type InboundFormValues,
  isUniqueInboundDisplayTag,
} from "@/features/sing-box/config-core";

export function useInboundDisplayTagUniqueness(
  form: UseFormReturn<InboundFormValues>,
  displayTags: string[],
  excludeDisplayTag?: string,
) {
  const currentDisplayTag = useWatch({
    control: form.control,
    name: "display_tag",
  });

  const {
    formState: { submitCount, errors },
  } = form;

  const displayTagError = errors.display_tag;

  const checkDisplayTagUniqueAndSetFormError = useCallback(() => {
    if (!currentDisplayTag?.trim()) {
      return true;
    }

    const isDisplayTagUnique = isUniqueInboundDisplayTag({
      tag: currentDisplayTag,
      tags: displayTags,
      excludeTag: excludeDisplayTag,
    });

    if (!isDisplayTagUnique) {
      const hasSameCustomError =
        displayTagError?.type === "custom" &&
        displayTagError.message === "Тег должен быть уникальным";

      if (!hasSameCustomError) {
        form.setError("display_tag", {
          type: "custom",
          message: "Тег должен быть уникальным",
        });
      }

      return false;
    }

    if (displayTagError?.type === "custom") {
      form.clearErrors("display_tag");
    }

    return true;
  }, [
    currentDisplayTag,
    displayTags,
    excludeDisplayTag,
    displayTagError,
    form,
  ]);

  useEffect(() => {
    if (submitCount === 0) {
      return;
    }

    void checkDisplayTagUniqueAndSetFormError();
  }, [submitCount, checkDisplayTagUniqueAndSetFormError]);

  return checkDisplayTagUniqueAndSetFormError;
}
