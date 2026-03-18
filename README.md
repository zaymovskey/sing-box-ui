# sing-box-ui

Административная панель для управления конфигурацией sing-box

---

## 🚀 Overview

Веб-интерфейс для управления VPN-конфигурациями sing-box.

Позволяет удобно управлять настройками, редактировать конфигурацию с валидацией
и генерировать подключения для клиентов.

---

## ✨ Features

- CRUD для inbound'ов
- Динамические формы (React Hook Form + Zod)
- Валидация конфигурации sing-box (schema-based)
- JSON editor с подсветкой ошибок
- Генерация QR-кодов и ссылок для клиентов
- JWT авторизация
- Переключение темы (light/dark)
- Feature-based архитектура

---

## 🖼 Screenshots

### Inbounds management

![Inbounds](./screenshots/inbounds.png)

---

### Create / Edit inbound

![Inbound Form](./screenshots/inbound-form.png)

---

### JSON config editor (with validation)

![Config Editor](./screenshots/config-editor.png)

---

### Client connections (QR / links)

![Connections](./screenshots/connections.png)

---

## 🧱 Architecture

Проект построен с использованием feature-based архитектуры:

- разделение по доменам (auth, inbound, config)
- строгий public API между фичами
- изоляция бизнес-логики
- переиспользуемые shared-компоненты

---

## ⚙️ Tech Stack

- Next.js (App Router)
- React 18
- TypeScript (strict)
- Tailwind CSS + shadcn/ui
- React Query
- Zustand
- React Hook Form
- Zod
- Docker
- sing-box

---

## 🐳 Infrastructure

Приложение разворачивается через Docker Compose:

- Next.js UI (frontend)
- sing-box (отдельный контейнер)
- volume для хранения конфигурации

Архитектура приближена к production setup.

---

## ▶️ Run locally

```bash
docker compose up --build
```

---

## 📌 Notes

Проект реализован как практическое приложение с упором на:

- архитектуру
- работу с конфигурациями
- продакшн-подход к разработке

---

## 📎 Related

- sing-box: https://github.com/SagerNet/sing-box

---
