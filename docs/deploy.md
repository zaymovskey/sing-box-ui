# Развёртывание sing-box-ui на сервере

Инструкция для запуска панели на Linux-сервере через готовые Docker-образы.

Сборка на сервере не нужна: образы уже лежат в GitHub Container Registry (`ghcr.io/zaymovskey/...`).

## Что понадобится

- Linux-сервер (VPS / dedicated)
- Docker и Docker Compose v2
- Открытый порт `3000` для веб-панели
- Порты для VPN-инбаундов, которые создашь в UI (например `443`, `8443` и т.д.)

## Структура на сервере

Рекомендуемая раскладка:

```text
/opt/sing-box-ui-project/
├── sing-box-ui/          # git clone репозитория
│   └── docker/
│       ├── docker-compose.yml
│       └── .env
└── data/
    ├── sing-box/
    │   ├── config.json
    │   ├── config.draft.json
    │   └── certs/
    └── sing-box-state/
```

`docker-compose.yml` монтирует `data/` как `../../data` относительно папки `docker/`.  
Менять пути в compose не нужно, если придерживаешься схемы выше.

## 1. Установить Docker

На Ubuntu/Debian:

```bash
curl -fsSL https://get.docker.com | sh
```

Проверка:

```bash
docker --version
docker compose version
```

## 2. Скачать репозиторий

```bash
sudo mkdir -p /opt/sing-box-ui-project
cd /opt/sing-box-ui-project

git clone <URL_РЕПОЗИТОРИЯ> sing-box-ui
```

Нужен в основном каталог `docker/` и compose-файл. Исходники приложения на сервере не собираются.

## 3. Подготовить данные

```bash
cd /opt/sing-box-ui-project

mkdir -p data/sing-box/certs data/sing-box-state
```

### `data/sing-box/config.draft.json`

Черновик конфига. Из него UI собирает runtime-конфиг.

```json
{
  "log": {
    "disabled": false,
    "level": "info",
    "timestamp": true
  },
  "inbounds": [],
  "outbounds": [
    {
      "tag": "direct",
      "type": "direct"
    }
  ],
  "route": {
    "final": "direct"
  },
  "experimental": {
    "v2ray_api": {
      "listen": "127.0.0.1:4444",
      "stats": {
        "enabled": true,
        "inbounds": [],
        "outbounds": [],
        "users": []
      }
    }
  }
}
```

### `data/sing-box/config.json`

Стартовый runtime-конфиг для `sing-box`. На первом запуске можно положить тот же минимальный JSON, что и в `config.draft.json`.

После создания инбаундов в UI жми **Reload** — панель перезапишет этот файл и перезапустит контейнер `sing-box`.

## 4. Создать `docker/.env`

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker
nano .env
```

Пример:

```env
NODE_ENV=production

AUTH_JWT_SECRET=замени_на_длинный_случайный_секрет
AUTH_COOKIE_NAME=sbui_session
AUTH_DEMO_EMAIL=admin@example.com
AUTH_DEMO_PASSWORD=замени_на_сильный_пароль

SINGBOX_DRAFT_CONFIG_PATH=/data/sing-box/config.draft.json
SINGBOX_CONFIG_PATH=/data/sing-box/config.json
SINGBOX_CERTS_DIR=/data/sing-box/certs
SINGBOX_CONTAINER_NAME=sing-box

SQLITE_DB_PATH=/data/app.db

ENABLE_FIREWALL=false
USE_HTTPS=false
```

Важно:

- `AUTH_JWT_SECRET` и `AUTH_DEMO_PASSWORD` — обязательно свои значения
- пути `/data/...` — это пути **внутри контейнеров**, не на хосте
- `SINGBOX_CONTAINER_NAME=sing-box` должен совпадать с `container_name` в compose

## 5. Запустить

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker
docker compose pull
docker compose up -d
```

Проверка:

```bash
docker compose ps
docker compose logs -f ui
```

Панель: `http://<IP_СЕРВЕРА>:3000`

Логин — из `AUTH_DEMO_EMAIL` / `AUTH_DEMO_PASSWORD`.

## 6. Первые шаги в UI

1. Зайти в панель
2. Создать inbound (VLESS / Hysteria2)
3. Нажать **Reload**, чтобы применить конфиг к `sing-box`
4. Проверить статус сервиса в UI

SQLite-база (`/data/app.db`) создаётся автоматически при первом запуске UI.

## Обновление версии

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker

docker compose pull sing-box ui worker
docker compose up -d --force-recreate
```

Конкретный тег образа (не `latest`):

```bash
IMAGE_TAG=sha-abc1234 docker compose pull sing-box ui worker
IMAGE_TAG=sha-abc1234 docker compose up -d --force-recreate
```

## Остановка и перезапуск

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker

docker compose stop
docker compose start
docker compose down
```

## Что поднимается

| Сервис     | Образ                                   | Назначение              |
| ---------- | --------------------------------------- | ----------------------- |
| `ui`       | `ghcr.io/zaymovskey/sing-box-ui`        | веб-панель              |
| `sing-box` | `ghcr.io/zaymovskey/sing-box`           | VPN runtime             |
| `worker`   | `ghcr.io/zaymovskey/sing-box-ui-worker` | сбор статистики трафика |

UI слушает порт `3000`. `sing-box` и `worker` работают в `network_mode: host`.

## Частые проблемы

### UI не открывается

- проверь `docker compose ps`
- проверь firewall на сервере: порт `3000/tcp`
- смотри логи: `docker compose logs ui`

### `sing-box` не стартует

- проверь, что `data/sing-box/config.json` валидный JSON
- смотри логи: `docker compose logs sing-box`

### Reload из UI не работает

- UI управляет контейнером через `/var/run/docker.sock`
- `SINGBOX_CONTAINER_NAME` в `.env` должен быть `sing-box`

### Нет статистики трафика

- должен работать контейнер `worker`
- в `config.draft.json` должен быть блок `experimental.v2ray_api`

## Безопасность

- смени дефолтные пароли и `AUTH_JWT_SECRET`
- не выставляй панель в интернет без ограничений, если не нужно
- для продакшена лучше закрыть `3000` через VPN или reverse proxy с HTTPS
