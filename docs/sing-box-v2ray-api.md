# sing-box V2Ray API (stats / users / traffic)

## 📌 Зачем это нужно

V2Ray API в `sing-box` используется для получения **статистики трафика**:

- inbound (по инбаундам)
- outbound (по аутбаундам)
- users (по конкретным пользователям)

Это основа для:

- определения **подключён ли пользователь**
- отображения трафика в UI
- аналитики

---

## ⚠️ Важный момент про образ sing-box

Официальный образ:

```text
ghcr.io/sagernet/sing-box
```

❌ **не содержит V2Ray API**

Ошибка:

```text
v2ray api is not included in this build
```

---

## ✅ Используемый образ

Используется кастомный образ с включённым API:

```text
bi4nbn/sing-box:<tag>
```

В нём включены флаги:

```text
with_v2ray_api
with_clash_api
...
```

---

## ⚙️ Конфиг sing-box

Пример блока:

```json
"experimental": {
  "v2ray_api": {
    "listen": "0.0.0.0:8080",
    "stats": {
      "enabled": true,
      "inbounds": ["hy2_123451"],
      "outbounds": ["direct"],
      "users": ["авфаыв555а"]
    }
  }
}
```

### Важно

- `listen: 0.0.0.0:8080` — чтобы API был доступен с хоста
- порт должен быть проброшен в docker-compose:

```yaml
ports:
  - "8080:8080"
```

---

## 🧠 Особенности API

- это **gRPC**, а не HTTP
- Postman / браузер не подойдут
- используется CLI-инструмент `grpcurl`

---

## 🧰 grpcurl

Скачать:
👉 https://github.com/fullstorydev/grpcurl/releases

После скачивания:

- положить куда удобно (например `tools/grpcurl`)
- добавить в PATH

Проверка:

```bash
grpcurl --help
```

---

## ❗ Почему не работает `grpcurl list`

```bash
grpcurl 127.0.0.1:8080 list
```

Ошибка:

```text
server does not support the reflection API
```

👉 Это нормально

sing-box **не поддерживает reflection**, поэтому нужно использовать `.proto`

---

## 📄 Proto-файл

Лежит в проекте:

```text
docs/grpc/stats.proto
```

Используется для описания сервиса:

```text
v2ray.core.app.stats.command.StatsService
```

---

## 🚀 Вызов API

### Базовый запрос

```powershell
'{"pattern":"","reset":false}' | grpcurl -plaintext `
  -import-path .\docs\grpc `
  -proto stats.proto `
  -d '@' `
  127.0.0.1:8080 `
  v2ray.core.app.stats.command.StatsService/QueryStats
```

---

## 📊 Пример ответа

```json
{
  "stat": [
    {
      "name": "user>>>username>>>traffic>>>uplink",
      "value": "7896"
    },
    {
      "name": "user>>>username>>>traffic>>>downlink",
      "value": "9761"
    },
    {
      "name": "inbound>>>hy2_123451>>>traffic>>>uplink",
      "value": "7896"
    }
  ]
}
```

---

## 🧩 Формат ключей

### User

```text
user>>>USERNAME>>>traffic>>>uplink
user>>>USERNAME>>>traffic>>>downlink
```

### Inbound

```text
inbound>>>TAG>>>traffic>>>uplink
inbound>>>TAG>>>traffic>>>downlink
```

### Outbound

```text
outbound>>>TAG>>>traffic>>>uplink
outbound>>>TAG>>>traffic>>>downlink
```

---

## 🔑 Важный нюанс для hysteria2

В `stats.users` используется:

```json
"users": ["<name>"]
```

❗ НЕ пароль

Пример:

```json
{
  "name": "авфаыв555а",
  "password": "123456"
}
```

👉 использовать нужно `"авфаыв555а`

---

## 🧠 Как определить "пользователь подключён"

API **не даёт online-статус напрямую**.

Решение:

### Алгоритм

1. Периодически (например каждые 5 сек) вызывать `QueryStats`
2. Для каждого пользователя хранить:
   - прошлый uplink
   - прошлый downlink

3. Сравнивать с текущими значениями

### Логика

```text
если трафик вырос → пользователь активен
если не растёт N секунд → пользователь неактивен
```

---

## ⚠️ Кодировка в Windows

В консоли может быть:

```text
╨░╨▓╤Д...
```

Это проблема кодировки.

### Фикс:

```powershell
chcp 65001
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
```

---

## ⚠️ JSON escape

В ответе могут быть:

```text
\u003e
```

Это просто:

```text
>
```

---

## 📁 Рекомендуемая структура

```text
docs/
  grpc/
    stats.proto

tools/
  grpcurl/
    (локально grpcurl.exe, НЕ в git)
```

---

## ❌ Что не стоит делать

- не парсить логи вместо API
- не коммитить grpcurl.exe в репозиторий
- не использовать password вместо name

---

## ✅ Что уже работает

- V2Ray API подключён
- grpcurl работает
- stats приходят
- user traffic определяется

---

## 🎯 Дальше

- сделать polling сервис
- добавить lastSeen / connected
- отдать в UI

---
