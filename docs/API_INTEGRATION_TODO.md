# API Integration — oniraja-server → sabby-client

Backend: `oniraja-server` (Fastify, `/v1/*`, envelope `{ success, data }` / `{ success: false, error }`).
Client base URL: `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:5001`).

## Todo

- [x] 1. Foundation: money/date formatting, toaster, providers order, query-cache reset on logout/401, feature-gate (402) helpers, shared UI (modal, pagination, badges, states)
- [x] 2. Auth: verify login / refresh / logout / me against the server contract
- [x] 3. Domain API modules (types + api): orders, products, customers, inventory, reports, ledger, subscriptions
- [x] 4. Orders page: real list, status filter, date range, pagination, stat cards
- [x] 5. Orders: status transitions (confirm / process / fulfil / cancel) with role gating
- [x] 6. Orders: create-order dialog (product → variant → qty, optional customer)
- [x] 7. Products page: list, search, categories tab, stat cards from inventory + valuation
- [x] 8. Products: create product (with first variant) and create category dialogs
- [x] 9. Customers page: list, search, pagination, create customer with NDPR consent
- [x] 10. Analytics: monthly P&L charts + best sellers, plan-gated (402) states
- [x] 11. Dashboard home: real metrics, recent orders, sales chart, trial banner
- [x] 12. Verify: typecheck, lint, build (all pass)
- [x] 13. End-to-end run in Chrome against oniraja-server (staging DB), with a dedicated test business `claude-qa-10160834`:
  login, dashboard, create category, create product with opening stock, create customer with NDPR consent, customer search,
  create order, confirm → process → fulfil, cancel, status filters, stock deduction (10 → 8), trial plan gates (402), logout
- [x] 14. Fixes from the run: mutations no longer wait for list refetches, order status updates immediately after an action,
  "Working…" label on order actions, VAT included in line totals shown on the order, "Loading orders…" label

## Contract notes (differences from IMPLEMENTATION_PLAN.md)

- Orders list date filters are `from` / `to` (not `startDate` / `endDate`). No search param.
- Orders list `status` filter accepts `draft|confirmed|processing|fulfilled|cancelled|refunded`.
- `confirm` and `cancel` require owner/manager; confirming requires the order to have a `locationId`.
- Product list rows carry no variants/prices; `GET /v1/products/:id` returns `{ ...product, variants }`.
- Locations endpoints are gated to Growth+ (`locations:manage`); location ids are taken from `GET /v1/inventory` instead.
- Reports (`/v1/reports/*`) are plan-gated; trial tenants get `402 FEATURE_GATED`.
- Customer groups and newsletter have no backend endpoints yet.
- Customer search uses SQL `LIKE` on first name, phone and email: it is case-sensitive and ignores last name.
- No endpoints for store description/image, site visits, online vs offline sales totals, discounts or shipping spend, so those dashboard/analytics tiles were replaced with backed metrics.
- The dashboard's monthly sales chart makes one `/reports/pl` call per month (no time-series endpoint).
- Server: a business created via `POST /v1/tenants` has no `subscriptions` row, so `GET /v1/subscriptions` returns 404 (the trial banner stays hidden).
- Server: order line totals and the subtotal include per-line VAT; `order.taxKobo` is only the order-level tax.
