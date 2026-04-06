import { createContext, type ReactNode, useContext } from "react";

import { type InboundFormValues } from "@/features/sing-box/config-core";

const InboundFormContext = createContext<InboundFormContextValue | undefined>(
  undefined,
);

export const useInboundFormContext = () => {
  const context = useContext(InboundFormContext);
  if (context === undefined) {
    throw new Error(
      "useInboundFormContext must be used within a InboundFormProvider",
    );
  }
  return context;
};

interface InboundFormContextValue {
  mode: "edit" | "create";
  initialValues?: InboundFormValues;
}

interface InboundFormProviderProps {
  children: ReactNode;
  contextValue: InboundFormContextValue;
}

export const InboundFormProvider = ({
  children,
  contextValue: { mode, initialValues },
}: InboundFormProviderProps) => {
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
