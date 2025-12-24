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
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  globalIgnores([".next/**", "node_modules/**", "public/**"]),
]);
