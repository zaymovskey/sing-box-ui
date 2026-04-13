import { createContext, type ReactNode, useContext } from "react";

import { type InboundFormValues } from "@/features/sing-box/config-core";

const InboundFormContext = createContext<
  InboundFormContextValue<InboundFormValues> | undefined
>(undefined);

export const useInboundFormContext = <
  TInboundFormValues extends InboundFormValues = InboundFormValues,
>() => {
  const context = useContext(InboundFormContext);
  if (context === undefined) {
    throw new Error(
      "useInboundFormContext must be used within a InboundFormProvider",
    );
  }

  return context as InboundFormContextValue<TInboundFormValues>;
};

interface InboundFormContextValue<
  TInboundFormValues extends InboundFormValues = InboundFormValues,
> {
  mode: "edit" | "create";
  initialValues?: TInboundFormValues;
}

interface InboundFormProviderProps<
  TInboundFormValues extends InboundFormValues = InboundFormValues,
> {
  children: ReactNode;
  contextValue: InboundFormContextValue<TInboundFormValues>;
}

export const InboundFormProvider = <
  TInboundFormValues extends InboundFormValues = InboundFormValues,
>({
  children,
  contextValue: { mode, initialValues },
}: InboundFormProviderProps<TInboundFormValues>) => {
  return (
    <InboundFormContext.Provider
      value={{
        mode,
        initialValues,
      }}
    >
      {children}
    </InboundFormContext.Provider>
  );
};
