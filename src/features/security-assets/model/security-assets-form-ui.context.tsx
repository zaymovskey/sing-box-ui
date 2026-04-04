import { createContext, type ReactNode, useContext } from "react";

const SecurityAssetFormContext = createContext<
  SecurityAssetFormContextValue | undefined
>(undefined);

export const useSecurityAssetFormContext = () => {
  const context = useContext(SecurityAssetFormContext);

  if (context === undefined) {
    throw new Error(
      "useSecurityAssetFormContext must be used within a SecurityAssetFormProvider",
    );
  }

  return context;
};

interface SecurityAssetFormContextValue {
  mode: "edit" | "create";
}

interface SecurityAssetFormProviderProps {
  children: ReactNode;
  contextValue: SecurityAssetFormContextValue;
}

export const SecurityAssetFormProvider = ({
  children,
  contextValue,
}: SecurityAssetFormProviderProps) => {
  return (
    <SecurityAssetFormContext.Provider value={contextValue}>
      {children}
    </SecurityAssetFormContext.Provider>
  );
};
