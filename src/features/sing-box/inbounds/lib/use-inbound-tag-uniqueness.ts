import { useCallback, useEffect } from "react";
import { type UseFormReturn, useWatch } from "react-hook-form";

import {
  type InboundFormValues,
  isUniqueInboundTag,
} from "@/features/sing-box/config-core";

export function useInboundTagUniqueness(
  form: UseFormReturn<InboundFormValues>,
  tags: string[],
  excludeTag?: string,
) {
  const currentTag = useWatch({
    control: form.control,
    name: "tag",
  });

  const {
    formState: { submitCount, errors },
  } = form;

  const checkTagUniqueAndSetFormError = useCallback(() => {
    if (!currentTag?.trim()) {
      return true;
    }

    const isTagUnique = isUniqueInboundTag({
      tag: currentTag,
      tags,
      excludeTag,
    });

    if (!isTagUnique) {
      const hasSameCustomError =
        errors.tag?.type === "custom" &&
        errors.tag.message === "Тег должен быть уникальным";

      if (!hasSameCustomError) {
        form.setError("tag", {
          type: "custom",
          message: "Тег должен быть уникальным",
        });
      }

      return false;
    }

    if (errors.tag?.type === "custom") {
      form.clearErrors("tag");
    }

    return true;
  }, [currentTag, errors.tag, form, tags, excludeTag]);

  useEffect(() => {
    if (submitCount === 0) {
      return;
    }

    void checkTagUniqueAndSetFormError();
  }, [submitCount, checkTagUniqueAndSetFormError]);

  return checkTagUniqueAndSetFormError;
}
