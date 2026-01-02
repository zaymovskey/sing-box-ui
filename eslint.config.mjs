import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default defineConfig([
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },

    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      ...importPlugin.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,

      "@typescript-eslint/no-explicit-any": "error",

      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "unused-imports/no-unused-imports": "error",

      "import/newline-after-import": ["error", { count: 1 }],
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },

  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "src/app/**/*.{ts,tsx,js,jsx}",
      "src/features/**/*.{ts,tsx,js,jsx}",
      "src/shared/**/*.{ts,tsx,js,jsx}",
    ],

    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*", "@/features/*/*/**"],
              message:
                "Импортируй фичи только через public API: @/features/<feature>",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message: "shared не должен импортить из app",
            },
            {
              group: ["@/features/**"],
              message: "shared не должен импортить из features",
            },
            {
              group: ["@/shared/**"],
              message:
                "Внутри shared не импортируй shared через alias (@/shared/*). Используй относительные импорты (./..).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message: "features не должны импортить из app",
            },
            {
              group: ["@/features/**"],
              message:
                "Импортируй фичи только через public API: @/features/<feature> (без deep-import)",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*", "@/features/*/*/**"],
              message:
                "Импортируй фичи только через public API: @/features/<feature> (без deep-import)",
            },
            {
              group: ["@/app/**"],
              message:
                "Внутри app не импортируй app через alias (@/app/*). Используй относительные импорты (./..).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/shared/ui/*",
                "@/shared/ui/*/**",
                "@/shared/lib/*",
                "@/shared/lib/*/**",
              ],
              message:
                "Импортируй из shared только через public API: @/shared/ui или @/shared/lib",
            },
          ],
        },
      ],
    },
  },

  globalIgnores([".next/**", "node_modules/**", "public/**"]),
]);
