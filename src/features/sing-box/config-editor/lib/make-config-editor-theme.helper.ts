import { githubDarkTheme, type ThemeInput } from "json-edit-react";
import { type CSSProperties } from "react";

export const makeConfigEditorTheme = (invalidKeys: Set<string>): ThemeInput => {
  const isInvalid = (path: (string | number)[]) => {
    const pathString = path.join(".");
    return invalidKeys.has(pathString);
  };

  const invalidBox: CSSProperties = {
    borderRadius: 6,
    padding: "2px 4px",
    background: "color-mix(in srgb, var(--destructive) 12%, transparent)",
    border: "1px solid color-mix(in srgb, var(--destructive) 35%, transparent)",
  };

  const checkInvalidBox = (path: (string | number)[]) => {
    if (isInvalid(path)) {
      return invalidBox;
    }

    return null;
  };

  return [
    githubDarkTheme,
    {
      styles: {
        container: {
          backgroundColor: "var(--background)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          fontFamily: "var(--font-geist-mono, monospace)",
        },

        collection: {
          backgroundColor: "transparent",
          color: "var(--card-foreground)",
        },

        collectionInner: {
          backgroundColor: "transparent",
        },

        collectionElement: {
          backgroundColor: "transparent",
        },

        dropZone: {
          backgroundColor:
            "color-mix(in srgb, var(--primary) 12%, transparent)",
        },

        property: [
          {
            // color: "oklch(92% 0.01 250deg)",
            color:
              "light-dark(color-mix(in srgb, var(--foreground) 55%, var(--muted-foreground)), color-mix(in srgb, var(--foreground) 30%, var(--muted-foreground)))",
          },
          ({ path }: { path: (string | number)[] }) => checkInvalidBox(path),
        ],

        bracket: {
          color: "light-dark(oklch(55% 0.04 285deg), oklch(76% 0.03 285deg))",
          fontWeight: "bold",
        },

        itemCount: {
          color: "var(--muted-foreground)",
          fontStyle: "italic",
        },

        string: [
          {
            color: "light-dark(oklch(62% 0.09 230deg), oklch(72% 0.06 230deg))",
          },
          ({ path }: { path: (string | number)[] }) => checkInvalidBox(path),
        ],

        number: [
          {
            color: "light-dark(oklch(65% 0.11 300deg), oklch(78% 0.07 300deg))",
          },
          ({ path }: { path: (string | number)[] }) => checkInvalidBox(path),
        ],

        boolean: [
          {
            color: "light-dark(oklch(62% 0.16 20deg), oklch(74% 0.12 20deg))",
            fontWeight: 600,
          },
          ({ path }: { path: (string | number)[] }) => checkInvalidBox(path),
        ],

        null: [
          {
            color: "var(--destructive)",
            fontVariant: "small-caps",
            fontWeight: "bold",
          },
          ({ path }: { path: (string | number)[] }) => checkInvalidBox(path),
        ],

        input: [
          {
            color: "var(--foreground)",
            backgroundColor: "var(--background)",
            border: "1px solid var(--input)",
            borderRadius: "6px",
          },
          ({ path }: { path: (string | number)[] }) => checkInvalidBox(path),
        ],

        inputHighlight: "color-mix(in srgb, var(--ring) 28%, transparent)",

        error: {
          fontSize: "0.8em",
          color: "var(--destructive)",
          fontWeight: "bold",
        },

        iconCollection:
          "light-dark(oklch(60% 0.04 285deg), oklch(78% 0.03 285deg))",
        iconEdit: "var(--muted-foreground)",
        iconDelete: "var(--destructive)",
        iconAdd: "light-dark(oklch(62% 0.09 230deg), oklch(72% 0.06 230deg))",
        iconCopy: "var(--muted-foreground)",
        iconOk: "oklch(72% 0.06 230deg)",
        iconCancel: "var(--destructive)",
      },
    },
  ];
};
