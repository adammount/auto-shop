# Detal

[Русский](./README.md) · **English**

An auto parts online store: a filterable catalog, ordering without online payment (the request goes
to the manager by email and WhatsApp) and separate wholesale pricing for repair shops. Content and
orders are managed in a custom admin panel built on Payload CMS.

[![Live Demo](https://img.shields.io/badge/Live_Demo-muraauto.ru-d6411a?style=for-the-badge)](https://muraauto.ru)
[![Source](https://img.shields.io/badge/Source-GitHub-16130f?style=for-the-badge&logo=github)](https://github.com/adammount/auto-shop)

![Demo](./assets/demo.gif)

## Stack

**Frontend:** Next.js 16 (App Router, RSC, ISR), React 19, TypeScript strict, SCSS modules with
design tokens, Zustand, React Hook Form + Zod, Embla Carousel, next/font/local

**Backend / CMS:** Payload CMS 3 (embedded in the same Next.js app), PostgreSQL 17, Lexical
richtext, REST + GraphQL, Next.js route handlers

**External services:** Resend (order emails), Cloudflare Turnstile (captcha), WhatsApp deep link

**Infrastructure:** Bun, Docker (multi-stage, standalone build), docker-compose, Dokploy

## The problem

The store needed retail customers and repair shops to see different prices, with orders placed as
requests — no online payment, delivered to the manager via email and WhatsApp. Constraints: the
owner edits the content (products, categories, banners, reviews, promo codes), not a developer,
while the catalog still has to be served statically instead of hitting the database on every
request. Hence Payload CMS embedded in the same Next.js app — one codebase, one deployment, shared
types between the admin panel and the storefront — plus tag-based caching invalidated by CMS hooks
whenever content changes.

## Technical decisions

- **Wholesale prices never leak into the public cache.** The `priceWholesale` field is protected by
  field-level access (`read: isWholesaleOrAdminFieldLevel`), so it physically cannot end up in a
  cached catalog response. The client requests wholesale prices separately via `POST /api/pricing`:
  the server identifies the user from the httpOnly cookie and returns wholesale pricing only for the
  `wholesale` role with `approved` status. Cards don't hammer the API one by one — the
  `shared/store/pricing.ts` store accumulates `productId`s and flushes them in a single batch after
  80 ms.

- **ISR by tags, invalidated from CMS hooks.** Catalog and content queries are wrapped in
  `unstable_cache` with `products` / `content` tags (`shared/config/cache.ts`, 1 h revalidate); the
  product page is full SSG via `generateStaticParams`. Payload's `afterChange` / `afterDelete` hooks
  call `revalidateTag(tag, 'max')`, so an edit in the admin panel busts exactly the right tag — no
  blanket flush, no waiting an hour. A Next 16 caveat: `revalidateTag` requires a second profile
  argument, and in seed scripts running outside a server context the hooks need
  `context: { disableRevalidate: true }` — otherwise it fails with "static generation store
  missing".

- **Order totals are computed on the server; the client is not trusted.** `POST /api/orders`
  validates the body with a Zod schema, but takes prices from the database rather than the client's
  cart: it re-reads products by id and recomputes `priceSnapshot`, substituting `priceWholesale` for
  wholesale sessions — also server-side. Promo codes are resolved from the `PromoCodes` collection
  with checks on active status, expiry and minimum order value. Then the order is written, emails go
  out to the manager and the customer via Resend (silently skipped when no key is set), and a
  `wa.me` link with the prepared request text is returned.

- **Server and client state are kept separate.** Catalog, product and content data come from RSC —
  none of it lives in a client store. Zustand holds only what belongs to the browser: cart,
  favorites, session, the open drawer, toasts, last order; cart and favorites use `persist`. The
  hydration flag uses `useSyncExternalStore` (`shared/lib/use-hydrated.ts`) rather than
  `useEffect` + `setState`, which would otherwise cause a hydration mismatch in the header counters.

- **Auth built on Payload Auth, with every permission check on the server.** A single `users`
  collection with `customer | wholesale | admin` roles, passwords hashed by Payload, the token in an
  httpOnly + SameSite cookie (Secure in production), `maxLoginAttempts: 5` and a 15-minute lockout.
  Public route handlers are guarded by Zod validation and an in-memory per-IP rate limit keyed off
  the trusted `CF-Connecting-IP` header. The client-side `/account` guard is UX only: the data
  itself is protected at the API level by queries with `overrideAccess: false` that pass the user
  through, so Payload applies the collection's access rules.

- **Fluid layout where 1px in the design equals 1rem.** `html { font-size: calc(100/1440*1vw) }` on
  desktop and `calc(100/375*1vw)` on mobile — values from Figma map to `rem` with no conversion, and
  the layout scales proportionally at any width. The trade-off: `rem` stops being a physical size,
  so form inputs are forced to `16px` on touch devices — otherwise Safari on iOS zooms the page on
  focus. Fonts are loaded through `next/font/local` instead of hand-written `@font-face`, which
  eliminated the font-swap CLS; icons are a single SVG sprite driven by `currentColor` rather than a
  set of components.

## Features

- Catalog with filters (categories, brands, price range, availability) and sorting; facets include
  product counts
- Product page: swipeable gallery with thumbnails, specifications, related products, wholesale price
  for approved wholesale customers
- Search: debounced dropdown suggestions in the header with request cancellation, plus a dedicated
  results page
- Cart and favorites in drawer panels persisted across sessions, with counter and total in the
  header
- Checkout: RHF + Zod form, promo codes, Turnstile captcha, emails to the manager and the customer,
  handoff to WhatsApp with a prefilled message
- Account area: profile, order history with statuses, favorites, wholesale status request
- Payload admin: products, categories, brands, promo codes, orders, banners, reviews, site settings,
  media uploads
- SEO and a11y: `sitemap.xml`, `robots.txt`, JSON-LD (Organization, Product, BreadcrumbList), skip
  link, focus trap in drawers, `prefers-reduced-motion`

## Architecture

FSD-lite without the `widgets` and `entities` layers: `app → views → shared`. The layer is called
`views` rather than `pages` because Next.js reserves `src/pages` for the Pages Router and the build
breaks otherwise.

```
src/
  app/
    (frontend)/        # storefront: layout with html/body, pages, /api/* route handlers
    (payload)/         # Payload admin and API (admin, api/[...slug], graphql)
    layout.tsx         # passthrough — without it <html> was duplicated
  views/               # page slices: home, catalog, product, checkout, account, auth, ...
  shared/
    api/               # Payload repositories, mappers to UI types, zod schemas
    store/             # zustand: cart, favorites, session, pricing, ui, toast, last-order
    ui/                # reusable components (Button, ProductCard, Drawer, Icon, ...)
    lib/               # auth, rate-limit, turnstile, formatters, hooks
    config/            # routes, cache tags and TTLs
    styles/            # tokens, breakpoints, typography, mixins
  collections/         # Payload: users, products, categories, brands, orders, promo-codes, media
  globals/             # banners, reviews, site-settings
  migrations/          # database migrations
```

Slices are accessed only through `index.ts`, and dependencies flow top-down. There are no
cross-imports between `views`: shared blocks (`ProductRail`, `FeatureGrid`) live in `shared/ui` and
receive data via props. All database access is collected in `shared/api` repositories, which expose
UI types through mappers — components never see Payload's shape.

### Known limitations

The rate limit for public routes is stored in process memory (a `Map` in
`shared/lib/rate-limit.ts`). That is sufficient for a single instance, but the state does not
survive a restart and is not shared between replicas. Scaling horizontally would require moving the
counters to Redis.

## Getting started

```bash
git clone git@github.com:adammount/auto-shop.git
cd auto-shop
bun install

cp .env.example .env                              # fill in DATABASE_URI, PAYLOAD_SECRET

docker compose -f docker-compose.dev.yml up -d    # Postgres 17 on port 5435
bun run migrate                                   # migrations
bun run seed                                      # demo data + administrator

bun run dev                                       # http://localhost:3000
```

The admin panel is at `/admin`. The first administrator is created by the seed from `ADMIN_EMAIL` /
`ADMIN_PASSWORD`, and `ADMIN_PASSWORD` is required — without it the seed fails, so no account with a
predictable password can end up in the database. These variables are read **only on creation**: if
an administrator already exists the seed skips it, so the password is changed in the admin panel
afterwards, not in `.env`.

| Command                  | What it does                      |
| ------------------------ | --------------------------------- |
| `bun run dev`            | Dev server                        |
| `bun run build`          | Production build (standalone)     |
| `bun run check`          | Types + ESLint + formatting check |
| `bun run typecheck`      | Type checking                     |
| `bun run lint`           | ESLint                            |
| `bun run format`         | Prettier formatting               |
| `bun run generate:types` | Types from the Payload schema     |
| `bun run seed`           | Seed demo data                    |

Environment variables are documented in [`.env.example`](./.env.example): database connection,
`PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, Resend and Turnstile keys, and the addresses for order
emails. `NEXT_PUBLIC_*` values are inlined into the bundle at build time — set them before `build`.

Production is deployed via `docker-compose.yml` (web + PostgreSQL, multi-stage `Dockerfile`: Bun for
the build, Node 22 alpine at runtime). Migrations are applied automatically on container start
through `docker-entrypoint.sh`.

```bash
docker compose up -d --build
```

---

**Author:** Shamil Aydemirov [Website](https://adammount.org/) ·
[GitHub](https://github.com/adammount) ·
[LinkedIn](https://www.linkedin.com/in/shamil-aydemirov-18a761429)
