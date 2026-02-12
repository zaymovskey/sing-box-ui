import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  UuidInput,
} from "@/shared/ui";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";

export function InboundFormVlessFields() {
  const form = useFormContext<InboundFormValues>();

  return (
    <div className="space-y-4">
      <div className="mt-7 mb-2 text-xl font-medium opacity-80">VLESS</div>
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
          name="uuid"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>UUID</FormLabel>{" "}
              <FormControl>
                <UuidInput
                  {...field}
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
          name="flow"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Flow (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="xtls-rprx-vision"
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
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <FormField
          control={form.control}
          name="reality_handshake_server"
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel>Handshake server</FormLabel>
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
      </div>

      <FormField
        control={form.control}
        name="reality_private_key"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel>Reality private key</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="private_key"
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
