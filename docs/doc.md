# sing-box UI

Веб-панель для управления `sing-box` с редактированием конфигурации через UI.

Проект поддерживает **3 режима запуска**:

1. **Local development**
   - `sing-box` в Docker
   - `Next.js UI` запускается локально через `npm run dev`

2. **Full Docker development**
   - `sing-box` в Docker
   - `Next.js UI` в Docker
   - используется для проверки контейнерного dev-окружения

3. **Full Docker production**
   - `sing-box` в Docker
   - `Next.js UI` в Docker
   - production-like запуск через multi-stage build

---

# Архитектура

## 1. Local development

```text
Browser
  ↓
Next.js UI (локально)
  ↓
читает / пишет config.json на хосте
  ↓
docker/data/sing-box/config.json
  ↓
volume
  ↓
sing-box container
```

## 2. Full Docker development / production

```text
Browser
  ↓
Next.js UI container
  ↓
/data/sing-box/config.json
  ↓
volume
  ↓
sing-box container
```

---

# Docker-структура

```text
.
├─ docker/
│  ├─ docker-compose.yml
│  ├─ docker-compose.dev.yml
│  ├─ docker-compose.singbox.yml
│  ├─ .env
│  └─ data/
│     ├─ sing-box/
│     │  └─ config.json
│     └─ sing-box-state/
├─ Dockerfile
├─ Dockerfile.dev
├─ .env.local
└─ src/
```

---

# Конфиг и данные

Основной конфиг `sing-box` хранится на хосте в:

```text
docker/data/sing-box/config.json
```

Это единый источник правды.

## В контейнере `sing-box`

Этот файл монтируется как:

```text
/etc/sing-box/config.json
```

## В Docker UI режиме

UI работает с путем:

```text
/data/sing-box/config.json
```

## В локальном UI режиме

UI работает с путем:

```text
./docker/data/sing-box/config.json
```

---

# Переменные окружения

## Для локального UI (`.env.local`)

Пример:

```env
AUTH_JWT_SECRET=your_secret
AUTH_COOKIE_NAME=sbui_session
AUTH_DEMO_EMAIL=admin@example.com
AUTH_DEMO_PASSWORD=admin12345

SINGBOX_CONFIG_PATH=./docker/data/sing-box/config.json
```

## Для Docker (`docker/.env`)

Пример:

```env
SINGBOX_CONFIG_PATH=/data/sing-box/config.json
```

---

# Docker-режимы

## 1. Local development

Это основной режим для повседневной фронтенд-разработки.

### Что работает

- `sing-box` запускается в Docker
- `Next.js UI` запускается локально
- hot reload быстрый
- лучший DX для разработки интерфейса

### Запуск

Поднять только `sing-box`:

```bash
npm run docker:singbox:up
```

Запустить UI локально:

```bash
npm run dev
```

или одной командой:

```bash
npm run dev:full
```

### Остановить `sing-box`

```bash
npm run docker:singbox:down
```

### Логи `sing-box`

```bash
npm run docker:singbox:logs
```

---

## 2. Full Docker development

Это режим, в котором и `sing-box`, и `UI` работают в Docker.

Используется для:

- проверки docker dev-окружения
- теста bind mounts / hot reload в контейнере
- проверки, что UI корректно работает в контейнерной среде

### Особенности

- UI запускается через `Dockerfile.dev`
- hot reload работает, но медленнее, чем при локальном `npm run dev`
- нужен только когда хочется проверить именно docker-dev сценарий

### Запуск

```bash
npm run docker:dev:build
```

### Повторный старт остановленных контейнеров

```bash
npm run docker:dev:start
```

### Остановить

```bash
npm run docker:dev:stop
```

### Логи

```bash
npm run docker:dev:logs
```

---

## 3. Full Docker production

Production-like режим, где оба сервиса работают в Docker, а UI собирается через multi-stage build.

### Особенности

- используется `Dockerfile`
- production runtime
- без hot reload
- минимизированный финальный образ UI

### Запуск

```bash
npm run docker:prod:build
```

### Повторный старт остановленных контейнеров

```bash
npm run docker:prod:start
```

### Остановить

```bash
npm run docker:prod:stop
```

### Логи

```bash
npm run docker:prod:logs
```

---

# Docker scripts

Используемые npm scripts:

```json
{
  "dev": "next dev",
  "dev:full": "npm run docker:singbox:up && next dev",

  "docker:singbox:up": "docker compose -f docker/docker-compose.singbox.yml up -d",
  "docker:singbox:down": "docker compose -f docker/docker-compose.singbox.yml down",
  "docker:singbox:logs": "docker compose -f docker/docker-compose.singbox.yml logs -f",

  "docker:dev:ui": "next dev --hostname 0.0.0.0 --webpack",
  "docker:dev:build": "docker compose -f docker/docker-compose.dev.yml --env-file docker/.env up --build",
  "docker:dev:stop": "docker compose -f docker/docker-compose.dev.yml stop",
  "docker:dev:start": "docker compose -f docker/docker-compose.dev.yml start",
  "docker:dev:logs": "docker compose -f docker/docker-compose.dev.yml logs -f",

  "docker:prod:build": "docker compose -f docker/docker-compose.yml --env-file docker/.env up --build",
  "docker:prod:stop": "docker compose -f docker/docker-compose.yml stop",
  "docker:prod:start": "docker compose -f docker/docker-compose.yml start",
  "docker:prod:logs": "docker compose -f docker/docker-compose.yml logs -f"
}
```

---

# Docker Compose файлы

## `docker/docker-compose.singbox.yml`

Поднимает только `sing-box`.

Используется в режиме **local development**.

## `docker/docker-compose.dev.yml`

Поднимает:

- `sing-box`
- `UI` в Docker dev-режиме

Используется в режиме **full docker development**.

## `docker/docker-compose.yml`

Поднимает:

- `sing-box`
- `UI` в production-like режиме

Используется в режиме **full docker production**.

---

# Dockerfile'ы

## `Dockerfile.dev`

Используется для docker-dev режима.

Особенности:

- dev server
- bind mount исходников
- hot reload внутри контейнера

## `Dockerfile`

Используется для production-like режима.

Особенности:

- multi-stage build
- build stage + runtime stage
- в финальный образ попадает только необходимое для запуска

---

# Какой режим использовать

## Для обычной ежедневной разработки

Использовать:

```bash
npm run dev:full
```

или отдельно:

```bash
npm run docker:singbox:up
npm run dev
```

Это основной и самый удобный режим.

## Для проверки контейнерного dev-окружения

Использовать:

```bash
npm run docker:dev:build
```

## Для проверки production-like контейнерной сборки

Использовать:

```bash
npm run docker:prod:build
```

---

# Почему сделано именно так

Полностью dockerized dev-режим для Next.js на Windows работает, но hot reload там медленнее.
Поэтому для нормального DX выбран отдельный основной режим:

- инфраструктура (`sing-box`) — в Docker
- UI — локально

Так получаем:

- быстрый hot reload
- реальный `sing-box`
- удобную разработку интерфейса

При этом остаются оба полностью dockerized режима:

- dev
- prod

---

# Технологии

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- Docker
- Docker Compose
- sing-box

---

# Назначение проекта

Панель нужна для:

- просмотра и редактирования JSON-конфига `sing-box`
- управления inbound'ами
- создания / редактирования пользователей
- локального удобного управления `sing-box` без ручного редактирования конфигов
