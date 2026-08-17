# Деталь

**Русский** · [English](./README.en.md)

Интернет-магазин автозапчастей: каталог с фильтрами, заказ без онлайн-оплаты (заявка уходит
менеджеру на почту и в WhatsApp) и отдельные оптовые цены для автосервисов. Контент и заказы ведутся
в собственной админке на Payload CMS.

[![Live Demo](https://img.shields.io/badge/Live_Demo-muraauto.ru-d6411a?style=for-the-badge)](https://muraauto.ru)
[![Source](https://img.shields.io/badge/Source-GitHub-16130f?style=for-the-badge&logo=github)](https://github.com/adammount/auto-shop)

![Demo](./assets/demo.gif)

## Стек

**Фронтенд:** Next.js 16 (App Router, RSC, ISR), React 19, TypeScript strict, SCSS-модули с
дизайн-токенами, Zustand, React Hook Form + Zod, Embla Carousel, next/font/local

**Бэкенд / CMS:** Payload CMS 3 (встроен в то же Next.js-приложение), PostgreSQL 17, Lexical
richtext, REST + GraphQL, route handlers Next.js

**Внешние сервисы:** Resend (письма о заказах), Cloudflare Turnstile (капча), WhatsApp deep link

**Инфраструктура:** Bun, Docker (multi-stage, standalone-сборка), docker-compose, Dokploy

## Задача

Нужен был магазин автозапчастей, где розничный покупатель и автосервис видят разные цены, а заказ
оформляется заявкой — без онлайн-оплаты, с уходом менеджеру в почту и WhatsApp. Ограничения: контент
(товары, категории, баннеры, отзывы, промокоды) редактирует владелец, а не разработчик, при этом
каталог должен отдаваться статикой и не ходить в базу на каждый запрос. Отсюда Payload CMS,
встроенный в то же Next.js-приложение — одна кодовая база, один деплой, общие типы между админкой и
витриной — и кэш по тегам, который сбрасывается хуками CMS при правке контента.

## Технические решения

- **Оптовые цены не утекают в публичный кэш.** Поле `priceWholesale` закрыто field-level access
  (`read: isWholesaleOrAdminFieldLevel`), поэтому в закэшированный ответ каталога оно физически не
  попадает. Клиент запрашивает оптовые цены отдельно через `POST /api/pricing`: сервер определяет
  пользователя по httpOnly-cookie и отдаёт оптовую цену только при роли `wholesale` со статусом
  `approved`. Карточки не бомбят API поштучно — стор `shared/store/pricing.ts` копит `productId` и
  флашит их одним батчем через 80 мс.

- **ISR по тегам с инвалидацией из хуков CMS.** Запросы каталога и контента обёрнуты в
  `unstable_cache` с тегами `products` / `content` (`shared/config/cache.ts`, revalidate 1 ч),
  страница товара — полноценный SSG через `generateStaticParams`. Хуки Payload `afterChange` /
  `afterDelete` дёргают `revalidateTag(tag, 'max')`, так что правка в админке сбрасывает ровно
  нужный тег, без общего сброса и без ожидания часа. Нюанс Next 16: `revalidateTag` требует второй
  аргумент-профиль, а в seed-скриптах вне серверного контекста хукам нужно передавать
  `context: { disableRevalidate: true }` — иначе падает «static generation store missing».

- **Итог заказа считается на сервере, клиенту не доверяем.** `POST /api/orders` валидирует тело
  Zod-схемой, но цены берёт не из корзины клиента: перечитывает товары из БД по id и складывает
  `priceSnapshot` заново, а для оптовой сессии подставляет `priceWholesale` — тоже на сервере.
  Промокод резолвится из коллекции `PromoCodes` с проверкой активности, срока и минимальной суммы.
  Дальше — запись заказа, письма менеджеру и клиенту через Resend (тихо пропускаются, если ключ не
  задан) и возврат `wa.me`-ссылки с готовым текстом заявки.

- **Разделение серверного и клиентского состояния.** Данные каталога, товара и контента приходят из
  RSC — в клиентском сторе их нет. Zustand держит только то, что принадлежит браузеру: корзина,
  избранное, сессия, открытый drawer, тосты, последний заказ; корзина и избранное — с `persist`.
  Флаг гидратации сделан через `useSyncExternalStore` (`shared/lib/use-hydrated.ts`), а не
  `useEffect` + `setState`, — иначе счётчики в хедере дают hydration mismatch.

- **Auth на встроенном Payload Auth, все проверки прав на сервере.** Одна коллекция `users` с ролями
  `customer | wholesale | admin`, пароли хэширует Payload, токен — в httpOnly + SameSite cookie
  (Secure в проде), `maxLoginAttempts: 5` и блокировка на 15 минут. Публичные route handlers закрыты
  Zod-валидацией и in-memory rate-limit по IP из доверенного заголовка `CF-Connecting-IP`.
  Клиентский гард `/account` — только UX: сами данные защищены на уровне API запросами с
  `overrideAccess: false` и передачей пользователя, так что access-правила коллекции применяет
  Payload.

- **Резиновая вёрстка 1px макета = 1rem.** `html { font-size: calc(100/1440*1vw) }` на десктопе и
  `calc(100/375*1vw)` на мобильном — значения из Figma переносятся в `rem` без пересчёта, макет
  тянется пропорционально на всех ширинах. Обратная сторона: `rem` перестаёт быть физическим
  размером, поэтому поля ввода на тач-устройствах принудительно переводятся на `16px` — иначе Safari
  на iOS зумит страницу при фокусе. Шрифты подключены через `next/font/local` вместо ручного
  `@font-face`, что убрало CLS от подмены шрифта; иконки — один SVG-спрайт на `currentColor` вместо
  набора компонентов.

## Функциональность

- Каталог с фильтрами (категории, бренды, диапазон цены, наличие) и сортировкой; фасеты считаются с
  количеством товаров
- Страница товара: галерея со свайпом и превью, характеристики, похожие товары, оптовая цена для
  одобренного оптовика
- Поиск: дропдаун-подсказки в хедере с дебаунсом и отменой запросов + отдельная страница результатов
- Корзина и избранное в drawer-панелях с сохранением между сессиями, счётчик и сумма в хедере
- Оформление заказа: форма на RHF + Zod, промокоды, капча Turnstile, письма менеджеру и клиенту,
  переход в WhatsApp с готовым сообщением
- Личный кабинет: профиль, история заказов со статусами, избранное, заявка на оптовый статус
- Админка Payload: товары, категории, бренды, промокоды, заказы, баннеры, отзывы, настройки сайта,
  загрузка медиа
- SEO и a11y: `sitemap.xml`, `robots.txt`, JSON-LD (Organization, Product, BreadcrumbList),
  skip-link, фокус-трап в drawer'ах, `prefers-reduced-motion`

## Архитектура

FSD-lite без слоёв `widgets` и `entities`: `app → views → shared`. Слой называется `views`, а не
`pages`, — Next.js резервирует `src/pages` под Pages Router и ломает сборку.

```
src/
  app/
    (frontend)/        # витрина: layout с html/body, страницы, route handlers /api/*
    (payload)/         # админка и API Payload (admin, api/[...slug], graphql)
    layout.tsx         # passthrough — без него дублировался <html>
  views/               # слайсы страниц: home, catalog, product, checkout, account, auth, ...
  shared/
    api/               # репозитории Payload, мапперы в UI-типы, zod-схемы
    store/             # zustand: cart, favorites, session, pricing, ui, toast, last-order
    ui/                # переиспользуемые компоненты (Button, ProductCard, Drawer, Icon, ...)
    lib/               # auth, rate-limit, turnstile, форматтеры, хуки
    config/            # routes, теги и TTL кэша
    styles/            # токены, брейкпоинты, типографика, миксины
  collections/         # Payload: users, products, categories, brands, orders, promo-codes, media
  globals/             # banners, reviews, site-settings
  migrations/          # миграции БД
```

Доступ к слайсам — только через `index.ts`, зависимости идут сверху вниз. Между `views` нет
кросс-импортов: общие блоки (`ProductRail`, `FeatureGrid`) живут в `shared/ui` и принимают данные
пропсами. Все обращения к БД собраны в репозиториях `shared/api`, наружу отдаются UI-типы через
мапперы — компоненты не знают о формате Payload.

### Известные ограничения

Rate-limit публичных роутов хранится в памяти процесса (`Map` в `shared/lib/rate-limit.ts`). Для
одного инстанса этого достаточно, но состояние не переживает рестарт и не разделяется между
репликами. При горизонтальном масштабировании счётчики нужно выносить в Redis.

## Запуск

```bash
git clone git@github.com:adammount/auto-shop.git
cd auto-shop
bun install

cp .env.example .env                              # заполнить DATABASE_URI, PAYLOAD_SECRET

docker compose -f docker-compose.dev.yml up -d    # Postgres 17 на порту 5435
bun run migrate                                   # миграции
bun run seed                                      # демо-данные + администратор

bun run dev                                       # http://localhost:3000
```

Админка — `/admin`. Первый администратор создаётся сидом из `ADMIN_EMAIL` / `ADMIN_PASSWORD`, причём
`ADMIN_PASSWORD` обязателен — без него сид падает с ошибкой, чтобы в базе не появился аккаунт с
предсказуемым паролем. Переменные читаются **только при создании**: если администратор уже есть, сид
его пропускает, поэтому пароль потом меняется в самой админке, а не в `.env`.

| Команда                  | Что делает                              |
| ------------------------ | --------------------------------------- |
| `bun run dev`            | Дев-сервер                              |
| `bun run build`          | Прод-сборка (standalone)                |
| `bun run check`          | Типы + ESLint + проверка форматирования |
| `bun run typecheck`      | Проверка типов                          |
| `bun run lint`           | ESLint                                  |
| `bun run format`         | Форматирование Prettier                 |
| `bun run generate:types` | Типы из схемы Payload                   |
| `bun run seed`           | Сидинг демо-данных                      |

Переменные окружения — в [`.env.example`](./.env.example): подключение к БД, `PAYLOAD_SECRET`,
`NEXT_PUBLIC_SERVER_URL`, ключи Resend и Turnstile, адреса для писем о заказах. `NEXT_PUBLIC_*`
инлайнятся в бандл на сборке — задавать до `build`.

Прод разворачивается через `docker-compose.yml` (web + PostgreSQL, multi-stage `Dockerfile`: Bun на
сборке, Node 22 alpine в рантайме). Миграции применяются автоматически при старте контейнера через
`docker-entrypoint.sh`.

```bash
docker compose up -d --build
```

---

**Автор:** Шамиль Айдемиров [Сайт](https://adammount.org/) · [GitHub](https://github.com/adammount)
· [LinkedIn](https://www.linkedin.com/in/shamil-aydemirov-18a761429)
