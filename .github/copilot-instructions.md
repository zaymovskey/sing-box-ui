# Инструкции для Copilot

## Технологический стек

- **Framework**: Next.js 15+ (App Router)
- **React**: 19+
- **TypeScript**: 5+
- **Styling**: Tailwind CSS v4
- **Архитектура**: Feature-Sliced Design (FSD)

## Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Основное приложение (защищённые роуты)
│   ├── (auth)/            # Аутентификация (публичные роуты)
│   ├── providers.tsx      # React-провайдеры
│   └── globals.css        # Глобальные стили
├── features/              # Фичи (бизнес-логика)
├── shared/                # Общие компоненты и утилиты
│   ├── ui/               # UI-компоненты
│   └── lib/              # Утилиты
└── ...
```

## Правила написания кода

### Общие принципы

1. **Всегда использовать TypeScript** с явными типами
2. **Server Components по умолчанию** — добавлять `'use client'` только когда необходимо
3. **Async компоненты** для серверных компонентов с загрузкой данных
4. **Композиция над наследованием**

### React-компоненты

```tsx
// ✅ Правильно: Server Component
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Правильно: Client Component с явным указанием
("use client");
export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ✅ Правильно: явные типы пропсов
interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}
export function Button({ variant = "primary", children }: ButtonProps) {
  return <button className={cn(styles[variant])}>{children}</button>;
}
```

### Стилизация

- Использовать **Tailwind CSS** для стилей
- Использовать утилиту `cn()` из `@/shared/lib` для условных классов
- Избегать inline-стилей

```tsx
import { cn } from "@/shared/lib";

<div
  className={cn(
    "px-4 py-2",
    isActive && "bg-blue-500",
    isDisabled && "opacity-50",
  )}
/>;
```

### Маршрутизация

- Использовать **route groups** для логической группировки: `(app)`, `(auth)`
- `layout.tsx` для общих обёрток
- `loading.tsx` для состояний загрузки
- `error.tsx` для обработки ошибок
- `not-found.tsx` для 404

### Импорты

```tsx
// ✅ Использовать алиасы
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";

// ❌ Избегать относительных путов для shared/features
import { Button } from "../../../shared/ui";
```

## Соглашения по именованию

- **Компоненты**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Утилиты**: camelCase (`cn.ts`, `formatDate.ts`)
- **Константы**: UPPER_SNAKE_CASE
- **Файлы маршрутов**: kebab-case (`user-profile/page.tsx`)

## Качество кода

- Следовать **ESLint** и **Prettier** правилам проекта
- Избегать `any`, использовать строгую типизацию
- Писать чистый, читаемый код без избыточных комментариев
- Использовать destructuring для пропсов и объектов
- Предпочитать функциональный подход

## Производительность

- Использовать **Server Components** где возможно
- Применять **dynamic imports** для тяжёлых компонентов
- Оптимизировать изображения через `next/image`
- Минимизировать клиентский JavaScript
