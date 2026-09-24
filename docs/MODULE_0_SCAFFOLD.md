# Module 0 — Foundation Scaffold

Complete step-by-step setup for Next.js 15 + Tailwind v4 + mock API transport.

---

## Step 1: Scaffold Next.js 15 App

```bash
cd /Users/mac/Documents/Tech-Marshall/sabyy

# Remove existing app folder if it exists
rm -rf app node_modules package-lock.json

# Create fresh Next.js 15 app with npm
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --use-npm \
  --no-git \
  --no-import-alias

# When prompted:
# - ESLint? → yes
# - Turbopack? → no (stick with webpack for now, less edge cases)
```

---

## Step 2: Install Dependencies

```bash
npm install

# Add the full stack (from package.json earlier)
npm install --save \
  @hookform/resolvers \
  @radix-ui/react-avatar \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-label \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slot \
  @radix-ui/react-switch \
  @radix-ui/react-tooltip \
  @tanstack/react-query \
  @tanstack/react-table \
  axios \
  class-variance-authority \
  clsx \
  date-fns \
  lodash-es \
  lucide-react \
  react-hook-form \
  react-hot-toast \
  recharts \
  tailwind-merge \
  zod

npm install --save-dev \
  @types/lodash-es \
  prettier
```

---

## Step 3: Wire Design Tokens

**Copy existing tokens file:**

```bash
cp design-system/tokens.css app/tokens.css
```

**Update `app/globals.css` to import tokens:**

```css
@import './tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  @apply border-border;
}

body {
  @apply bg-background text-foreground;
}

/* Define CSS custom properties for Tailwind theme mapping */
:root {
  --background: var(--color-bg);
  --foreground: var(--color-text-primary);
  --border: var(--color-border);
  --accent: var(--color-accent);
}
```

**Update `tailwind.config.ts` to use CSS variables:**

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        foreground: "var(--color-text-primary)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-light": "var(--color-accent-light)",
        "accent-soft": "var(--color-accent-soft)",
        success: "var(--color-success)",
        "success-bg": "var(--color-success-bg)",
        warning: "var(--color-warning)",
        "warning-bg": "var(--color-warning-bg)",
        danger: "var(--color-danger)",
        "danger-bg": "var(--color-danger-bg)",
        info: "var(--color-info)",
        "info-bg": "var(--color-info-bg)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        8: "var(--space-8)",
        10: "var(--space-10)",
        12: "var(--space-12)",
        16: "var(--space-16)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Step 4: Folder Structure

Create the directory tree:

```bash
mkdir -p \
  lib/api \
  lib/server \
  lib/mappers \
  lib/providers \
  lib/schemas \
  lib/data \
  lib/types \
  lib/utils \
  components/ui \
  components/layout \
  components/auth \
  components/storefront \
  components/dashboard \
  components/pos \
  contexts \
  hooks \
  app/api \
  app/\(auth\) \
  app/\(dashboard\) \
  app/\(storefront\) \
  app/\(pos\) \
  public/images
```

---

## Step 5: Build Mock Transport Layer

**`lib/api/types.ts` — API envelope and error types:**

```typescript
/**
 * Standard response envelope from backend.
 * Confirm actual shape with backend dev — this assumes a wrapper.
 */
export type ApiEnvelope<TPayload = unknown> = {
  status?: boolean;
  code?: number;
  message?: string;
  payload?: TPayload;
};

export type ApiListResponse<T> = {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};
```

**`lib/api/_transport.ts` — Client-side request helper (with mock support):**

```typescript
import type { ApiEnvelope, ApiError } from "@/lib/api/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

type RequestApiOptions = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  payload?: unknown;
};

function normalizeApiError(responseStatus: number, body: unknown): ApiError {
  const b = body as Record<string, unknown> | undefined;
  return {
    message: b?.message ?? "Request failed",
    status: responseStatus,
    code: String(b?.code ?? "ERR_REQUEST_FAILED"),
    details: body,
  };
}

/**
 * Client-side request helper. Routes through /app/api/* (BFF proxy).
 * On 401, dispatches auth:unauthorized for central session handling.
 */
export async function requestApi<TPayload = unknown>(
  options: RequestApiOptions,
): Promise<ApiEnvelope<TPayload>> {
  let body: string | undefined;
  if (options.payload !== undefined) {
    body = JSON.stringify(options.payload);
  }

  const response = await fetch(options.url, {
    method: options.method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body,
  });

  let raw: unknown = {};
  try {
    raw = await response.json();
  } catch {
    raw = { status: false, message: "Invalid response format" };
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw normalizeApiError(response.status, raw);
  }

  return (raw as ApiEnvelope<TPayload>) || { payload: raw as TPayload };
}

/**
 * Mock request helper — returns fake data for testing UI without backend.
 * Respects the same envelope shape.
 */
export async function requestApiMock<TPayload = unknown>(
  options: RequestApiOptions,
  mockData: TPayload,
): Promise<ApiEnvelope<TPayload>> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 300));
  return { status: true, code: 200, payload: mockData };
}

/**
 * Smart wrapper: uses mock data in dev, real API in production.
 * Flip NEXT_PUBLIC_USE_MOCK env var to control.
 */
export async function request<TPayload = unknown>(
  options: RequestApiOptions & { mock?: TPayload },
): Promise<ApiEnvelope<TPayload>> {
  if (USE_MOCK && options.mock) {
    return requestApiMock(options, options.mock);
  }
  return requestApi<TPayload>(options);
}
```

**`.env.local` — Enable mock mode during development:**

```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## Step 6: Core UI Components (shadcn/ui)

**Initialize shadcn/ui:**

```bash
npx shadcn-ui@latest init --typescript --tailwindcss

# When prompted:
# - Would you like to use TypeScript? → yes
# - Which style would you like to use? → default
# - Which color would you like as the base color? → purple (matches tokens)
# - Where is your global CSS file? → app/globals.css
# - Do you want to use CSS variables? → yes
```

**Add essential components:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
```

---

## Step 7: Example Component — Validate Tokens

**`components/ui/demo-card.tsx` — Test that tokens are wired:**

```tsx
export function DemoCard() {
  return (
    <div className="p-6 border border-border rounded-md bg-background">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Token Validation
      </h2>
      <p className="text-sm text-secondary mb-4">
        If you see purple accents, borders, and proper spacing, tokens are wired correctly.
      </p>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-accent text-white rounded-sm hover:bg-accent-hover">
          Primary Button
        </button>
        <button className="px-4 py-2 border border-border text-foreground rounded-sm hover:bg-surface">
          Secondary Button
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-success-bg text-success rounded-full">
          Success
        </span>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-warning-bg text-warning rounded-full">
          Warning
        </span>
        <span className="inline-block px-2 py-1 text-xs font-medium bg-danger-bg text-danger rounded-full">
          Danger
        </span>
      </div>
    </div>
  );
}
```

---

## Step 8: Root Layout + Providers

**`lib/providers/query-provider.tsx` — React Query setup:**

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**`app/layout.tsx` — Root layout:**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";

export const metadata: Metadata = {
  title: "Sabyy — Merchant Dashboard",
  description: "Commerce and operations platform for Nigerian SMEs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

**`app/page.tsx` — Home page (redirects or shows demo):**

```tsx
import { DemoCard } from "@/components/ui/demo-card";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Sabyy — Module 0 Foundation
        </h1>
        <DemoCard />
        <div className="mt-8 p-6 border border-border rounded-md bg-background">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>✅ Next.js 15 scaffolded</li>
            <li>✅ Tailwind v4 + tokens wired</li>
            <li>✅ Mock transport layer ready</li>
            <li>⏭️ Module 1: Auth + Shell</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
```

---

## Step 9: Start the Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000` — you should see:
- Purple accent colors from tokens.css
- Proper spacing and typography
- DemoCard with buttons and badges

**If you see the right colors and spacing → tokens are wired! ✅**

---

## Step 10: Quick Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts on port 3000
- [ ] Page loads at `http://localhost:3000`
- [ ] DemoCard shows **purple accents** (from `--color-accent`)
- [ ] Buttons and badges render with correct colors
- [ ] No Tailwind warnings in terminal

---

## What's Next (Module 1)

Once this scaffold is solid:
1. Build `lib/api/auth.api.ts` with mock login response
2. Create `contexts/auth-context.tsx` (holds user, role, tenant)
3. Build login page with form validation
4. Create `middleware.ts` for route protection
5. Build sidebar + top bar shell
6. Wire up Guard + FeatureGate components

**All using mock data.** When backend is ready, flip `NEXT_PUBLIC_USE_MOCK=false` and it hits the real API.

---

## Troubleshooting

**Tokens not showing (wrong colors)?**
- Check `app/tokens.css` was copied correctly
- Verify `tailwind.config.ts` references `var(--color-*)` 
- Restart dev server after changes

**"Module not found" errors?**
- Run `npm install` again
- Delete `node_modules` and `.next`, then `npm install` + `npm run dev`

**Tailwind classes not applying?**
- Check `tailwind.config.ts` has correct `content` paths
- Verify `globals.css` imports `@tailwind` directives

---

**Module 0 complete when:** Dev server runs, tokens render correctly, and one example component validates the setup. ✅
