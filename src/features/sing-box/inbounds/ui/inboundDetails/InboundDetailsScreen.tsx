"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useSecurityAssetsListQuery } from "@/features/security-assets";
import {
  InboundFormSchema,
  type InboundFormValues,
} from "@/features/sing-box/config-core";
import {
  type InboundsListResponse,
  type StoredInbound,
} from "@/shared/api/contracts";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  serverToast,
} from "@/shared/ui";

import { broadcastInboundsChanged } from "../../lib/inbounds-sync";
import { useInboundBindUniqueness } from "../../lib/use-inbound-bind-uniqueness";
import { useInboundDisplayTagUniqueness } from "../../lib/use-inbound-tag-uniqueness";
import {
  CONFIG_INVALID_AFTER_MAPPING,
  useEditInbound,
} from "../../model/commands/inbound-edit.command";
import { useInboundQuery } from "../../model/inbound.query";
import { useInboundsListQuery } from "../../model/inbounds-list.query";
import { useInboundsStatsQuery } from "../../model/inbounds-stats.query";
import { mapInboundToFormValues } from "../../model/mappers/inbound.form-mapper";
import { InboundDetailsActionsBar } from "./InboundDetailsActionsBar";
import { InboundDetailsDiagnosticsSection } from "./InboundDetailsDiagnostic/InboundDetailsDiagnosticsSection";
import { InboundDetailsFormSection } from "./InboundDetailsFormSection";
import { InboundDetailsSummaryHeader } from "./InboundDetailsSummaryHeader";
import { InboundDetailsUsersSection } from "./InboundDetailsUsersSection";

interface InboundDetailsScreenProps {
  internalTag: string;
}

const FORM_ID = "edit-inbound-form";

function getRawInbounds(
  response: InboundsListResponse | undefined,
): StoredInbound[] {
  return Array.isArray(response?.list) ? response.list : [];
}

export function InboundDetailsScreen({
  internalTag,
}: InboundDetailsScreenProps) {
  const { data: inbound, error, isPending } = useInboundQuery(internalTag);
  const { data: inboundsListResponse } = useInboundsListQuery();
  const { data: inboundsStats } = useInboundsStatsQuery();
  const { data: securityAssets } = useSecurityAssetsListQuery();

  const rawInbounds = useMemo(
    () => getRawInbounds(inboundsListResponse),
    [inboundsListResponse],
  );

  const inboundUsers = useMemo(() => inbound?.users ?? [], [inbound]);

  const inboundStats = useMemo(() => {
    return inboundsStats?.items.find(
      (item) => item.internal_tag === internalTag,
    );
  }, [inboundsStats, internalTag]);

  const mappedInbound = useMemo(() => {
    if (!inbound) {
      return undefined;
    }

    return mapInboundToFormValues(inbound);
  }, [inbound]);

  const [initialValues, setInitialValues] = useState<
    InboundFormValues | undefined
  >(mappedInbound);

  const [currentInboundTag, setCurrentInboundTag] = useState<
    string | undefined
  >(inbound?.display_tag);

  const form = useForm<InboundFormValues>({
    resolver: zodResolver(InboundFormSchema),
    mode: "onSubmit",
    shouldUnregister: true,
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (!mappedInbound || !inbound) {
      return;
    }

    setCurrentInboundTag(inbound.display_tag);
    setInitialValues(mappedInbound);

    form.reset(mappedInbound, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  }, [form, inbound, mappedInbound]);

  const tags = useMemo(() => {
    return rawInbounds
      .map((item) => item.display_tag)
      .filter((tag): tag is string => Boolean(tag));
  }, [rawInbounds]);

  const checkTagUniqueAndSetFormError = useInboundDisplayTagUniqueness(
    form,
    tags,
    currentInboundTag,
  );

  const checkBindUniqueAndSetError = useInboundBindUniqueness({
    form,
    inbounds: rawInbounds,
    excludeTag: currentInboundTag,
  });

  const { editInbound, isPending: isEditPending } = useEditInbound();

  const handleSubmit = async (values: InboundFormValues) => {
    if (!inbound) {
      return;
    }

    form.clearErrors("root");

    if (!checkTagUniqueAndSetFormError()) {
      return;
    }

    if (!checkBindUniqueAndSetError()) {
      return;
    }

    if (!currentInboundTag) {
      serverToast.error("Инбаунд должен иметь тег для редактирования", {
        id: "edit-inbound",
        duration: 3000,
      });
      return;
    }

    serverToast.loading("Сохранение...", { id: "edit-inbound" });

    try {
      await editInbound(inbound.internal_tag, values);

      serverToast.success("Инбаунд успешно обновлен", {
        id: "edit-inbound",
        duration: 3000,
      });
      broadcastInboundsChanged();

      setCurrentInboundTag(values.display_tag);
      setInitialValues(values);

      form.clearErrors();

      form.reset(values, {
        keepDirty: false,
        keepTouched: false,
        keepErrors: false,
        keepSubmitCount: false,
        keepIsSubmitted: false,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";

      if (msg === CONFIG_INVALID_AFTER_MAPPING) {
        serverToast.error("Конфиг получился невалидным (баг маппера).", {
          id: "edit-inbound",
          duration: 3000,
        });
        return;
      }

      serverToast.error("Не удалось обновить инбаунд", {
        description: `Message: ${msg}`,
        id: "edit-inbound",
        duration: 3000,
      });
    }
  };

  const handleReset = () => {
    if (!initialValues) {
      return;
    }

    form.clearErrors();

    form.reset(initialValues, {
      keepDirty: false,
      keepTouched: false,
      keepErrors: false,
      keepSubmitCount: false,
      keepIsSubmitted: false,
    });
  };

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3">
          <LoaderCircle className="text-muted-foreground size-4 animate-spin" />
          <span>Загрузка инбаунда...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Не удалось загрузить инбаунд</AlertTitle>
        <AlertDescription>{error.uiMessage}</AlertDescription>
      </Alert>
    );
  }

  if (!inbound) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Инбаунд не найден</AlertTitle>
        <AlertDescription>
          По `internalTag` `{internalTag}` ничего не нашлось.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 pb-14">
      {initialValues && (
        <>
          <InboundDetailsSummaryHeader
            inbound={inbound}
            inboundStats={inboundStats}
            usersCount={inboundUsers.length}
          />

          <InboundDetailsUsersSection
            inbound={inbound}
            inboundStats={inboundStats}
            securityAssets={securityAssets ?? []}
          />

          <InboundDetailsDiagnosticsSection />

          <InboundDetailsFormSection
            form={form}
            formId={FORM_ID}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          />

          <InboundDetailsActionsBar
            form={form}
            formId={FORM_ID}
            isPending={isEditPending}
            onReset={handleReset}
          />
        </>
      )}
    </div>
  );
}
