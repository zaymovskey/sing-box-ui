import { type Theme } from "json-edit-react";
import { type CSSProperties } from "react";

export const makeConfigEditorTheme = (invalidKeys: Set<string>): Theme => {
  const isInvalid = (path: (string | number)[]) => {
    const pathString = path.join(".");
    return invalidKeys.has(pathString);
  };

  const invalidBox: CSSProperties = {
    borderRadius: 2,
    padding: "2px 4px",
    background:
      "color-mix(in srgb, var(--destructive-foreground) 12%, transparent)",
  } as const;

  const checkInvalidBox = (path: (string | number)[]) => {
    if (isInvalid(path)) {
      return invalidBox;
    }
    return null;
  };

  return {
    styles: {
      property: ({ path }) => checkInvalidBox(path),
      input: ({ path }) => checkInvalidBox(path),
      string: ({ path }) => checkInvalidBox(path),
      number: ({ path }) => checkInvalidBox(path),
      boolean: ({ path }) => checkInvalidBox(path),
      null: ({ path }) => checkInvalidBox(path),
    },
  };
};
