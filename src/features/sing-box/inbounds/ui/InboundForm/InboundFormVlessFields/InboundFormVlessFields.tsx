import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { useSecurityAssetsListQuery } from "@/features/security-assets";
import { type InboundFormValues } from "@/features/sing-box/config-core";
import {
  Button,
  ControlledSelectField,
  ControlledSwitchField,
  type SelectFieldItem,
  Separator,
  UncontrolledTextField,
  UncontrolledUuidField,
} from "@/shared/ui";

export function InboundFormVlessFields() {
  const { control, trigger, formState } = useFormContext<InboundFormValues>();
  const { data: securityAssetsList } = useSecurityAssetsListQuery({
    type: "reality",
  });

  const securityAssetsOptions: SelectFieldItem[] = securityAssetsList
    ? securityAssetsList.map((asset) => ({
        value: asset.id,
        label: asset.name,
      }))
    : [];

  const {
    fields: users,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "users",
  });

  const watchedUsers = useWatch({
    control,
    name: "users",
  });

  useEffect(() => {
    if (formState.submitCount === 0) {
      return;
    }

    void trigger("users");
  }, [watchedUsers, formState.submitCount, trigger]);

  const tlsEnabled = useWatch({
    control,
    name: "tls_enabled",
  });

  return (
    <div className="mb-10 space-y-4">
      {users.map((user, index) => (
        <div key={user.id} className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Пользователь {index + 1}</h4>

            <Button
              disabled={users.length === 1}
              size="icon"
              type="button"
              variant="outline"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <UncontrolledTextField<InboundFormValues>
              label="User name"
              name={`users.${index}.name`}
              placeholder="user"
            />

            <UncontrolledUuidField<InboundFormValues>
              label="UUID"
              name={`users.${index}.uuid`}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />

            <UncontrolledTextField<InboundFormValues>
              label="Flow (optional)"
              name={`users.${index}.flow`}
              placeholder="xtls-rprx-vision"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({
            name: "",
            uuid: "",
            flow: "",
          })
        }
      >
        Добавить пользователя
      </Button>
      <Separator />
      <ControlledSwitchField<InboundFormValues>
        label="Reality enabled"
        name="tls_enabled"
      />
      <ControlledSelectField<InboundFormValues>
        disabled={!tlsEnabled}
        items={securityAssetsOptions}
        label="Reality"
        name="_security_asset_id"
        placeholder="Reality"
      />
    </div>
  );
}
