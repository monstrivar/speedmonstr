import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

export function useResponseTime(organizationId: string) {
  return useQuery({
    queryKey: ["response-time", organizationId],
    queryFn: async () => {
      // Fetch call_events joined with leads for this org, last 30 days
      const { data, error } = await supabase
        .from("call_events")
        .select("initiated_at, leads!inner(created_at, organization_id)")
        .eq("leads.organization_id", organizationId)
        .gte("initiated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .limit(200)

      if (error) throw error
      if (!data || data.length === 0) return null

      // Average minutes from lead created_at to first call initiated_at
      const minutes = data
        .map((row) => {
          const lead = row.leads as unknown as { created_at: string }
          return (
            (new Date(row.initiated_at).getTime() - new Date(lead.created_at).getTime()) /
            1000 /
            60
          )
        })
        .filter((m) => m >= 0)

      if (minutes.length === 0) return null
      return (minutes.reduce((a, b) => a + b, 0) / minutes.length).toFixed(1)
    },
    enabled: Boolean(organizationId),
    staleTime: 5 * 60 * 1000, // 5 min — stat doesn't need to be live
  })
}
