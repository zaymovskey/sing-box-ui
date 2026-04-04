# Copilot Instructions for sing-box-ui

Говорить нужно всегда на русском языке, даже если пользователь спрашивает на другом языке.

## Project Overview

**sing-box-ui** is a Next.js 16 + React 19 UI application with TypeScript, styled with Tailwind CSS v4 and shadcn/ui components. The architecture separates concerns into:

- `src/app/`: Next.js App Router pages and layout
- `src/shared/`: Reusable UI components and utilities

## Key Stack & Conventions

### Framework & Language

- **Next.js 16** with App Router (no Pages Router)
- **React 19** with Server Components disabled (`"rsc": false` in components.json)
- **TypeScript** with strict mode enabled and `@/` path alias pointing to `src/`

### Styling & Components

- **Tailwind CSS v4** with `@tailwindcss/postcss` plugin
- **shadcn/ui** components stored in `src/shared/ui/` (configured via components.json)
- **CVA (class-variance-authority)** for component variants (see [button.tsx](src/shared/ui/button.tsx) for pattern)
- **Utility function**: Use `cn()` from `@/shared/lib` to merge Tailwind classes safely (combines `clsx` + `twMerge`)

### Component Pattern Example

```tsx
// src/shared/ui/button.tsx - Use cva() for variants
const buttonVariants = cva("base-classes", {
  variants: { variant: {...}, size: {...} }
});

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {}
export const Button = ({ variant, size, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }))} {...props} />
);
```

## Code Quality & Tooling

### Linting & Formatting

- **ESLint** (flat config in `eslint.config.mjs`) enforces:
  - TypeScript strict rules (`@typescript-eslint/no-explicit-any` as error)
  - Import ordering via `simple-import-sort` (no manual sorting)
  - Unused imports removal via `unused-imports`
  - React 19 defaults (react-in-jsx-scope off)
  - Accessibility checks via `jsx-a11y`
- **Prettier** with minimal config (empty in `prettier.config.mjs` - uses defaults)
- **Husky + lint-staged**: Pre-commit hooks run eslint --fix and prettier --write on staged files

### Run Commands

```bash
npm run dev          # Start Next.js dev server on localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix ESLint issues
npm run prepare      # Install husky hooks (runs on npm install)
```

## Development Workflows

### Adding UI Components

1. Create component in `src/shared/ui/` following shadcn/ui + CVA pattern
2. Import from `@radix-ui` for primitives and use `cn()` from `@/shared/lib` for styling
3. Export from a barrel file if creating multiple related components
4. Run `npm run lint:fix` to ensure import order and no unused imports

### Common Import Pattern

```tsx
// Order: React/Next, external libs, internal utils, local imports
import { ReactNode } from "react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
```

## Architecture Decisions

- **No RSC**: Components are client-side rendered for interactivity; shadcn/ui components require this
- **Path aliases**: Always use `@/` prefix (configured in `tsconfig.json` and `components.json`)
- **Shared utilities live in `src/shared/lib/`**: Common functions like `cn()` for class merging
- **shadcn/ui aliases point to `src/shared/ui/`**: Ensures all generated components are centralized

## Common Issues & Patterns

- **Tailwind class conflicts**: Use `cn()` utility to properly merge conflicting Tailwind classes
- **Icon sizing**: Button component includes smart SVG sizing via `[&_svg:not([class*='size-'])]:size-4`
- **Dark mode**: Components support dark variants via Tailwind dark: prefix
- **Type safety**: Always type component props extending both native HTML attributes and CVA variant props

## Important Files

- [package.json](package.json) - Dependencies and scripts
- [eslint.config.mjs](eslint.config.mjs) - Linting rules
- [components.json](components.json) - shadcn/ui and path alias configuration
- [src/shared/ui/button.tsx](src/shared/ui/button.tsx) - Reference component pattern
- [src/shared/lib/cn.ts](src/shared/lib/cn.ts) - Core utility for class merging
