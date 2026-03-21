import { createContext, type ReactNode, useContext } from "react";

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
}

interface InboundFormProviderProps {
  children: ReactNode;
  contextValue: InboundFormContextValue;
}

export const InboundFormProvider = ({
  children,
  contextValue: { mode },
}: InboundFormProviderProps) => {
  return (
    <InboundFormContext.Provider
      value={{
        mode,
      }}
    >
      {children}
    </InboundFormContext.Provider>
  );
};
