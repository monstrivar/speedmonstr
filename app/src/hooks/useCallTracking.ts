import { useState, useRef } from "react"
import type { CallOutcome } from "@/types"
import { useAppResume } from "./useAppResume"
import { useCallEventMutation } from "./useLeadMutations"

interface UseCallTrackingProps {
  leadId: string
  userId: string
}

interface PendingCall {
  initiatedAt: string
}

export function useCallTracking({ leadId, userId }: UseCallTrackingProps) {
  const [pendingCall, setPendingCall] = useState<PendingCall | null>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)

  // Ref keeps the latest pendingCall accessible inside the appStateChange
  // listener without re-registering the listener on every state change.
  const pendingCallRef = useRef(pendingCall)
  pendingCallRef.current = pendingCall

  const { mutate: logCallEvent } = useCallEventMutation()

  function handleCallPress() {
    const initiatedAt = new Date().toISOString()
    // Fire-and-forget — the tel: link on the anchor element handles the actual call
    logCallEvent({ lead_id: leadId, user_id: userId, initiated_at: initiatedAt })
    setPendingCall({ initiatedAt })
  }

  useAppResume(() => {
    // Use ref to avoid stale closure — pendingCall state would be captured at
    // registration time and never update inside this callback.
    if (pendingCallRef.current) {
      setShowFollowUp(true)
    }
  })

  function handleFollowUpOutcome(outcome: CallOutcome | "cancelled", note?: string) {
    if (!pendingCall) return

    const returnedAt = new Date().toISOString()
    const durationSec = Math.round(
      (new Date(returnedAt).getTime() - new Date(pendingCall.initiatedAt).getTime()) / 1000
    )

    logCallEvent({
      lead_id: leadId,
      user_id: userId,
      initiated_at: pendingCall.initiatedAt,
      returned_at: returnedAt,
      outcome: outcome === "cancelled" ? null : outcome,
      duration_sec: durationSec,
      ...(note ? { note } : {}),
    })

    setPendingCall(null)
    setShowFollowUp(false)
  }

  return { handleCallPress, showFollowUp, handleFollowUpOutcome }
}
