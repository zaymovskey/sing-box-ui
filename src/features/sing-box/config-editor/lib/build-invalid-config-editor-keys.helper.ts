export const buildInvalidConfigEditorKeys = (invalidKeys: Set<string>) => {
  const allInvalidKeys: Set<string> = new Set();

  invalidKeys.forEach((invalidKey) => {
    let currentKeyFamilyMember = "";
    const parts = invalidKey.split(".");
    parts.forEach((invalidKeyPart, index) => {
      currentKeyFamilyMember += (index === 0 ? "" : ".") + invalidKeyPart;
      allInvalidKeys.add(currentKeyFamilyMember);
    });
  });

  return new Set(allInvalidKeys);
};
