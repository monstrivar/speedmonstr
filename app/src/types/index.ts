import type { Database } from "@/types/supabase"

export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type AppUser = Database["public"]["Tables"]["users"]["Row"]
export type Department = Database["public"]["Tables"]["departments"]["Row"]
export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type PushToken = Database["public"]["Tables"]["push_tokens"]["Row"]

export type LeadStatus = Lead["status"]
export type UserRole = AppUser["role"]
export type Platform = PushToken["platform"]

export type CallEvent = Database["public"]["Tables"]["call_events"]["Row"]
export type CallEventInsert = Database["public"]["Tables"]["call_events"]["Insert"]
export type CallOutcome = NonNullable<CallEvent["outcome"]>
