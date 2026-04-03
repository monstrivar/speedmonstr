# Phase 01: Foundation + Push Notifications - Research

**Researched:** 2026-04-03
**Domain:** React app scaffolding, Supabase backend, Capacitor iOS, APNs push notifications
**Confidence:** HIGH (core stack verified via official docs), MEDIUM (APNs from Edge Functions)

## Summary

Phase 01 sets up the companion app at `app/` inside the existing `speedmonstr` repo. The core stack is React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + shadcn/ui, with Supabase for auth/database/realtime, Capacitor for iOS native wrapping, and APNs for push notifications triggered by Supabase Edge Functions.

The standard approach is: (1) scaffold app/ as a separate Vite project with its own package.json, (2) set up Supabase schema with RLS, (3) integrate Capacitor pointing webDir at app/dist, (4) use `@capacitor/push-notifications` plugin for native APNs token registration, (5) send push from a Supabase Edge Function that calls APNs HTTP/2 API directly using JWT auth.

The main technical risk is the APNs-direct-from-Edge-Function approach: Deno's `fetch` supports HTTP/2 via ALPN negotiation, so calling `api.push.apple.com` works, but JWT signing with ES256 requires careful implementation. The `apns2` npm package does NOT run in Deno. We must hand-roll the APNs call using Web Crypto API for JWT signing.

**Primary recommendation:** Build the APNs integration as a self-contained Supabase Edge Function using raw `fetch` + Web Crypto for JWT, triggered by a database webhook on the `leads` table INSERT event.

## User Constraints (from STATE.md / phase context)

### Locked Decisions
- React 19 + TypeScript + Vite for the app
- Tailwind CSS v4 for styling
- shadcn/ui for UI components
- Supabase (new project) for auth + database + realtime + edge functions
- Capacitor for iOS native wrapper
- APNs (Apple Push Notification Service) directly -- no Firebase
- react-i18next for internationalization
- TanStack Query for server state
- App lives in app/ subdirectory of existing repo
- Apple Developer Account is active
- TypeScript strict mode
- Named exports only
- No global state manager
- Vitest for testing

### Claude's Discretion
- Exact Vite config for monorepo-light setup (two Vite builds in one repo)
- Supabase Edge Function vs database webhook for triggering push
- How to structure Capacitor project within app/
- Service worker strategy
- Exact APNs integration approach from Supabase Edge Functions
- shadcn/ui component selection for MVP dashboard

### Deferred Ideas (OUT OF SCOPE)
- Android / Google Play
- Call tracking
- SMS log
- Escalation system
- Analytics
- Admin/settings pages
- Custom notification sounds

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^19.2.x | UI framework | Already in root package.json |
| react-dom | ^19.2.x | React DOM renderer | Paired with React |
| typescript | ^5.x | Type safety | Strict mode, generated Supabase types |
| vite | ^8.x | Build tool | Already used by landing page |
| @vitejs/plugin-react | ^6.x | React Fast Refresh for Vite | Standard Vite + React pairing |
| tailwindcss | ^4.x | Utility-first CSS | v4 uses @tailwindcss/vite plugin, CSS-first config |
| @tailwindcss/vite | latest | Tailwind v4 Vite integration | Replaces PostCSS plugin from v3 |
| @supabase/supabase-js | ^2.x | Supabase client | Auth, realtime, queries |
| @tanstack/react-query | ^5.x | Server state management | Caching, background refetch, mutation |
| react-i18next | latest | i18n for React | Hooks-based, TypeScript support |
| i18next | latest | i18n core | Required by react-i18next |
| react-router-dom | ^7.x | Client-side routing | Already in root, standard for SPAs |
| @capacitor/core | latest | Capacitor runtime | Required for native features |
| @capacitor/cli | latest | Capacitor CLI | Build tooling |
| @capacitor/push-notifications | latest | Native push | APNs token registration, notification handling |
| @capacitor/app | latest | App lifecycle | Detect resume after phone call |
| @capacitor/haptics | latest | Vibration feedback | Tactile response on actions |
| @capacitor/splash-screen | latest | Splash screen | Branding on app launch |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @capacitor/badge | latest | Badge count on app icon | Show unread lead count |
| i18next-browser-languagedetector | latest | Auto-detect language | Web fallback, not needed in Capacitor |
| lucide-react | ^1.x | Icons | Already in root, consistent icon set |
| @types/node | latest | Node types for Vite config | path.resolve in vite.config.ts |
| vitest | latest | Testing | Unit tests for business logic |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct APNs from Edge Function | Firebase Cloud Messaging | FCM adds dependency, but is simpler. APNs direct is decided. |
| Database webhook trigger | Supabase Realtime trigger in Edge Function | DB webhook is simpler, fires on INSERT automatically |
| Manual APNs JWT | `apns2` npm package | apns2 uses Node HTTP/2 module, won't work in Deno Edge Functions |

**Installation (app/ directory):**
```bash
# Core app deps
npm install react react-dom @supabase/supabase-js @tanstack/react-query react-router-dom react-i18next i18next i18next-browser-languagedetector lucide-react

# Dev deps
npm install -D typescript @types/react @types/react-dom @types/node vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest

# Capacitor
npm install @capacitor/core @capacitor/push-notifications @capacitor/app @capacitor/haptics @capacitor/splash-screen @capacitor/badge
npm install -D @capacitor/cli

# Initialize Capacitor
npx cap init "Monstr" "no.monstr.app" --web-dir dist
npx cap add ios
```

**shadcn/ui (run from app/):**
```bash
npx shadcn@latest init
# Then add components as needed:
npx shadcn@latest add button card badge sheet separator scroll-area
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── capacitor.config.ts       # Capacitor config (webDir: "dist")
├── package.json              # Separate from root
├── tsconfig.json             # Strict mode, path aliases
├── tsconfig.app.json         # App-specific TS config
├── vite.config.ts            # Port 5174, path aliases, Tailwind v4
├── index.html                # App entry point
├── ios/                      # Capacitor iOS project (gitignored selectively)
│   └── App/                  # Xcode project
├── src/
│   ├── main.tsx              # React root + i18n init + QueryClientProvider
│   ├── App.tsx               # Router setup
│   ├── index.css             # @import "tailwindcss" + shadcn theme vars
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (auto-generated)
│   │   ├── Layout.tsx        # Sidebar (desktop) / bottom tabs (mobile)
│   │   ├── LeadCard.tsx      # Lead in the feed
│   │   └── StatCard.tsx      # Key metric card
│   ├── pages/
│   │   ├── LoginPage.tsx     # Magic link auth
│   │   └── DashboardPage.tsx # Overview + realtime lead feed
│   ├── hooks/
│   │   ├── useAuth.ts        # Supabase auth state
│   │   ├── useLeads.ts       # TanStack Query + Supabase Realtime
│   │   └── usePushNotifications.ts  # Capacitor push registration
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client init
│   │   ├── i18n.ts           # i18next configuration
│   │   └── query-client.ts   # TanStack Query client
│   ├── locales/
│   │   ├── no.json           # Norwegian (default)
│   │   └── en.json           # English (skeleton)
│   └── types/
│       ├── supabase.ts       # Generated types (supabase gen types)
│       └── index.ts          # App-specific types
└── supabase/
    └── functions/
        └── push-notification/
            └── index.ts       # Edge Function: APNs sender
```

### Pattern 1: Vite Config for Monorepo-Light (Two Builds)
**What:** Separate Vite projects in root and app/ with independent package.json files.
**When to use:** Always -- this is the project structure.
```typescript
// app/vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,  // Different from landing page's 5173
  },
})
```

### Pattern 2: Vercel Routing for Subdomain
**What:** Route app.monstr.no to app/ build, monstr.no to root build.
**When to use:** Production deployment.
```json
// vercel.json (root)
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    {
      "source": "/(.*)",
      "destination": "/app/dist/index.html",
      "has": [{ "type": "host", "value": "app.monstr.no" }]
    },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build && cd app && npm run build",
  "outputDirectory": "dist"
}
```
**Note:** This needs validation. Vercel may require two separate projects for subdomain routing. An alternative is using Vercel's `builds` config or separate deployments. The simplest proven approach is two Vercel projects pointing to the same repo with different root directories.

### Pattern 3: Supabase Realtime + TanStack Query
**What:** Combine Supabase Realtime subscriptions with TanStack Query for cache invalidation.
**When to use:** Lead feed that updates in realtime.
```typescript
// hooks/useLeads.ts
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"

export function useLeads(organizationId: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["leads", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(50)
      if (error) throw error
      return data
    },
  })

  useEffect(() => {
    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["leads", organizationId] })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [organizationId, queryClient])

  return query
}
```

### Pattern 4: Capacitor Push Registration
**What:** Register for push notifications on app startup, store token in Supabase.
**When to use:** After user authenticates.
```typescript
// hooks/usePushNotifications.ts
import { PushNotifications } from "@capacitor/push-notifications"
import { Capacitor } from "@capacitor/core"
import { supabase } from "@/lib/supabase"

export function usePushNotifications(userId: string | null) {
  useEffect(() => {
    if (!userId || !Capacitor.isNativePlatform()) return

    const register = async () => {
      const permission = await PushNotifications.requestPermissions()
      if (permission.receive !== "granted") return

      await PushNotifications.register()
    }

    PushNotifications.addListener("registration", async (token) => {
      // Store APNs token in Supabase
      await supabase.from("push_tokens").upsert({
        user_id: userId,
        token: token.value,
        platform: "ios",
        updated_at: new Date().toISOString(),
      })
    })

    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      // Handle "Call" action button tap
      if (notification.actionId === "call") {
        const phone = notification.notification.data?.phone
        if (phone) window.open(`tel:${phone}`)
      }
    })

    register()

    return () => { PushNotifications.removeAllListeners() }
  }, [userId])
}
```

### Pattern 5: APNs from Supabase Edge Function
**What:** Send push notification directly to APNs using HTTP/2 and JWT auth.
**When to use:** Triggered by database webhook on leads INSERT.
```typescript
// supabase/functions/push-notification/index.ts
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// APNs JWT generation using Web Crypto API
async function createApnsJwt(
  teamId: string,
  keyId: string,
  privateKeyPem: string
): Promise<string> {
  const header = btoa(JSON.stringify({ alg: "ES256", kid: keyId }))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  const now = Math.floor(Date.now() / 1000)
  const payload = btoa(JSON.stringify({ iss: teamId, iat: now }))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  // Import private key
  const pemContents = privateKeyPem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "")
  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    "pkcs8", binaryKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false, ["sign"]
  )

  const data = new TextEncoder().encode(`${header}.${payload}`)
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" }, key, data
  )
  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")

  return `${header}.${payload}.${sig}`
}

serve(async (req) => {
  const { record } = await req.json() // Database webhook payload

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  // Get push tokens for users in this organization
  const { data: tokens } = await supabase
    .from("push_tokens")
    .select("token, user_id")
    .eq("platform", "ios")
    // Filter by organization via join

  const jwt = await createApnsJwt(
    Deno.env.get("APNS_TEAM_ID")!,
    Deno.env.get("APNS_KEY_ID")!,
    Deno.env.get("APNS_PRIVATE_KEY")!
  )

  const apnsHost = "https://api.push.apple.com" // Production
  // Use "https://api.sandbox.push.apple.com" for development

  for (const { token } of tokens ?? []) {
    await fetch(`${apnsHost}/3/device/${token}`, {
      method: "POST",
      headers: {
        "authorization": `bearer ${jwt}`,
        "apns-topic": "no.monstr.app",
        "apns-push-type": "alert",
        "apns-priority": "10",
      },
      body: JSON.stringify({
        aps: {
          alert: {
            title: `Ny henvendelse: ${record.first_name} ${record.last_name}`,
            body: record.description?.substring(0, 60) || "Ny lead mottatt",
          },
          sound: "default",
          badge: 1,
          "category": "NEW_LEAD",
        },
        lead_id: record.id,
        phone: record.phone,
      }),
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

### Anti-Patterns to Avoid
- **Using Firebase for iOS-only push:** Adds unnecessary complexity. APNs direct works and is decided.
- **Polling instead of Supabase Realtime:** Use channel subscriptions to invalidate TanStack Query cache.
- **Storing push tokens in localStorage:** Always store in Supabase for server-side push sending.
- **Single package.json for root + app:** Keep them separate. Landing page uses JSX/Tailwind v3, app uses TS/Tailwind v4.
- **Using `default export`:** Project convention is named exports only.
- **Hardcoding Norwegian strings:** All UI text must go through `t()` from day 1.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| UI components (buttons, cards, sheets) | Custom from scratch | shadcn/ui + Radix primitives | Accessible, keyboard nav, mobile-friendly |
| Form validation | Manual validation logic | React Hook Form + Zod (if needed) | Consistent patterns, TS integration |
| Auth session management | Custom token handling | Supabase Auth `onAuthStateChange` | Handles refresh tokens, magic link flow |
| Realtime data sync | WebSocket + custom logic | Supabase Realtime + TanStack Query | Built-in reconnection, typed channels |
| i18n string management | String constants file | react-i18next with JSON files | Pluralization, interpolation, language detection |
| iOS push token handling | Manual APNs registration | @capacitor/push-notifications plugin | Handles permission flow, token refresh |
| Date/number formatting | Custom formatters | `Intl` API with locale | Native browser API, respects Norwegian locale |

**Key insight:** The biggest risk is over-engineering Phase 01. This phase is about getting a notification to fire on an iPhone. Keep the dashboard minimal -- a login page and a list of leads that updates in realtime. Everything else is Phase 02+.

## Common Pitfalls

### Pitfall 1: Tailwind v4 vs v3 Configuration Confusion
**What goes wrong:** Using `tailwind.config.js` (v3 pattern) instead of CSS-based config (v4 pattern).
**Why it happens:** v4 is a major shift. Most tutorials still show v3.
**How to avoid:** Use `@tailwindcss/vite` plugin. Config goes in `src/index.css` with `@import "tailwindcss"`. No `tailwind.config.js` file. shadcn/ui's `init` command handles this correctly.
**Warning signs:** PostCSS config files, `tailwind.config.ts`, `@apply` not resolving.

### Pitfall 2: APNs Sandbox vs Production Endpoint
**What goes wrong:** Push works in development, fails in production (or vice versa).
**Why it happens:** APNs has separate endpoints: `api.sandbox.push.apple.com` for dev builds, `api.push.apple.com` for production/TestFlight.
**How to avoid:** Use environment variable for APNs host. Capacitor dev builds use sandbox, archive builds use production. The push token format differs between sandbox and production.
**Warning signs:** 400 errors from APNs, `BadDeviceToken` response.

### Pitfall 3: Capacitor webDir Misconfiguration
**What goes wrong:** `npx cap sync` fails or iOS app shows blank screen.
**Why it happens:** `webDir` in `capacitor.config.ts` must point to the Vite build output (e.g., `dist`), and this path is relative to where `capacitor.config.ts` lives.
**How to avoid:** Set `webDir: "dist"` in `app/capacitor.config.ts`. Always run `npm run build` before `npx cap sync`.
**Warning signs:** "Web directory not found" error, blank white screen in simulator.

### Pitfall 4: Supabase RLS Blocking Realtime Subscriptions
**What goes wrong:** Realtime channel connects but receives no events.
**Why it happens:** RLS policies must be configured to allow the authenticated user to SELECT from the table. Realtime respects RLS.
**How to avoid:** Set up RLS policies before testing realtime. Test with Supabase dashboard's SQL editor.
**Warning signs:** Channel status is "joined" but no events fire.

### Pitfall 5: Missing Push Notification Entitlement in Xcode
**What goes wrong:** `PushNotifications.register()` fails silently or returns error.
**Why it happens:** Push Notifications capability not added in Xcode, or provisioning profile doesn't include push.
**How to avoid:** In Xcode: Target > Signing & Capabilities > + Capability > Push Notifications. Also add Background Modes > Remote notifications.
**Warning signs:** `registrationError` event fires, no token received.

### Pitfall 6: React 19 + shadcn/ui Peer Dependency Issues
**What goes wrong:** npm install fails with peer dependency conflicts.
**Why it happens:** Some shadcn/ui dependencies haven't updated peer deps for React 19.
**How to avoid:** Use `--legacy-peer-deps` flag if needed, or use pnpm which handles this better.
**Warning signs:** `ERESOLVE unable to resolve dependency tree` errors.

### Pitfall 7: ECDSA Signature Format for APNs JWT
**What goes wrong:** APNs returns 403 `InvalidProviderToken`.
**Why it happens:** Web Crypto API returns ECDSA signature in DER format, but APNs expects raw r||s format (64 bytes). Also, base64url encoding must be used, not standard base64.
**How to avoid:** After `crypto.subtle.sign`, convert DER to raw format. Use proper base64url encoding (replace +/ with -_, strip =).
**Warning signs:** 403 responses from APNs with "InvalidProviderToken" reason.

### Pitfall 8: Supabase Edge Function JWT Authorization
**What goes wrong:** Database webhook calls to Edge Function return 401.
**Why it happens:** Edge Functions require JWT auth by default. Database webhooks must include the service role key.
**How to avoid:** When creating the database webhook in Supabase dashboard, add Authorization header with service role key. The dashboard UI has an option for this.
**Warning signs:** 401 Unauthorized from Edge Function invocation.

## Code Examples

### Supabase Client Init
```typescript
// app/src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### i18n Setup
```typescript
// app/src/lib/i18n.ts
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import no from "@/locales/no.json"
import en from "@/locales/en.json"

i18n.use(initReactI18next).init({
  resources: {
    no: { translation: no },
    en: { translation: en },
  },
  lng: "no",
  fallbackLng: "no",
  interpolation: { escapeValue: false },
})

export { i18n }
```

### Magic Link Auth
```typescript
// app/src/hooks/useAuth.ts
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { setUser(session?.user ?? null) }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string) => {
    return supabase.auth.signInWithOtp({ email })
  }

  const signOut = async () => {
    return supabase.auth.signOut()
  }

  return { user, loading, signIn, signOut }
}
```

### Minimal Database Schema (Phase 01 only)
```sql
-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'vekst',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'salgssjef', 'teammedlem')),
  department_id uuid REFERENCES departments(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Departments
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  keywords text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Leads
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  department_id uuid REFERENCES departments(id),
  first_name text NOT NULL,
  last_name text,
  email text,
  phone text,
  company text,
  description text,
  source text NOT NULL DEFAULT 'webhook',
  status text NOT NULL DEFAULT 'ny'
    CHECK (status IN ('ny', 'sms_sendt', 'venter', 'fulgt_opp', 'booket', 'ikke_relevant')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Push tokens (for APNs)
CREATE TABLE push_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Users can read their own organization
CREATE POLICY "Users read own org" ON organizations
  FOR SELECT USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users can read users in their org
CREATE POLICY "Users read own org users" ON users
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users can read leads in their org
CREATE POLICY "Users read own org leads" ON leads
  FOR SELECT USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users can manage their own push tokens
CREATE POLICY "Users manage own push tokens" ON push_tokens
  FOR ALL USING (user_id = auth.uid());
```

### Capacitor Config
```typescript
// app/capacitor.config.ts
import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "no.monstr.app",
  appName: "Monstr",
  webDir: "dist",
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#111111",
    },
  },
}

export default config
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 (JS config) | Tailwind v4 (CSS-first, @tailwindcss/vite) | Late 2024 | No tailwind.config.js, use @import "tailwindcss" in CSS |
| shadcn init (manual) | `npx shadcn@latest init` (streamlined) | 2025 | Handles Tailwind v4 setup automatically |
| APNs certificate auth | APNs JWT token auth (p8 key) | 2016+ but now standard | No cert renewal, simpler key management |
| Capacitor 5 | Capacitor 6+ | 2024 | @capacitor/push-notifications v6+ API |
| Supabase Functions v1 | Supabase Edge Functions (Deno) | 2023+ | Deno runtime, esm.sh imports |

## Open Questions

1. **Vercel subdomain routing with two Vite builds**
   - What we know: vercel.json rewrites can match on host header. Two separate build commands needed.
   - What's unclear: Whether a single Vercel project can serve two different SPA builds to two subdomains, or if two Vercel projects (same repo, different root dirs) is needed.
   - Recommendation: Start with two Vercel projects pointing to same repo. Root dir = `/` for landing, root dir = `/app` for companion. This is the proven pattern.

2. **ECDSA DER-to-raw conversion in Web Crypto**
   - What we know: Web Crypto sign() returns DER-encoded signature. APNs expects raw r||s (64 bytes).
   - What's unclear: Exact byte offsets for DER parsing vary. Need to test.
   - Recommendation: Implement a DER-to-raw conversion helper, test with APNs sandbox first. If problematic, consider using a Deno-compatible JWT library from deno.land/x.

3. **iOS notification action buttons ("Call" + "See Details")**
   - What we know: @capacitor/push-notifications supports `actionId` in `pushNotificationActionPerformed`. APNs supports `category` with actions.
   - What's unclear: Whether Capacitor plugin exposes iOS notification category registration, or if Swift code is needed in AppDelegate.
   - Recommendation: Start with default tap behavior (opens app). Add action buttons as enhancement if time allows. May require native Swift code in `ios/App/AppDelegate.swift`.

4. **Database webhook vs pg_notify for push trigger**
   - What we know: Database webhooks use pg_net extension (async HTTP calls). Could also use pg_notify + Edge Function listener.
   - What's unclear: Latency difference between approaches.
   - Recommendation: Use database webhook (simpler setup via Supabase dashboard). Latency is sub-second for both.

## Sources

### Primary (HIGH confidence)
- [Capacitor Push Notifications API](https://capacitorjs.com/docs/apis/push-notifications) - Plugin API, iOS setup, event handling
- [Capacitor Configuration](https://capacitorjs.com/docs/config) - capacitor.config.ts, webDir
- [shadcn/ui Vite installation](https://ui.shadcn.com/docs/installation/vite) - Complete setup guide with Tailwind v4
- [Supabase Database Webhooks](https://supabase.com/docs/guides/database/webhooks) - Trigger Edge Functions on INSERT
- [Supabase Push Notifications guide](https://supabase.com/docs/guides/functions/examples/push-notifications) - Edge Function examples

### Secondary (MEDIUM confidence)
- [Deno HTTP/2 support](https://medium.com/deno-the-complete-reference/http-2-in-deno-f825251a5ab2) - fetch() supports HTTP/2 via ALPN
- [apns2 npm package](https://www.npmjs.com/package/apns2) - Reference implementation (Node-only, not Deno)
- [APNs JWT auth](https://gobiko.com/blog/token-based-authentication-http2-example-apns/) - JWT token format and signing
- [Capacitor monorepo setup](https://jsmobiledev.com/article/capacitor-monorepo/) - Subdirectory project structure
- [react-i18next TypeScript](https://www.i18next.com/overview/typescript) - Type-safe translations

### Tertiary (LOW confidence)
- [APNs from Supabase Edge Functions](https://www.answeroverflow.com/m/1124645358191005816) - Community discussion, some reported issues with p8 key parsing
- Vercel subdomain routing for monorepo - Multiple community discussions, no single authoritative guide

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs, versions confirmed
- Architecture (app structure): HIGH - Standard Vite + Capacitor patterns, well-documented
- Architecture (Vercel routing): MEDIUM - Subdomain multi-build approach needs validation
- Push notifications (Capacitor side): HIGH - Official plugin with clear API
- Push notifications (APNs from Edge Function): MEDIUM - Deno HTTP/2 works, but JWT signing with Web Crypto needs testing
- Pitfalls: HIGH - Based on official docs and known iOS development patterns

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (30 days -- stable stack, all libraries mature)
