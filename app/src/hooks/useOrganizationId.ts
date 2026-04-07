import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"

export function useOrganizationId(): string {
  const { user } = useAuth()
  const [orgId, setOrgId] = useState("")

  useEffect(() => {
    if (!user) return

    // Try user_metadata first, then fall back to users table lookup
    const metaOrgId = user.user_metadata?.organization_id as string | undefined
    if (metaOrgId) {
      setOrgId(metaOrgId)
      return
    }

    // Lookup from users table
    supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("[Org] Failed to load organization:", error)
          return
        }
        if (data?.organization_id) setOrgId(data.organization_id)
      })
  }, [user])

  return orgId
}
