import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
} from "@/shared/ui";

import { type CreateInboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function CreateInboundFormBaseFields() {
  const form = useFormContext<CreateInboundFormValues>();

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Tag</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="in-01"
                  onChange={(e) => {
                    form.clearErrors("root");
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="listen_port"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Listen port</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="8443"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    form.clearErrors("root");
                    const n = e.target.valueAsNumber;
                    field.onChange(Number.isNaN(n) ? undefined : n);
                  }}
                />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reality_handshake_port"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Handshake port</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="443"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    form.clearErrors("root");
                    const n = e.target.valueAsNumber;
                    field.onChange(Number.isNaN(n) ? undefined : n);
                  }}
                />
              </FormControl>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="sniff"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <FormLabel className="m-0">Sniff</FormLabel>
                <div className="text-muted-foreground text-xs">
                  Автодетект протокола/домена
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={(v) => {
                    form.clearErrors("root");
                    field.onChange(v);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sniff_override_destination"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-md border p-3">
              <div className="space-y-1">
                <FormLabel className="m-0">Override destination</FormLabel>
                <div className="text-muted-foreground text-xs">
                  Подменять destination по sniff
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={Boolean(field.value)}
                  onCheckedChange={(v) => {
                    form.clearErrors("root");
                    field.onChange(v);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
