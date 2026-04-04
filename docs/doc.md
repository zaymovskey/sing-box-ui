# sing-box UI

Веб-панель для управления `sing-box` с редактированием конфигурации через UI.

Проект работает **полностью в Docker** и поддерживает 2 режима:

1. **Docker development**
   - `sing-box` в Docker
   - `Next.js UI` в Docker (dev server)
   - используется для разработки

2. **Docker production**
   - `sing-box` в Docker
   - `Next.js UI` в Docker (production build)
   - production-like запуск

---

# Архитектура

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
│  ├─ .env
│  └─ data/
│     ├─ sing-box/
│     │  ├─ config.json
│     │  └─ certs/
│     └─ sing-box-state/
├─ Dockerfile
├─ Dockerfile.dev
└─ src/
```

---

# Конфиг и данные

Основной конфиг `sing-box` хранится на хосте:

```text
docker/data/sing-box/config.json
```

## В контейнере `sing-box`

```text
/etc/sing-box/config.json
```

## В UI контейнере

```text
/data/sing-box/config.json
```

---

# Сертификаты

Сертификаты хранятся в:

```text
docker/data/sing-box/certs/
```

## В контейнере `sing-box`

```text
/etc/sing-box/certs/
```

## В UI контейнере

```text
/data/sing-box/certs/
```

---

# Переменные окружения

Файл: `docker/.env`

```env
AUTH_JWT_SECRET=your_secret
AUTH_COOKIE_NAME=sbui_session
AUTH_DEMO_EMAIL=admin@example.com
AUTH_DEMO_PASSWORD=admin12345

SINGBOX_CONFIG_PATH=/data/sing-box/config.json

NEXT_PUBLIC_SINGBOX_CERTS_DIR=/etc/sing-box/certs/
SINGBOX_CERTS_HOST_DIR=/data/sing-box/certs
```

---

# Docker-режимы

## 1. Docker development

Основной режим разработки.

### Особенности

- UI работает внутри контейнера
- используется `Dockerfile.dev`
- hot reload есть (может быть медленнее, чем локально)
- окружение полностью совпадает с runtime

### Запуск

```bash
npm run docker:dev:build
```

### Повторный запуск

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

## 2. Docker production

Production-like режим.

### Особенности

- используется `Dockerfile`
- production build
- без hot reload

### Запуск

```bash
npm run docker:prod:build
```

### Повторный запуск

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

```json
{
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

## `docker/docker-compose.dev.yml`

- `sing-box`
- `UI` (dev server)

---

## `docker/docker-compose.yml`

- `sing-box`
- `UI` (production build)

---

# Dockerfile'ы

## `Dockerfile.dev`

- dev server
- bind mount исходников
- hot reload

## `Dockerfile`

- multi-stage build
- production runtime

---

# Какой режим использовать

## Для разработки

```bash
npm run docker:dev:build
```

👉 основной режим

---

## Для проверки production

```bash
npm run docker:prod:build
```

---

# Почему так

Проект полностью изолирован в Docker:

- нет зависимости от локального окружения
- одинаковое поведение dev / prod
- все runtime-операции (файлы, сертификаты, конфиг) работают одинаково

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

- редактирования JSON-конфига `sing-box`
- управления inbound'ами
- управления пользователями
- генерации TLS сертификатов
- управления runtime без ручного редактирования файлов
