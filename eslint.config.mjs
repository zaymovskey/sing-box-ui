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
  // ---------------------------------------------------------------------------
  // 0) База
  // ---------------------------------------------------------------------------
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // ---------------------------------------------------------------------------
  // 1) Общие плагины/правила для всего проекта
  // ---------------------------------------------------------------------------
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
      // React/JSX
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,

      // import/*
      ...importPlugin.configs.recommended.rules,

      // a11y
      ...jsxA11y.configs.recommended.rules,

      // TS
      "@typescript-eslint/no-explicit-any": "error",

      // Next/React 17+ не требует import React
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // Сортировка импортов (у тебя это уже принято)
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Удаление неиспользуемых импортов
      "unused-imports/no-unused-imports": "error",

      // Пустая строка после импортов
      "import/newline-after-import": ["error", { count: 1 }],
    },

    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
      react: { version: "detect" },
    },
  },

  // Импорты и экспорты типов: заставить использовать type-imports/type-exports
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Импорты: заставить import { type X }
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      // Экспорты: заставить export type { X }
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 2) Shared layer
  //    - shared НЕ может импортить app/features
  //    - внутри shared не используем alias @/shared/** (только относительные)
  //    - shared/ui и shared/lib импортим снаружи только через public API
  //      (это правило мы повесим на app/features, а не на shared — см. ниже)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // 3) Features layer
  //    - features НЕ может импортить app
  //    - внутри features запрещаем alias deep-import @/features/**,
  //      чтобы внутри фичи использовали относительные импорты,
  //      а между фичами — public API
  //    - shared импортится ТОЛЬКО через public API (важно!)
  // ---------------------------------------------------------------------------
  {
    files: ["src/features/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // слойность: features -> app запрещено
            {
              group: ["@/app/**"],
              message: "features не должны импортить из app",
            },

            // внутри features: никакого alias deep-import (включая в себя)
            // => внутри фичи используем ../.., между фичами — только public API
            {
              group: ["@/features/**"],
              message:
                "Внутри features не импортируй через alias @/features/**. Используй относительные импорты внутри фичи, а между фичами — только public API @/features/<feature>.",
            },

            // shared: снаружи только public API
            {
              group: [
                "@/shared/ui/*",
                "@/shared/ui/*/**",
                "@/shared/lib/*",
                "!@/shared/lib/server",
                "@/shared/lib/*/**",
                "@/shared/lib/server/*",
                "@/shared/lib/server/*/**",
              ],
              message:
                "Импортируй из shared только через public API: @/shared/ui, @/shared/lib или @/shared/lib/server",
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 4) App layer
  //    - app может импортить features, но ТОЛЬКО через public API
  //    - внутри app не импортим app через alias @/app/**
  //    - shared импортится ТОЛЬКО через public API
  // ---------------------------------------------------------------------------
  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            // features: запрещаем deep-import из app
            // разрешено: "@/features/auth"
            // запрещено: "@/features/auth/login/model/..."
            {
              group: ["@/features/*/*", "@/features/*/*/**"],
              message:
                "Импортируй фичи только через public API: @/features/<feature> (без deep-import)",
            },

            // внутри app не импортим app через alias
            {
              group: ["@/app/**"],
              message:
                "Внутри app не импортируй app через alias (@/app/*). Используй относительные импорты (./..).",
            },

            // shared: снаружи только public API
            {
              group: [
                "@/shared/ui/*",
                "@/shared/ui/*/**",
                "@/shared/lib/*",
                "!@/shared/lib/server",
                "@/shared/lib/*/**",
                "@/shared/lib/server/*",
                "@/shared/lib/server/*/**",
              ],
              message:
                "Импортируй из shared только через public API: @/shared/ui, @/shared/lib или @/shared/lib/server",
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 5) Игноры
  // ---------------------------------------------------------------------------
  globalIgnores([".next/**", "node_modules/**", "public/**"]),
]);
