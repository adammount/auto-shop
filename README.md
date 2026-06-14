# Деталь — интернет-магазин автозапчастей

Интернет-магазин автозапчастей: каталог с фильтрами, карточки товаров,
корзина и избранное, оформление заказа без онлайн-оплаты (заявка уходит
менеджеру на почту и в WhatsApp), личный кабинет, оптовые цены для сервисов.
Контент управляется через Payload CMS.

## Технологии

- **Next.js 16** (App Router, React Server Components, standalone-сборка)
- **Payload CMS 3** (коллекции, глобалы, админка, REST/GraphQL)
- **PostgreSQL** (`@payloadcms/db-postgres`, миграции)
- **TypeScript** (strict)
- **SCSS-модули** + дизайн-токены
- **Zustand** — клиентское состояние (корзина, избранное, сессия, UI)
- **React Hook Form + Zod** — формы и валидация
- **Resend** — письма о заказах
- **Cloudflare Turnstile** — капча на оформлении
- **Bun** — пакетный менеджер и рантайм

## Требования

- Bun ≥ 1.2
- PostgreSQL 14+ (локально или в Docker)
- Node-совместимое окружение (для standalone-сервера на проде)

## Быстрый старт

```bash
# 1. Установить зависимости
bun install

# 2. Создать .env из примера и заполнить значения
cp .env.example .env

# 3. Поднять Postgres для разработки (опционально, через Docker)
docker compose -f docker-compose.dev.yml up -d

# 4. Применить миграции
bun payload migrate

# 5. Заполнить демо-данными и создать администратора
bun run seed

# 6. Запустить дев-сервер
bun run dev
```

Приложение: `http://localhost:3000`
Админка Payload: `http://localhost:3000/admin`

## Переменные окружения

Полный список — в [`.env.example`](./.env.example).

| Переменная | Назначение |
| --- | --- |
| `DATABASE_URI` | строка подключения к PostgreSQL |
| `PAYLOAD_SECRET` | секрет для подписи токенов Payload |
| `NEXT_PUBLIC_SERVER_URL` | публичный URL сайта (нужен и на этапе сборки) |
| `POSTGRES_PASSWORD` | пароль БД для docker-compose |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | публичный ключ капчи (нужен при сборке) |
| `TURNSTILE_SECRET_KEY` | секретный ключ капчи (сервер) |
| `RESEND_API_KEY` | ключ Resend для писем о заказах |
| `ORDER_EMAIL_TO` / `ORDER_EMAIL_FROM` | адреса для уведомлений о заказах |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | первый администратор (seed) |

`NEXT_PUBLIC_*` инлайнятся в клиентский бандл во время сборки — задавайте их
до запуска `build`.

## Скрипты

| Команда | Действие |
| --- | --- |
| `bun run dev` | дев-сервер |
| `bun run build` | продакшн-сборка (standalone) |
| `bun run start` | запуск собранного приложения |
| `bun run lint` | ESLint |
| `bun run typecheck` | проверка типов (`tsc --noEmit`) |
| `bun run format` | Prettier |
| `bun run generate:types` | генерация типов Payload |
| `bun run migrate` | миграции БД |
| `bun run seed` | сидинг демо-данных и админа |

## Структура

```
src/
  app/                  маршруты Next.js (App Router)
    (frontend)/         витрина магазина
    (payload)/          админка Payload
    sitemap.ts          карта сайта
    robots.ts           robots.txt
    manifest.ts         PWA-манифест
  collections/          коллекции Payload (products, categories, …)
  globals/              глобалы Payload (site-settings, banners, reviews)
  migrations/           миграции БД
  views/                экраны страниц (FSD-слой views)
  shared/               переиспользуемое: ui, api, lib, store, config, styles
```

Архитектура — упрощённый Feature-Sliced Design: слой `views` (экраны) +
`shared` (UI-кит, репозитории данных, утилиты, сторы, токены).

## Данные и кеширование

Данные читаются через репозитории (`shared/api/*-repository.ts`) и кешируются
`unstable_cache` с тегами (`content`, `products`) и ревалидацией (1 час).
Хуки Payload сбрасывают кеш по тегам при изменении контента в админке.
Страницы — ISR: пре-рендер + ревалидация, без зависимости от БД на этапе сборки.

## SEO

- Метаданные, OpenGraph и Twitter Cards, canonical
- `sitemap.xml` (статические страницы, категории, товары) и `robots.txt`
- PWA-манифест и SVG-иконка
- Структурированные данные JSON-LD: Organization, Product, BreadcrumbList

## Доступность (a11y)

Цель — **WCAG 2.2 AA**: семантическая разметка, skip-link, видимый фокус
(`:focus-visible`), доступные имена интерактивных элементов, модальные drawer'ы
с фокус-трапом и возвратом фокуса, поддержка `prefers-reduced-motion`.

## Деплой

Продакшн собирается в Docker (multi-stage, standalone). Запуск — через
`docker-compose.yml` (web + PostgreSQL). Миграции применяются автоматически
при старте контейнера (`docker-entrypoint.sh`).

```bash
docker compose up -d --build
```

Подходит для развёртывания в Dokploy (тип Docker Compose): задайте переменные
окружения в панели, привяжите домен на порт 3000.
