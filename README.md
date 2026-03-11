# sing-box UI

Web UI для управления конфигурацией **sing-box**.

Позволяет редактировать `config.json` через интерфейс вместо ручного редактирования файла.

---

# Возможности

- создание и редактирование **inbound**
- управление **пользователями**
- редактирование конфигурации `sing-box`
- валидация конфигов через **Zod**
- работа через **Docker**

---

# Режимы запуска

Проект поддерживает **3 режима**.

## 1️⃣ Local development (основной)

Рекомендуемый режим для разработки.

- `sing-box` запускается в **Docker**
- `Next.js UI` запускается **локально**

Запуск:

```bash
npm run docker:singbox:up
npm run dev
```

или

```bash
npm run dev:full
```

---

## 2️⃣ Full Docker development

И `sing-box`, и UI работают в Docker.

Используется для проверки docker dev-окружения.

```bash
npm run docker:dev:build
```

---

## 3️⃣ Full Docker production

Production-like запуск обоих сервисов в Docker.

```bash
npm run docker:prod:build
```

---

# Docker команды

### sing-box

```bash
npm run docker:singbox:up
npm run docker:singbox:down
npm run docker:singbox:logs
```

### Docker dev

```bash
npm run docker:dev:build
npm run docker:dev:start
npm run docker:dev:stop
npm run docker:dev:logs
```

### Docker prod

```bash
npm run docker:prod:build
npm run docker:prod:start
npm run docker:prod:stop
npm run docker:prod:logs
```

---

# Конфигурация

Основной конфиг `sing-box` хранится в:

```
docker/data/sing-box/config.json
```

Этот файл используется:

- контейнером `sing-box`
- UI для чтения и редактирования конфигурации

---

# Технологии

- Next.js
- React
- TypeScript
- Tailwind
- React Hook Form
- Zod
- Docker
- sing-box

---

# Документация

Подробная документация находится в:

```
docs/
```
