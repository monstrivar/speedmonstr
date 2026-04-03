export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          plan: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          organization_id: string
          name: string
          email: string
          role: "admin" | "salgssjef" | "teammedlem"
          department_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          organization_id: string
          name: string
          email: string
          role: "admin" | "salgssjef" | "teammedlem"
          department_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          email?: string
          role?: "admin" | "salgssjef" | "teammedlem"
          department_id?: string | null
          created_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          organization_id: string
          name: string
          keywords: string[]
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          keywords?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          keywords?: string[]
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          organization_id: string
          department_id: string | null
          first_name: string
          last_name: string | null
          email: string | null
          phone: string | null
          company: string | null
          description: string | null
          source: string
          status: "ny" | "sms_sendt" | "venter" | "fulgt_opp" | "booket" | "ikke_relevant"
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          department_id?: string | null
          first_name: string
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          description?: string | null
          source?: string
          status?: "ny" | "sms_sendt" | "venter" | "fulgt_opp" | "booket" | "ikke_relevant"
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          department_id?: string | null
          first_name?: string
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          description?: string | null
          source?: string
          status?: "ny" | "sms_sendt" | "venter" | "fulgt_opp" | "booket" | "ikke_relevant"
          created_at?: string
        }
      }
      push_tokens: {
        Row: {
          id: string
          user_id: string
          token: string
          platform: "ios" | "android" | "web"
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token: string
          platform: "ios" | "android" | "web"
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          token?: string
          platform?: "ios" | "android" | "web"
          updated_at?: string
        }
      }
      call_events: {
        Row: {
          id: string
          lead_id: string
          user_id: string
          initiated_at: string
          returned_at: string | null
          outcome: "answered" | "no_answer" | "voicemail" | "cancelled" | null
          duration_sec: number | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          user_id: string
          initiated_at?: string
          returned_at?: string | null
          outcome?: "answered" | "no_answer" | "voicemail" | "cancelled" | null
          duration_sec?: number | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          user_id?: string
          initiated_at?: string
          returned_at?: string | null
          outcome?: "answered" | "no_answer" | "voicemail" | "cancelled" | null
          duration_sec?: number | null
          note?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
