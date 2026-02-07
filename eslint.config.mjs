import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

const block = (group, message) => ({
  group,
  message,
});

// ----------------------------------------------------------------------------
// Общие паттерны (переиспользуемые)
// ----------------------------------------------------------------------------

const blockAppAlias = () =>
  block(
    ["@/app/**"],
    "Внутри app не импортируй app через alias (@/app/**). Используй относительные импорты (./..).",
  );

const blockLayerAlias = (layer) =>
  block(
    [`@/${layer}/**`],
    `Внутри ${layer} не импортируй ${layer} через alias (@/${layer}/**). Используй относительные импорты (./..).`,
  );

const blockDeepImport = (layer, entity) =>
  block(
    [`@/${layer}/*/*`, `@/${layer}/*/*/**`],
    `Импортируй ${entity} только через public API: @/${layer}/<${entity}> (без deep-import).`,
  );

const blockSharedPublicApi = () => [
  // shared/ui: только public API
  block(
    ["@/shared/ui/*", "@/shared/ui/*/**"],
    "Импортируй из shared/ui только через public API: @/shared/ui",
  ),

  // shared/lib: только @/shared/lib или @/shared/lib/server
  block(
    [
      "@/shared/lib/*",
      "@/shared/lib/*/**",
      "!@/shared/lib/server",
      "!@/shared/lib/server/**",
      "!@/shared/lib/client",
      "!@/shared/lib/universal",
    ],
    "Импортируй из shared/lib только через public API: @/shared/lib или @/shared/lib/server",
  ),

  // shared/lib/server: запрещаем deep-import
  block(
    ["@/shared/lib/server/*", "@/shared/lib/server/*/**"],
    "Импортируй из shared/lib/server только через public API: @/shared/lib/server",
  ),
];

const blockNoImportsFrom = (fromLayer, message) =>
  block([`@/${fromLayer}/**`], message);

// ----------------------------------------------------------------------------
// Сборщики rules для слоёв
// ----------------------------------------------------------------------------

const noRestrictedImports = (patterns) => ({
  "no-restricted-imports": [
    "error",
    {
      patterns,
    },
  ],
});

const sharedLayerPatterns = () => [
  blockNoImportsFrom("app", "shared не должен импортить из app"),
  blockNoImportsFrom("features", "shared не должен импортить из features"),
  blockNoImportsFrom("widgets", "shared не должен импортить из widgets"),

  // внутри shared запрещаем alias @/shared/**
  blockLayerAlias("shared"),
];

const featuresLayerPatterns = () => [
  blockNoImportsFrom("app", "features не должны импортить из app"),

  // внутри features запрещаем alias @/features/**
  blockLayerAlias("features"),

  // между фичами — только public API
  blockDeepImport("features", "feature"),

  // shared — только public API
  ...blockSharedPublicApi(),
];

const widgetsLayerPatterns = () => [
  blockNoImportsFrom("app", "widgets не должны импортить из app"),

  // внутри widgets запрещаем alias @/widgets/**
  blockLayerAlias("widgets"),

  // между виджетами — только public API
  blockDeepImport("widgets", "widget"),

  // features — только public API
  blockDeepImport("features", "feature"),

  // shared — только public API
  ...blockSharedPublicApi(),
];

const appLayerPatterns = () => [
  blockAppAlias(),

  // Features: запрещаем deep-import (разрешён только public API)
  blockDeepImport("features", "feature"),

  // Widgets: запрещаем deep-import (разрешён только public API)
  blockDeepImport("widgets", "widget"),

  // shared — только public API
  ...blockSharedPublicApi(),
];

// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------

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

      "react-hooks/set-state-in-effect": "off",

      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          noSortAlphabetically: false,
          reservedFirst: true,
        },
      ],
    },

    settings: {
      "import/resolver": {
        typescript: { project: "./tsconfig.json" },
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      },
      react: { version: "detect" },
    },
  },

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
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],
    },
  },

  {
    files: ["src/shared/**/*.{ts,tsx,js,jsx}"],
    rules: noRestrictedImports(sharedLayerPatterns()),
  },

  {
    files: ["src/features/**/*.{ts,tsx,js,jsx}"],
    rules: noRestrictedImports(featuresLayerPatterns()),
  },

  {
    files: ["src/widgets/**/*.{ts,tsx,js,jsx}"],
    rules: noRestrictedImports(widgetsLayerPatterns()),
  },

  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}"],
    rules: noRestrictedImports(appLayerPatterns()),
  },

  {
    files: ["src/app/api/**/route.ts"],
    rules: {
      ...noRestrictedImports(appLayerPatterns()),
      "no-restricted-imports": [
        "error",
        {
          patterns: appLayerPatterns(),
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

  globalIgnores([".next/**", "node_modules/**", "public/**"]),
]);
