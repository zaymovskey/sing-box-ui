# Развёртывание sing-box-ui на сервере

Полная инструкция: поднять панель и VPN на чистом VPS через готовые Docker-образы.

Сборка на сервере **не нужна**. Образы лежат в GitHub Container Registry:

- `ghcr.io/zaymovskey/sing-box-ui`
- `ghcr.io/zaymovskey/sing-box`
- `ghcr.io/zaymovskey/sing-box-ui-worker`

Логин в registry не требуется — образы публичные.

---

## Что понадобится

- Linux VPS (Ubuntu 20.04+ / Debian)
- SSH-доступ под root или sudo
- Открытые порты:
  - `3000/tcp` — веб-панель
  - `22/tcp` — SSH
  - порты VPN-инбаундов (например `443/tcp`, `8443/udp` для Hysteria2)

---

## Как это работает

```text
Browser → UI (:3000) → SQLite + config files → sing-box (host network)
                                              ↘ worker (статистика)
```

1. Инбаунды создаются в UI и сохраняются в SQLite.
2. Кнопка **Reload** собирает runtime-конфиг и перезапускает `sing-box`.
3. Клиентские ссылки (VLESS / HY2) генерируются в UI.

---

## Структура на сервере

```text
/opt/sing-box-ui-project/
├── sing-box-ui/              # git clone
│   └── docker/
│       ├── docker-compose.yml
│       └── .env
└── data/
    ├── sing-box/
    │   ├── config.json       # runtime-конфиг sing-box
    │   ├── config.draft.json # черновик (база для сборки runtime)
    │   └── certs/            # TLS-сертификаты
    ├── sing-box-state/       # state sing-box
    └── app.db                # SQLite (создаётся автоматически)
```

`docker-compose.yml` монтирует `../../data` относительно папки `docker/`.  
Если придерживаешься схемы выше — пути менять не нужно.

---

## Шаг 1. Подключиться к серверу

```bash
ssh root@<IP_СЕРВЕРА>
```

---

## Шаг 2. Установить Docker

```bash
curl -fsSL https://get.docker.com | sh
```

Проверка:

```bash
docker --version
docker compose version
```

### Если установка упала на Ubuntu 20.04

Скрипт может упасть на пакете `docker-model-plugin`. Поставь Docker вручную:

```bash
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-buildx-plugin
```

---

## Шаг 3. Склонировать репозиторий

```bash
mkdir -p /opt/sing-box-ui-project
cd /opt/sing-box-ui-project

git clone https://github.com/zaymovskey/sing-box-ui.git sing-box-ui
```

На сервере нужен в основном каталог `docker/` с compose-файлом.

---

## Шаг 4. Подготовить data и конфиги

```bash
mkdir -p /opt/sing-box-ui-project/data/sing-box/certs
mkdir -p /opt/sing-box-ui-project/data/sing-box-state
```

Создай стартовые конфиги:

```bash
cat > /opt/sing-box-ui-project/data/sing-box/config.draft.json << 'EOF'
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
EOF

cp /opt/sing-box-ui-project/data/sing-box/config.draft.json \
   /opt/sing-box-ui-project/data/sing-box/config.json
```

---

## Шаг 5. Создать `.env`

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker
cp .env.example .env
nano .env
```

Сгенерируй секрет:

```bash
openssl rand -hex 32
```

Пример `.env` для production:

```env
NODE_ENV=production

AUTH_JWT_SECRET=вставь_сгенерированный_секрет
AUTH_COOKIE_NAME=sbui_session
AUTH_DEMO_EMAIL=admin@example.com
AUTH_DEMO_PASSWORD=твой_сильный_пароль

SINGBOX_DRAFT_CONFIG_PATH=/data/sing-box/config.draft.json
SINGBOX_CONFIG_PATH=/data/sing-box/config.json
SINGBOX_CERTS_DIR=/data/sing-box/certs
SINGBOX_CONTAINER_NAME=sing-box

SQLITE_DB_PATH=/data/app.db

ENABLE_FIREWALL=false
USE_HTTPS=false
```

Важно:

- **обязательно** замени `AUTH_JWT_SECRET` и `AUTH_DEMO_PASSWORD` — не оставляй плейсхолдеры
- пути `/data/...` — это пути **внутри контейнеров**, не на хосте
- логин в панель = `AUTH_DEMO_EMAIL` + `AUTH_DEMO_PASSWORD` из этого файла

После изменения `.env` перезапусти UI:

```bash
docker compose up -d --force-recreate ui
```

---

## Шаг 6. Запустить

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker
docker compose pull
docker compose up -d
```

Проверка:

```bash
docker compose ps
```

Должны быть `running`:

- `sing-box`
- `sing-box-ui`
- `docker-worker-1` (worker)

Логи:

```bash
docker compose logs sing-box --tail 20
docker compose logs ui --tail 20
```

---

## Шаг 7. Открыть firewall

### UFW на сервере

```bash
ufw allow 22/tcp
ufw allow 3000/tcp
ufw --force enable
ufw status
```

Порты VPN добавляй **после** создания инбаунда. Для Hysteria2 на порту 8443:

```bash
ufw allow 8443/udp
ufw allow 8443/tcp
ufw reload
```

> Hysteria2 работает по **UDP**. Если открыть только TCP — клиент будет показывать таймаут.

### Firewall у хостера

В панели VPS (Hetzner, Timeweb и т.д.) тоже открой нужные порты — ufw не заменяет security group провайдера.

---

## Шаг 8. Зайти в панель

```text
http://<IP_СЕРВЕРА>:3000
```

Логин и пароль — из `docker/.env`:

```bash
grep AUTH_DEMO /opt/sing-box-ui-project/sing-box-ui/docker/.env
```

---

## Шаг 9. Настроить VPN

1. **Inbounds** → создай inbound (VLESS или Hysteria2)
2. Для HY2: создай TLS asset (можно self-signed) и привяжи к инбаунду
3. Добавь пользователя
4. Нажми **Reload** — без этого sing-box не получит новый конфиг
5. Сгенерируй client link / QR
6. Открой порт инбаунда в firewall (см. шаг 7)

Проверка, что sing-box слушает порт:

```bash
ss -ulnp | grep <PORT>    # для Hysteria2 (UDP)
ss -tlnp | grep <PORT>    # для VLESS (TCP)
grep hysteria2 /opt/sing-box-ui-project/data/sing-box/config.json
```

---

## Шаг 10. Подключить клиент

Ссылку копируй из UI. Пример Hysteria2:

```text
hy2://password@1.2.3.4:8443/?sni=example.com&insecure=1#MyInbound_User
```

Клиенты: Hiddify, Nekoray, sing-box clients и т.д.

Если таймаут:

1. Нажал **Reload**?
2. Открыт **UDP**-порт в ufw и у хостера?
3. Порт слушается? (`ss -ulnp | grep 8443`)
4. В конфиге есть inbound? (`grep hysteria2 config.json`)

---

## Обновление

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker

docker compose pull sing-box ui worker
docker compose up -d --force-recreate
```

Конкретный тег (не `latest`):

```bash
IMAGE_TAG=sha-abc1234 docker compose pull sing-box ui worker
IMAGE_TAG=sha-abc1234 docker compose up -d --force-recreate
```

---

## Перенос со старого сервера

Если на другом VPS уже всё работает:

```bash
# на СТАРОМ сервере
cd /opt/sing-box-ui-project
tar czf sing-box-backup.tar.gz data/ sing-box-ui/docker/.env

# скопировать на новый сервер, затем:
cd /opt/sing-box-ui-project
tar xzf sing-box-backup.tar.gz

cd sing-box-ui/docker
docker compose pull
docker compose up -d
```

Перенесутся инбаунды, пользователи, сертификаты и SQLite-база.

---

## Остановка и перезапуск

```bash
cd /opt/sing-box-ui-project/sing-box-ui/docker

docker compose stop
docker compose start
docker compose down        # остановить и удалить контейнеры
docker compose restart     # перезапустить все сервисы
```

---

## Что поднимается

| Сервис     | Образ                                   | Назначение              |
| ---------- | --------------------------------------- | ----------------------- |
| `ui`       | `ghcr.io/zaymovskey/sing-box-ui`        | веб-панель              |
| `sing-box` | `ghcr.io/zaymovskey/sing-box`           | VPN runtime             |
| `worker`   | `ghcr.io/zaymovskey/sing-box-ui-worker` | сбор статистики трафика |

UI слушает порт `3000`. `sing-box` и `worker` работают в `network_mode: host`.

---

## Частые проблемы

### Неверный логин / пароль

Проверь `.env` — логин строго совпадает с `AUTH_DEMO_EMAIL` и `AUTH_DEMO_PASSWORD`:

```bash
grep AUTH_DEMO /opt/sing-box-ui-project/sing-box-ui/docker/.env
```

### `config.json: no such file or directory`

Создай конфиги (шаг 4) и перезапусти:

```bash
docker compose restart sing-box ui worker
```

### Красная ошибка конфигурации в UI

Проверь, что файлы на месте:

```bash
ls -la /opt/sing-box-ui-project/data/sing-box/
docker exec sing-box-ui ls -la /data/sing-box/
docker exec sing-box ls -la /etc/sing-box/config.json
```

Если `sing-box` в логах пишет `sing-box started` — runtime работает.

### VPN: таймаут в клиенте

1. **Reload** нажат после создания inbound
2. Порт открыт в ufw **и** у хостера
3. Для Hysteria2 — **UDP**, не только TCP
4. Порт слушается: `ss -ulnp | grep <PORT>`

### Reload не работает

- UI управляет sing-box через `/var/run/docker.sock`
- `SINGBOX_CONTAINER_NAME=sing-box` в `.env`

### Нет статистики трафика

- контейнер `worker` должен быть running
- в `config.draft.json` должен быть блок `experimental.v2ray_api`

---

## Безопасность

- смени дефолтные пароли и `AUTH_JWT_SECRET`
- не выставляй панель (`3000`) в открытый интернет без необходимости
- для продакшена лучше ограничить доступ к панели через VPN или reverse proxy с HTTPS

---

## Быстрая шпаргалка (copy-paste)

```bash
# 1. Docker
curl -fsSL https://get.docker.com | sh

# 2. Clone + data
mkdir -p /opt/sing-box-ui-project && cd /opt/sing-box-ui-project
git clone https://github.com/zaymovskey/sing-box-ui.git sing-box-ui
mkdir -p data/sing-box/certs data/sing-box-state

# 3. Configs — см. шаг 4 выше (cat > config.draft.json ...)

# 4. Env
cd sing-box-ui/docker
cp .env.example .env && nano .env

# 5. Run
docker compose pull && docker compose up -d

# 6. Firewall
ufw allow 22/tcp && ufw allow 3000/tcp && ufw --force enable
```

Дальше: зайти в UI → создать inbound → **Reload** → открыть порт VPN → подключить клиент.
