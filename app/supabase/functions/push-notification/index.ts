/**
 * Supabase Edge Function: push-notification
 *
 * Receives a Supabase database webhook (INSERT on leads table) and sends
 * an APNs push notification to all registered iOS devices for the lead's
 * organization.
 *
 * Required environment variables (set in Supabase dashboard → Settings → Edge Functions):
 *   SUPABASE_URL              - Supabase project URL (auto-injected by Supabase)
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (auto-injected by Supabase)
 *   APNS_TEAM_ID              - Apple Developer Team ID (10-char alphanumeric)
 *   APNS_KEY_ID               - APNs Auth Key ID (.p8 file name prefix, e.g. "ABCDE12345")
 *   APNS_PRIVATE_KEY          - Full contents of the .p8 file (including BEGIN/END lines)
 *   APNS_ENVIRONMENT          - "sandbox" for development, "production" for live (default: "sandbox")
 *
 * Supabase webhook setup:
 *   Database → Webhooks → Create new webhook
 *   Table: leads, Event: INSERT, URL: https://<project>.supabase.co/functions/v1/push-notification
 */

import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// ---------------------------------------------------------------------------
// APNs JWT signing using Web Crypto (Deno-compatible)
// Web Crypto's ECDSA returns IEEE P1363 format (raw r||s, 64 bytes) — NOT DER.
// No DER-to-raw conversion needed here (unlike Node.js crypto).
// ---------------------------------------------------------------------------

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const uint8 =
    bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let binary = ""
  for (const byte of uint8) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

async function createApnsJwt(
  teamId: string,
  keyId: string,
  privateKeyPem: string
): Promise<string> {
  const header = base64url(
    new TextEncoder().encode(
      JSON.stringify({ alg: "ES256", kid: keyId })
    )
  )

  const payload = base64url(
    new TextEncoder().encode(
      JSON.stringify({ iss: teamId, iat: Math.floor(Date.now() / 1000) })
    )
  )

  const signingInput = `${header}.${payload}`

  // Strip PEM armor and decode base64 to binary DER (pkcs8 format)
  const pemBody = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/-----BEGIN EC PRIVATE KEY-----/g, "")
    .replace(/-----END EC PRIVATE KEY-----/g, "")
    .replace(/\s/g, "")

  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  )

  const signatureBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    new TextEncoder().encode(signingInput)
  )

  // Verify: IEEE P1363 signature must be exactly 64 bytes (32 bytes r + 32 bytes s)
  if (signatureBuffer.byteLength !== 64) {
    throw new Error(
      `[APNs JWT] Unexpected signature length: ${signatureBuffer.byteLength} bytes (expected 64)`
    )
  }

  const signature = base64url(signatureBuffer)

  return `${signingInput}.${signature}`
}

// ---------------------------------------------------------------------------
// Serve handler
// ---------------------------------------------------------------------------

serve(async (req: Request): Promise<Response> => {
  try {
    // Only accept POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Parse Supabase webhook payload
    const body = await req.json() as {
      type: string
      table: string
      schema: string
      record: Record<string, unknown>
      old_record: Record<string, unknown> | null
    }

    // Only process INSERT events on the leads table
    if (body.type !== "INSERT" || body.table !== "leads") {
      console.log(`[Push] Skipping event: type=${body.type} table=${body.table}`)
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    const lead = body.record
    const organizationId = lead.organization_id as string | undefined

    if (!organizationId) {
      console.warn("[Push] Lead has no organization_id, skipping")
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Build Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Step 1: Get user IDs for this organization
    const { data: orgUsers, error: usersError } = await supabase
      .from("users")
      .select("id")
      .eq("organization_id", organizationId)

    if (usersError) {
      console.error("[Push] Failed to fetch org users:", usersError)
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!orgUsers || orgUsers.length === 0) {
      console.log("[Push] No users found for organization, skipping")
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    const userIds = orgUsers.map((u: { id: string }) => u.id)

    // Step 2: Get push tokens for these users
    const { data: pushTokens, error: tokensError } = await supabase
      .from("push_tokens")
      .select("token")
      .in("user_id", userIds)
      .eq("platform", "ios")

    if (tokensError) {
      console.error("[Push] Failed to fetch push tokens:", tokensError)
      return new Response(JSON.stringify({ error: "Failed to fetch tokens" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    if (!pushTokens || pushTokens.length === 0) {
      console.log("[Push] No push tokens registered for organization")
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Build APNs JWT
    const teamId = Deno.env.get("APNS_TEAM_ID") ?? ""
    const keyId = Deno.env.get("APNS_KEY_ID") ?? ""
    const privateKey = Deno.env.get("APNS_PRIVATE_KEY") ?? ""

    if (!teamId || !keyId || !privateKey) {
      console.error("[Push] Missing APNs environment variables")
      return new Response(
        JSON.stringify({ error: "APNs not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const apnsJwt = await createApnsJwt(teamId, keyId, privateKey)

    // Determine APNs host
    const apnsEnv = Deno.env.get("APNS_ENVIRONMENT") ?? "sandbox"
    const apnsHost =
      apnsEnv === "production"
        ? "https://api.push.apple.com"
        : "https://api.sandbox.push.apple.com"

    // Build notification body
    const leadName = (lead.name as string) ?? "New lead"
    const leadDescription = (lead.description as string) ?? ""
    const leadPhone = (lead.phone as string) ?? ""
    const leadId = (lead.id as string) ?? ""

    const alertTitle = "Ny potensiell kunde"
    const alertBody = leadDescription
      ? `${leadName} — ${leadDescription}`
      : leadName

    const notificationPayload = {
      aps: {
        alert: {
          title: alertTitle,
          body: alertBody,
        },
        sound: "default",
        badge: 1,
        category: "NEW_LEAD",
      },
      lead_id: leadId,
      phone: leadPhone,
    }

    // Send to each registered device
    let sentCount = 0
    const results: { token: string; status: number; ok: boolean }[] = []

    for (const { token } of pushTokens as { token: string }[]) {
      const response = await fetch(`${apnsHost}/3/device/${token}`, {
        method: "POST",
        headers: {
          authorization: `bearer ${apnsJwt}`,
          "apns-topic": "no.monstr.app",
          "apns-push-type": "alert",
          "apns-priority": "10",
          "content-type": "application/json",
        },
        body: JSON.stringify(notificationPayload),
      })

      if (response.ok) {
        sentCount++
        console.log(`[Push] Sent to ${token.slice(0, 8)}...`)
      } else {
        const errorBody = await response.text()
        console.error(
          `[Push] Failed to send to ${token.slice(0, 8)}...: ${response.status} ${errorBody}`
        )
      }

      results.push({ token: token.slice(0, 8) + "...", status: response.status, ok: response.ok })
    }

    console.log(`[Push] Done. Sent: ${sentCount}/${pushTokens.length}`)

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, total: pushTokens.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("[Push] Unhandled error:", err)
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})
