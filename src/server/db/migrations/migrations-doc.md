# 📦 DB MIGRATIONS GUIDE (SQLite)

## 🧠 Основной принцип

> ❗ **Миграции — неизменяемы (immutable)**

Если миграция уже была применена —
**НИКОГДА её не редактируем.**

---

## 📌 Как вносить изменения в БД

### ❌ НЕЛЬЗЯ:

- менять старые `.sql` файлы
- удалять БД ради изменений
- “подправить чуть-чуть” старую миграцию

---

### ✅ НУЖНО:

- создавать **новую миграцию** под каждое изменение

---

## 🗂 Формат файлов

```
001_init.sql
002_users.sql
003_inbounds.sql
...
009_add_inbound_description.sql
010_rebuild_inbound_users.sql
```

👉 Всегда увеличиваем номер
👉 Даём понятное имя

---

## 🧩 Типовые операции

---

### ➕ 1. Добавить таблицу

```sql
CREATE TABLE IF NOT EXISTS my_table (
  id TEXT PRIMARY KEY
);
```

✔ просто новая миграция
✔ безопасно

---

### ➕ 2. Добавить колонку

```sql
ALTER TABLE my_table
ADD COLUMN new_field TEXT;
```

✔ SQLite это поддерживает
✔ безопасно

---

### ⚠️ 3. Изменить структуру таблицы (сложно)

SQLite не умеет:

- удалить колонку
- изменить тип
- менять constraints

👉 используем **rebuild pattern**

---

## 🔁 REBUILD PATTERN (важно)

```sql
-- 1. новая таблица
CREATE TABLE my_table_new (
  id TEXT PRIMARY KEY,
  new_field TEXT
);

-- 2. перенос данных
INSERT INTO my_table_new (id, new_field)
SELECT id, old_field
FROM my_table;

-- 3. удаление старой
DROP TABLE my_table;

-- 4. переименование
ALTER TABLE my_table_new RENAME TO my_table;
```

---

## 📌 Индексы нужно пересоздавать

После rebuild:

```sql
CREATE INDEX IF NOT EXISTS idx_my_table_id
  ON my_table(id);
```

---

## 🧪 Проверка

После миграции:

- БД не должна падать
- приложение должно запускаться без ошибок
- данные не должны теряться

---

## 🚨 Когда можно удалять БД

Только если:

- dev-режим
- прототип
- полностью меняешь всё

👉 В проде — НИКОГДА

---

## 💡 Примеры

### Добавить поле в inbounds

```sql
-- 009_add_description.sql
ALTER TABLE inbounds
ADD COLUMN description TEXT;
```

---

### Переделать inbound_users

```sql
-- 010_rebuild_inbound_users.sql

CREATE TABLE inbound_users_new (
  id TEXT PRIMARY KEY,
  inbound_id TEXT NOT NULL,
  name TEXT
);

INSERT INTO inbound_users_new (id, inbound_id, name)
SELECT id, inbound_id, name
FROM inbound_users;

DROP TABLE inbound_users;

ALTER TABLE inbound_users_new RENAME TO inbound_users;
```

---

## 🧠 Главное правило (ещё раз)

> ❗ Каждое изменение схемы = новая миграция
