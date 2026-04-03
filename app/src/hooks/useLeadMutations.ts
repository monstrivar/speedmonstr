import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { CallEventInsert, LeadStatus } from "@/types"

export function useUpdateLeadStatus(organizationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      leadId,
      status,
    }: {
      leadId: string
      status: LeadStatus
    }) => {
      const { error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", leadId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", organizationId] })
    },
  })
}

export function useCallEventMutation() {
  return useMutation({
    mutationFn: async (event: CallEventInsert) => {
      const { error } = await supabase.from("call_events").insert(event)
      if (error) throw error
    },
  })
}
