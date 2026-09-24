# Sabyy Frontend — Phase 1 Implementation

## Resume Point (last update: 2026-08-13)

**Status:** Plan finalized. Backend Phase 1 scope confirmed — all 48 endpoints across 19 domains.

**Frontend scope:** 12 modules (Module 0–11) building out Phase 1 backend.

**Next action:** Module 0 (Foundation scaffold). No blockers on envelope shape/auth — backend dev will confirm both by tomorrow.

**Key decisions locked:**
- Subdomain tenant resolution: `{merchant-name}.sabyy.app` ✓
- Plain JSON, no AES encryption ✓
- JWT + refresh token in httpOnly cookie ✓
- Paystack Web as payment provider ✓

---

## 1. Locked Decisions

These were settled deliberately. Do not revisit without a reason.

| Decision | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Repo shape | **Single app**, surfaces separated by route groups |
| Rendering | **Client-first.** Pages are `"use client"`, data via TanStack Query |
| Backend access | **BFF proxy only.** The browser never calls the backend directly |
| Styling | Tailwind v4 + `design-system/tokens.css` |
| Components | shadcn/ui (Radix primitives) |
| Server state | TanStack Query v5 |
| Tables | TanStack Table v8 (server-side pagination) |
| Forms | react-hook-form + Zod |
| Charts | Recharts |
| Icons | lucide-react |
| Toasts | react-hot-toast |
| Dates | date-fns, locale `en-NG` |
| Package manager | pnpm |

### Reference project

[`perry-cleans-frontend`](../../perry-document/perry-cleans-frontend/) is the architectural template. Copy its transport layering, proxy pattern, route-group structure, and per-module `*.api.ts` / `*.types.ts` convention.

**Do not copy from it:**

1. **The AES encryption + signature layer** (`lib/security/`, `utils/encryptDecrypt.ts`, `textData` envelopes). Sabyy uses plain JWT in an httpOnly cookie. Everything about `NEXT_PUBLIC_AES_KEY` and `buildRequestSignature` is Perry-specific.
2. **`formatCurrency`** — Perry's takes Naira floats. Sabyy stores **kobo integers** (see [Money](#money)).
3. **Its brand tokens** — Sabyy's palette lives in `design-system/tokens.css` (purple/lilac, not Perry's).

---

## 2. Architecture

### Request flow

```
page.tsx ("use client")
  └─ useQuery / useMutation
      └─ lib/api/orders.api.ts          ← typed per-domain functions
          └─ requestApi()                ← lib/api/_transport.ts (single client helper)
              └─ /app/api/orders/route.ts ← thin route handler
                  └─ proxyRequest()       ← lib/server/proxy.ts (generic, reads httpOnly cookie)
                      └─ {API_BASE}/v1/orders
```

The access token lives in an httpOnly cookie read server-side in `proxyRequest`. It is never exposed to JavaScript. Route handlers stay ~8 lines each: method, `backendPath`, `allowQueryParams` allowlist.

### Folder structure

```
app/
├── (auth)/login, signup
├── (storefront)/[store]/..., products/[slug], cart, checkout, order/[id]
├── (dashboard)/home, orders, products, inventory, customers,
│                finance/{pnl,expenses,ledger,wallet},
│                staff, locations, subscriptions, settings
├── (pos)/pos
├── api/                        ← BFF proxy routes, mirrors /v1/
└── layout.tsx                  ← providers: Query, Auth, Toaster

lib/
├── api/        _transport.ts, {domain}.api.ts, {domain}.types.ts, types.ts
├── server/     proxy.ts, backend-client.ts
├── mappers/    {domain}.mapper.ts
├── providers/  query-provider.tsx
├── schemas/    zod form schemas
├── format.ts   money (kobo), dates, phone
└── utils.ts

components/
├── ui/         shadcn — surface-agnostic
├── layout/     sidebar, header, mobile-nav
├── auth/       Guard, FeatureGate
├── storefront/ dashboard/ pos/    ← never import from each other

contexts/       auth-context.tsx
hooks/          use-debounced-value, use-mobile, use-idle-timer
middleware.ts   route protection + role redirects
```

### Boundary rules (non-negotiable)

These keep a future monorepo split cheap. Enforce in review:

1. `components/ui/` never imports from `components/storefront|dashboard|pos/`.
2. `components/storefront/`, `components/dashboard/`, `components/pos/` never import from each other.
3. No shared client-side global state across surfaces.
4. Types live per-domain in `lib/api/{domain}.types.ts` — **no barrel god-file**.
5. Each domain gets its own `*.api.ts`. Never one shared API module.

**Split triggers** (revisit repo shape when any becomes true): a dashboard deploy causes storefront downtime; more than one person ships independently; CI exceeds ~10 min; POS needs offline/installable; storefront needs its own caching tier.

---

## 3. Cross-Cutting Concerns

Apply in every phase.

### API contract discipline

Adopted from Perry's `AGENTS.md`:

- Use **exact** backend field names, case-sensitive. Never rename `firstName` → `first_name`.
- Model optional fields as optional/nullable exactly as the contract defines.
- Never invent request/response shapes. If a field's meaning is unclear, **ask** — do not guess.
- Surface backend error messages to the user; never replace them with generic text.
- Swagger at `/documentation` is authoritative over this document and over the brief.

### Money

All backend monetary values are **kobo integers**. All arithmetic stays in integers. Convert only at the render layer.

```ts
// lib/format.ts
export function formatKobo(kobo: number, withSymbol = true): string {
  const naira = kobo / 100;
  const s = new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 2,
  }).format(naira);
  return withSymbol ? s : s.replace("₦", "").trim();
}
```

Never store or pass floats. Never display intermediate float values.

### RBAC

Roles: `owner`, `manager`, `staff`, `viewer`. Read from `GET /v1/auth/me` → `role`, store in `auth-context`.

```tsx
<Guard role={["owner", "manager"]}>
  <Button>Refund</Button>
</Guard>
```

`Guard` renders `null` when the role doesn't match — **hidden, not blocked**. Never render "Access Denied". Exception: Finance for `viewer` renders read-only with all action buttons removed, not hidden entirely.

Full permission matrix is in the brief §9.1 — implement it exactly.

### Feature gating

When the tenant's plan lacks a feature, render the page **blurred behind a modal overlay** with the upgrade CTA (brief §9.3). Never redirect, never show a raw 403. The point is to make the value tangible.

### Required UI states

Every list, table, and detail view ships all four: **loading** (skeletons matching real dimensions), **empty** (icon + heading + supporting text + optional CTA), **error** (backend message surfaced in a toast), **success**.

### Localization

- Dates: date-fns, `en-NG`.
- Phone: Nigerian format handling per brief §8.2.
- NDPR: consent capture is first-class — checkout, POS, and WhatsApp all record `consentSource`. Never make consent implicit.

---

## 4. Module Index — Backend Phase 1 (All 48 Endpoints)

**Build order:** domain modules before surfaces. Dashboard Home (aggregator) is last. Storefront and POS come after dashboard because they reuse the same `*.api.ts` and types.

**Endpoint coverage by module:**

| Frontend Module | Backend Scope | Endpoints | Depends on |
|---|---|---|---|
| 0 | Foundation | — | — |
| 1 | Auth + Shell | login, refresh, logout, me | 0 |
| 2 | Orders | GET/POST orders, confirm, process, fulfil, cancel (7) | 1 |
| 3 | Products | GET/POST/PATCH products, categories, variants (8) | 1 |
| 4 | Inventory | list, receive, adjust, transfer, movements, availability, low-stock (7) | 3 |
| 5 | Customers | list, create, detail, update (4) | 1 |
| 6 | Finance | ledger, wallet, balances, entries, accounts, P&L, expenses, invoicing (11) | 1 |
| 7 | Advanced Ops | staff, locations, subscriptions (5), shipping (7), dispatch (5), reports (7) | 2–6 |
| 8 | Dashboard Home | KPI agg + notifications | 2–7 |
| 9 | Storefront | public product browse, cart, checkout, order tracking (reuses 2, 3, 5) | 2, 3, 5 |
| 10 | POS | product search, customer lookup, charge flow (reuses 2, 3, 5) | 2, 3, 5 |
| 11 | WhatsApp | state machine config (backend-only, UI dashboard screens added to 7) | 1 |

**Note:** All 48 endpoints are backend Phase 1. Frontend modules 0–11 represent **logical delivery increments** within Phase 1. The merchant dashboard (modules 1–8) ships as one coherent product. Storefront and POS (9–10) add customer-facing surfaces once the core dashboard is stable. Polish is continuous, not a separate milestone.

---

## Module 0 — Foundation

**A. Scaffold.** `pnpm create next-app` — TS, Tailwind v4, App Router, ESLint, Prettier. Add shadcn/ui. Install the dependency set from §1.

**B. Design tokens.** Wire `design-system/tokens.css` into `globals.css`. Map tokens to Tailwind v4 `@theme`. Load Montserrat. Verify against brief §2: cards are **border-only, no shadow**; shadows only on floating layers (modal, dropdown, toast).

**C. Transport.** Build `lib/api/types.ts` (`ApiEnvelope<T>`, `ApiListResponse<T>`, `ApiError`) and `lib/api/_transport.ts` with `requestApi()`. Normalize errors into typed `ApiError`. Dispatch an `auth:unauthorized` window event on 401 for central session handling. **⚠ Confirm the real envelope shape against Swagger first — do not assume Perry's `{status, code, message, payload}`.**

**D. Proxy.** Build `lib/server/proxy.ts`: reads httpOnly cookie, forwards `Authorization`, allowlists query params, `cache: "no-store"`. No encryption. Add `lib/server/backend-client.ts` for server-side calls (login route, `generateMetadata`).

**E. Core UI.** Port/adapt from Perry, restyled to Sabyy tokens: `button`, `input`, `label`, `card`, `badge`, `dialog`, `sheet`, `select`, `table`, `data-table`, `server-data-table`, `skeleton`, `loading-skeletons`, `toaster`, `top-progress`, `empty-state`.

**Done when:** the app builds, tokens render correctly, and one throwaway proxied `GET` returns real backend data end-to-end.

---

## Module 1 — Auth + Shell

Endpoints: `POST /v1/auth/login`, `GET /v1/auth/me`, `POST /v1/auth/logout`, `POST /v1/auth/refresh`.

- Login route handler calls the backend and sets the httpOnly cookie. Login page: react-hook-form + Zod, backend errors surfaced inline.
- `contexts/auth-context.tsx` — holds user, role, tenant, plan. Restores session via `/v1/auth/me`. Listens for `auth:unauthorized` → clears and redirects.
- `middleware.ts` — protect `(dashboard)` and `(pos)`, redirect authed users away from `/login`, route `/` by auth state.
- `components/auth/Guard.tsx` and `FeatureGate.tsx`.
- Shell: sidebar (brief §4.2 — grouped Finance/Operations, active state = filled icon + accent text + 3px accent-light left border, locked items grayed with lock icon), top bar (brief §4.3 — tenant name, notification bell with count, avatar menu with **Switch to POS**), mobile drawer.

**Done when:** login works, session survives refresh, sidebar items hide correctly per role, logout clears the cookie.

---

## Module 2 — Orders

`GET /v1/orders` (filters: `status`, `channel`, `startDate`, `endDate`) · `GET /v1/orders/{id}` · `POST /v1/orders/{id}/confirm|process|fulfil|cancel`

- `orders.types.ts` mirroring the API exactly; `orders.api.ts`; `orders.mapper.ts` if UI shape diverges.
- List: server-side pagination, debounced search (350ms), status + channel + date-range filters, reset to page 1 on filter change, `keepPreviousData`.
- Detail: line items, customer, payment status, timeline. Status transition actions behind `Guard` (`owner`/`manager` for Confirm and Refund).
- Status badges per brief §2.7 color mapping.

**Done when:** all filters hit the real API, every transition works, and each action's role gate matches brief §9.1.

---

## Module 3 — Products

`GET/POST /v1/products` · `PATCH /v1/products/{id}` · `POST /v1/products/{id}/variants` · `PATCH /v1/products/{id}/variants/{vid}` · `GET /v1/products/categories`

- List with search + category filter. **Cost column is `owner`/`manager` only.**
- Create/edit form with Zod validation. Prices entered in Naira, **converted to kobo before submit**.
- Variant management (add/edit, per-variant price and SKU).
- Image upload via `POST /v1/uploads/image`.

---

## Module 4 — Inventory

`GET /v1/inventory?locationId=` · `POST /v1/inventory/receive` · `POST /v1/inventory/adjust` · `POST /v1/inventory/transfer` · `GET /v1/inventory/movements` · `GET /v1/inventory/availability` · `GET /v1/inventory/low-stock`

Stock levels by location, receive/adjust/transfer modals (gated to `owner`/`manager`), movement history, low-stock alerts feeding the notification panel.

---

## Module 5 — Customers

`GET /v1/customers?search=` · `GET /v1/customers/{id}` · `POST /v1/customers` · `PATCH /v1/customers/{id}`

List with debounced search; detail with order history; create/edit (`Edit` allowed for `staff` and up). **NDPR consent status displayed on the detail view.**

---

## Module 6 — Finance

`GET /v1/ledger/wallet` · `GET /v1/ledger/balances` · `GET /v1/ledger/entries` · `GET /v1/ledger/accounts` · `GET /v1/reports/pl` · `GET /v1/reports/pl/export` · `GET /v1/expenses/` · `POST /v1/expenses/` · `GET /v1/invoices/` · `POST /v1/invoices/`

Five pages: P&L (Recharts, **feature-gated — Entry plan and above**), Expenses, Invoicing, Ledger (journal entries + chart of accounts), Wallet. Read-only for `viewer` with actions removed. All amounts via `formatKobo`.

---

## Module 7 — Advanced Operations

**Staff:** `GET /v1/staff/` · `POST /v1/staff/` · `GET /v1/staff/{id}` · `POST /v1/staff/invite` — `owner` only, role assignment.

**Locations:** `GET /v1/locations/` · `POST /v1/locations/` · `GET /v1/locations/{id}` · `PATCH /v1/locations/{id}` — `owner` only, **feature-gated to Growth+**.

**Subscriptions:** `GET /v1/subscriptions/` · `POST /v1/subscriptions/initiate` · `POST /v1/subscriptions/cancel` — `owner` only, current plan, usage, upgrade flow.

**Shipping & Dispatch:** Methods, zones, rates, conditions, pickup locations, available shipping, state list, quote, configure, dispatch tracking.

**Reports:** P&L export, revenue by location, inventory valuation, best sellers, staff sales (with export).

---

## Module 8 — Dashboard Home

KPI widgets (revenue, orders, customers, low stock), recent orders, sales chart, notification panel. Built last — reuses queries and components from Modules 2–7. Every widget respects role and plan gates.

---

## Module 9 — Storefront

`GET /v1/products?isActive=true` · `GET /v1/products/{id}` · `GET /v1/products/categories` · `POST /v1/orders` · `POST /v1/customers` · `POST /v1/payments/initiate` · `GET /v1/orders/{id}` · `POST /v1/tenants/` (signup)

Six screens (brief §3.2): Homepage/Catalogue, Product Detail, Cart, Checkout, Order Confirmation, Order Status Tracker.

- Cart state client-side (localStorage), tenant-scoped.
- Checkout captures **NDPR consent with `consentSource`**.
- Payment initiation via Paystack (redirect flow).
- **Optional, non-blocking:** a server `page.tsx` shell exporting `generateMetadata` for product pages, so WhatsApp/social link previews render title, price, and image. The page body stays fully client-side — this only emits `<meta>` tags. Add per-route later if link previews matter; it requires no refactor.

---

## Module 10 — POS

Reuses Orders, Products, Customers, Payments endpoints from Modules 2, 3, 5.

Six screens (brief §5.3): Product Search & Selection, Variant Picker (bottom sheet), Customer Lookup, Charge/Payment, Payment Confirmation/Receipt, End of Day Summary.

Touch-first: **48px (`lg`) buttons, 44px minimum tap targets**. Accessible to `staff` and up.

---

## Module 11 — WhatsApp + Polish

**WhatsApp:** Config and webhook handling (backend provides state machine; frontend adds dashboard admin screens for setup, templates, and conversation state — added to Module 7 if needed).

**Polish:** Responsive audit (mobile 0–767 / tablet 768–1279 / desktop 1280+, brief §7). Empty and error states everywhere. Keyboard nav and focus traps in modals/drawers. Low-bandwidth behavior (brief §8.5). Lighthouse pass on storefront. Copy tone review (brief §8.3).

---

## 4a. Tenant Resolution — Subdomain Strategy

This is new compared to Perry (which has no multi-tenant storefront). Sabyy storefront is public; each merchant owns a subdomain.

### How it works

- Merchant onboarding creates a tenant with a `slug` (e.g., `luxury-boutique`).
- Storefront lives at `https://luxury-boutique.sabyy.app`.
- Dashboard is origin-agnostic; same code at any subdomain redirects to `/login` if not authed.
- On login, we set cookies with `Domain=.sabyy.app` (leading dot) so they work across all subdomains.

### Router / middleware changes

**Storefront** (Phase 9): 
- `app/(storefront)/[store]/...` captures the merchant slug from subdomain, not path.
- Middleware extracts subdomain via `request.headers.host` → `luxury-boutique.sabyy.app` → slug = `luxury-boutique`.
- Pass slug to all API calls as a query param or request header so the backend knows which tenant's data to return.
- Fallback: if no subdomain (user visits `sabyy.app` directly), show a tenant selector or redirect to onboarding.

**Dashboard** (Phase 1–8):
- `app/(dashboard)/...` is the same code for all merchants.
- On load, read the subdomain, confirm auth, and fetch tenant-specific data.
- Sidebar and topbar show the current merchant name from auth context.
- No code duplication; routing is transparent.

### Why this matters

- **SEO:** Merchant storefronts are discoverable as separate properties (not buried under `/store/luxury-boutique`).
- **Branding:** Each merchant can point a custom domain (`shop.luxury-boutique.com`) to their subdomain if desired (CNAME).
- **API isolation:** The backend's multi-tenancy is mirrored in the URL structure, reducing confusion.

**Implementation detail:** the `tenantSlug` parameter in every login request (see Swagger) confirms you're logging into the right merchant. Middleware enforces subdomain ↔ slug consistency.

---

## Confirmed Decisions (User Input)

These were decided in conversation, no longer open:

1. **Response envelope shape** — Backend dev will confirm by tomorrow against Swagger. Assume wrapper exists; if bare JSON, `ApiEnvelope<T>` is trivial to adjust.
2. **Auth handshake** — JWT + refresh token, backend sets httpOnly cookie. Backend dev will confirm handshake details and rotation policy by tomorrow.
3. **Tenant resolution** — **Subdomain: `{merchant-name}.sabyy.app`** ✓ Storefront routes via subdomain capture; dashboard is origin-agnostic.
4. **Payment provider** — **Paystack Web** (redirect flow). Webhook handling for both Paystack and Flutterwave in the spec (spec includes both).
5. **Encryption** — **None.** Plain JSON request/response, no `NEXT_PUBLIC_AES_KEY` or signature layer.

**Still needed:**
- Swagger response shape confirmation (envelope vs bare JSON).
- Backend auth handshake details and token rotation policy.
- API base URL for dev environment.
- Storefront domain strategy: is `sabyy.app` the platform tenant, or does each merchant own their domain?

---

## Out of Scope (Backend Phase 2+)

Loyalty points, virtual bank accounts, multi-currency, gift cards, B2B pricing tiers, advanced analytics beyond P&L, FIRS tax filing, floating wallet at scale.

If any of these come up during the build, flag them as backend Phase 2 scope rather than absorbing into Phase 1.

---

## How We Work Each Module

1. Confirm the endpoint contract against Swagger (request, response, pagination, filters).
2. Write strict types from the real schema — no invented fields.
3. Wire `*.api.ts` without renaming backend fields.
4. Build UI with all four states (loading, empty, error, success).
5. Apply role guards and plan gates.
6. Validate against the real endpoint before moving on.
7. Update the Resume Point at the top of this file.

---

## Next Step: Endpoint Testing

Test a couple of endpoints and share the response payloads:
- `POST /v1/auth/login` — response body (especially the token and user shape)
- `GET /v1/products/categories` — response body (especially pagination structure if paginated)

This will finalize the `ApiEnvelope<T>` shape for `lib/api/types.ts` and `lib/api/_transport.ts` in Module 0.


1. Since we are not yet implementing encryption, we will send plain json and the backend to is returning plain JSON back to us

2. I will confirm from him and tell him to do it if he is not

3. Please explaon this it is not clear, Tenant resolution on the storefront — subdomain, path segment, or custom domain? Changes routing and middleware.

WHat does it changes, the previous project has nothing like this so we have to build ours and build it well

4. We would use the paystack web version for now.

There is no API docs given to me yet, but we would work on this ourselves, remeber we are building the UI first before any bakend implementation, I will get that backend docs at least by tomorrow and then we will build along side the UI