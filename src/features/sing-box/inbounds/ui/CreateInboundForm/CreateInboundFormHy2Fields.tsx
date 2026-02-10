import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
} from "@/shared/ui";

import { type CreateInboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function CreateInboundFormHy2Fields() {
  const form = useFormContext<CreateInboundFormValues>();

  return (
    <div className="space-y-4">
      <div className="mt-7 mb-2 text-xl font-medium opacity-80">Hysteria2</div>
      <Separator />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>User name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="user"
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
          name="password"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="password"
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
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="up_mbps"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Up (Mbps)</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="100"
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
          name="down_mbps"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Down (Mbps)</FormLabel>
              <FormControl>
                <Input
                  inputMode="numeric"
                  placeholder="100"
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

      <FormField
        control={form.control}
        name="obfs_password"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel>Obfs password (optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="obfs_password"
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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="tls_server_name"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>TLS server name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="www.cloudflare.com"
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
          name="certificate_path"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Certificate path (.crt)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="/etc/sing-box/cert.crt"
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
      </div>

      <FormField
        control={form.control}
        name="key_path"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel>Key path (.key)</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="/etc/sing-box/private.key"
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
    </div>
  );
}
