import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Lead } from "@/types"

export function useLeads(organizationId: string) {
  const queryClient = useQueryClient()

  const query = useQuery<Lead[]>({
    queryKey: ["leads", organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .limit(50)
      if (error) throw error
      return data ?? []
    },
    enabled: Boolean(organizationId),
  })

  useEffect(() => {
    if (!organizationId) return

    const channel = supabase
      .channel(`leads-realtime-${organizationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
          filter: `organization_id=eq.${organizationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["leads", organizationId] })
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[Realtime] Channel error, will attempt reconnect")
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId, queryClient])

  return query
}
