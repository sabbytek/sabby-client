# Dashboard Design System

Reference for the merchant dashboard's visual language (`src/app/dashboard/`, `src/components/layout/sidebar.tsx`, `src/components/layout/topbar.tsx`). Style direction: **clean minimal SaaS** (Stripe/Linear-inspired) — restrained color, no heavy shadows or big borders, purple used sparingly for emphasis only.

Use this doc when adding new dashboard sections so they stay consistent, and **before adding images** — see [Images & borders](#images--borders) below.

## Core principles

1. **Cards carry no border.** Separation from the page background comes from a soft shadow + the subtle white/off-white contrast (`bg-surface-container-lowest` cards on `bg-background` page), never a 1px outline.
2. **Color is restrained.** Purple (`primary`) is reserved for: primary CTAs, active nav state, links, and the currently-selected state. Icons and secondary UI default to neutral gray (`text-on-surface-variant`). Avoid giving every card/icon its own accent color — that's the "2012 admin template" look we moved away from.
3. **Radius is moderate, not bubbly.** `rounded-xl` (12px) for cards, `rounded-lg` (8px) for buttons/inputs/nav pills. Avoid `rounded-2xl`/`rounded-3xl` — too soft/playful for this direction.
4. **Shadows are soft and layered, not heavy.** See the exact recipe below — never use Tailwind's default `shadow-md`/`shadow-lg`/`shadow-xl` on cards, they read as dated.
5. **Density over whitespace.** Tighter gaps (`gap-5`, `p-5`/`p-6`) and smaller type (`text-sm`, `text-xs`) than the marketing landing page — this is a working tool, not a marketing page.

## Card pattern

This is the base class set for every dashboard card (metric tiles, the chart panel, to-do list, quick actions, etc.):

```
bg-surface-container-lowest rounded-xl p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_2px_8px_rgba(16,24,40,0.06)]
```

- **No `border` class.** If a card needs hover feedback, add shadow growth instead of a border color change:
  ```
  hover:shadow-[0_2px_4px_rgba(16,24,40,0.06),0_6px_20px_rgba(16,24,40,0.08)] transition-shadow
  ```
- Only apply the hover-shadow variant to genuinely interactive/clickable cards (e.g. metric tiles, mini-metric tiles). Static content cards (chart, to-do list, recent orders) keep the resting shadow only.
- Nested elements *inside* a card (table header row, a dashed chart guide line, a form `<select>`, an icon button) may still use thin borders — those are structural/functional dividers, not card chrome, and are fine as-is (`border-outline-variant/60` at low opacity, or `border-outline-variant/40` for very subtle internal rules).

## Color tokens used

| Token | Use |
|---|---|
| `bg-background` | Page background (very light lavender-white) |
| `bg-surface-container-lowest` | Card background (white) |
| `bg-surface-container-low` | Subtle fills — icon chip backgrounds, hover states, progress bar track |
| `text-on-surface` | Primary text (headings, values) |
| `text-on-surface-variant` | Secondary/muted text, default icon color |
| `primary` / `text-primary` | The one accent color — CTAs, active nav, links only |
| `bg-[#046C4E]` | The one deliberate color-block exception: "Refer & Earn" promo card and the floating chat button. Don't add more colored cards beyond this — it works *because* it's rare. |

## Typography scale (dashboard only)

- Page title ("Hello Femi,"): `text-2xl font-semibold tracking-tight`
- Card/section title: `text-base font-semibold`
- Card label (uppercase eyebrow, e.g. "TOTAL SALES"): `text-xs uppercase tracking-wider font-medium`
- Body/description text: `text-sm` or `text-xs` depending on hierarchy
- Big stat numbers: `text-[28px] font-semibold font-mono` (mono for numeric alignment)

## Icons

- Library: `lucide-react` only — never the Material Symbols font (it silently fails to load in this project's build and renders as literal text; this bit us once already on the landing page).
- Default size: `16`–`18px` for inline/label icons, `22px` for card feature icons, `28px` for empty-state illustration icons.
- Default `strokeWidth={1.75}` for a slightly lighter, more refined line than Lucide's default `2` — matches the minimal direction. Active/emphasized icons can use the default weight.
- Icons default to `text-on-surface-variant` (neutral gray). Only use `text-primary` when the icon itself is the interactive/active signal (e.g. active sidebar item).

## Sidebar pattern

- Nav items are **inset rounded pills** (`px-3 py-2 rounded-lg`), not full-width bars with a colored border edge.
- Active state: `bg-surface-container-low text-primary font-medium` — a soft fill, no hard border block.
- Inactive/hover: `text-on-surface-variant hover:bg-surface-container-low/60 hover:text-on-surface`.
- Section labels ("Management"): `text-[11px] uppercase tracking-wider text-on-surface-variant/60 font-medium`.

## Topbar pattern

- `bg-surface-container-lowest/90 backdrop-blur-md`, bottom border only (`border-b border-outline-variant/60`), no shadow.
- Only one filled purple button per topbar ("View Store"). Secondary actions ("Point of Sale") are outline/ghost style, not filled.

## Images & borders

**When importing real images/screenshots into the dashboard (product photos, store screenshots, etc.), check whether the image asset already has its own border, frame, or drop shadow baked in** (this happens often with exported mockups/screenshots). If it does:

- **Do not** wrap it in a card that also has the shadow recipe above — you'll get a double border/shadow effect that looks like a mistake, not a design choice.
- Prefer dropping the image directly into the card with just `rounded-lg` (or matching the card's own `rounded-xl`) and `overflow-hidden` on the parent, no extra shadow/border layered on top of the image's own.
- If the image has no border/frame of its own, it's fine to place it inside a standard card (shadow recipe, no border) same as any other content.
- When in doubt, check the image at full size first before deciding — don't assume either way.

## What to avoid (things we deliberately removed)

- ❌ `border border-outline-variant` on card containers
- ❌ `shadow-sm`/`shadow-md`/`hover:shadow-md` (Tailwind defaults) — use the custom soft-shadow recipe instead
- ❌ `rounded-2xl`/`rounded-3xl` on cards
- ❌ A different accent color per card/icon (colored icon-in-a-bubble treatment)
- ❌ Decorative blur blobs / gradient corner shapes on cards
- ❌ Full-width sidebar nav bars with a 4px colored border edge
