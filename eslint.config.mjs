import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const appRestrictedImportPatterns = [
  {
    group: ["@/app/**"],
    message:
      "Внутри app не импортируй app через alias (@/app/**). Используй относительные импорты (./..).",
  },

  // Features: запрещаем deep-import (разрешён только public API)
  {
    group: ["@/features/*/*", "@/features/*/*/**"],
    message:
      "Импортируй фичи только через public API: @/features/<feature> (без deep-import).",
  },

  // Widgets: запрещаем deep-import (разрешён только public API)
  {
    group: ["@/widgets/*/*", "@/widgets/*/*/**"],
    message:
      "Импортируй виджеты только через public API: @/widgets/<widget> (без deep-import).",
  },

  // shared/ui: только public API
  {
    group: ["@/shared/ui/*", "@/shared/ui/*/**"],
    message: "Импортируй из shared/ui только через public API: @/shared/ui",
  },

  // shared/lib: только @/shared/lib или @/shared/lib/server
  {
    group: [
      "@/shared/lib/*",
      "@/shared/lib/*/**",
      "!@/shared/lib/server",
      "!@/shared/lib/server/**",
    ],
    message:
      "Импортируй из shared/lib только через public API: @/shared/lib или @/shared/lib/server",
  },

  // shared/lib/server: запрещаем deep-import
  {
    group: ["@/shared/lib/server/*", "@/shared/lib/server/*/**"],
    message:
      "Импортируй из shared/lib/server только через public API: @/shared/lib/server",
  },
];

export default defineConfig([
  // ---------------------------------------------------------------------------
  // База
  // ---------------------------------------------------------------------------
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // ---------------------------------------------------------------------------
  // Общие плагины/правила для всего проекта
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
  // Shared layer
  //  - shared НЕ может импортить app/features/widgets
  //  - внутри shared не используем alias @/shared/** (только относительные)
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
              group: ["@/widgets/**"],
              message: "shared не должен импортить из widgets",
            },

            {
              group: ["@/shared/**"],
              message:
                "Внутри shared не импортируй shared через alias (@/shared/**). Используй относительные импорты (./..).",
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Features layer
  //  - features НЕ может импортить app
  //  - внутри features не используем alias @/features/** (только относительные)
  //  - features может импортить другие features только через public API @/features/<feature>
  //  - shared импортится ТОЛЬКО через public API: @/shared/ui, @/shared/lib, @/shared/lib/server
  // ---------------------------------------------------------------------------
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
                "Внутри features не импортируй через alias (@/features/**). Используй относительные импорты (./..).",
            },

            // Между фичами: запрещаем deep-import (разрешён только @/features/<feature>)
            {
              group: ["@/features/*/*", "@/features/*/*/**"],
              message:
                "Импортируй другие фичи только через public API: @/features/<feature> (без deep-import).",
            },

            // shared/ui: только @/shared/ui
            {
              group: ["@/shared/ui/*", "@/shared/ui/*/**"],
              message:
                "Импортируй из shared/ui только через public API: @/shared/ui",
            },

            // shared/lib: только @/shared/lib или @/shared/lib/server
            {
              group: [
                "@/shared/lib/*",
                "@/shared/lib/*/**",
                "!@/shared/lib/server",
                "!@/shared/lib/server/**",
              ],
              message:
                "Импортируй из shared/lib только через public API: @/shared/lib или @/shared/lib/server",
            },

            // shared/lib/server: запрещаем deep-import (разрешён только @/shared/lib/server)
            {
              group: ["@/shared/lib/server/*", "@/shared/lib/server/*/**"],
              message:
                "Импортируй из shared/lib/server только через public API: @/shared/lib/server",
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Widgets layer
  //  - widgets НЕ может импортить app
  //  - внутри widgets не используем alias @/widgets/** (только относительные)
  //  - widgets может импортить features только через public API @/features/<feature>
  //  - shared импортится ТОЛЬКО через public API
  // ---------------------------------------------------------------------------
  {
    files: ["src/widgets/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message: "widgets не должны импортить из app",
            },

            {
              group: ["@/widgets/**"],
              message:
                "Внутри widgets не импортируй через alias (@/widgets/**). Используй относительные импорты (./..).",
            },

            // Между виджетами: запрещаем deep-import (разрешён только @/widgets/<widget>)
            {
              group: ["@/widgets/*/*", "@/widgets/*/*/**"],
              message:
                "Импортируй другие виджеты только через public API: @/widgets/<widget> (без deep-import).",
            },

            // Features: запрещаем deep-import (разрешён только @/features/<feature>)
            {
              group: ["@/features/*/*", "@/features/*/*/**"],
              message:
                "Импортируй фичи только через public API: @/features/<feature> (без deep-import).",
            },

            // shared/ui: только @/shared/ui
            {
              group: ["@/shared/ui/*", "@/shared/ui/*/**"],
              message:
                "Импортируй из shared/ui только через public API: @/shared/ui",
            },

            // shared/lib: только @/shared/lib или @/shared/lib/server
            {
              group: [
                "@/shared/lib/*",
                "@/shared/lib/*/**",
                "!@/shared/lib/server",
                "!@/shared/lib/server/**",
              ],
              message:
                "Импортируй из shared/lib только через public API: @/shared/lib или @/shared/lib/server",
            },

            // shared/lib/server: запрещаем deep-import
            {
              group: ["@/shared/lib/server/*", "@/shared/lib/server/*/**"],
              message:
                "Импортируй из shared/lib/server только через public API: @/shared/lib/server",
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // App layer
  //  - app может импортить features/widgets (но соблюдая public API)
  //  - внутри app не используем alias @/app/** (только относительные)
  //  - shared импортится ТОЛЬКО через public API
  // ---------------------------------------------------------------------------
  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: appRestrictedImportPatterns,
        },
      ],
    },
  },

  // Запрет импорта NextResponse в route.ts
  {
    files: ["src/app/api/**/route.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: appRestrictedImportPatterns,
          paths: [
            {
              name: "next/server",
              importNames: ["NextResponse"],
              message:
                'Не импортируй NextResponse в route.ts. Используй okJson/errorJson из "@/shared/api/http".',
            },
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Игноры
  // ---------------------------------------------------------------------------
  globalIgnores([".next/**", "node_modules/**", "public/**"]),
]);
