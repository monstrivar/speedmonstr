import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/useAuth"
import { useLeads } from "@/hooks/useLeads"
import { LeadCard } from "@/components/LeadCard"
import { ScrollArea } from "@/components/ui/scroll-area"

// TODO: organization_id will come from user profile lookup (Phase 01-04+)
// For MVP, we derive it from user metadata or fall back to empty string (query disabled)
function useOrganizationId(): string {
  const { user } = useAuth()
  // Supabase user_metadata may contain organization_id after profile setup
  return (user?.user_metadata?.organization_id as string | undefined) ?? ""
}

export function DashboardPage() {
  const { t } = useTranslation()
  const organizationId = useOrganizationId()
  const { data: leads, isLoading } = useLeads(organizationId)

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("dashboard.title")}</h1>

      {isLoading && (
        <p className="text-muted-foreground text-sm">{t("common.loading")}</p>
      )}

      {!isLoading && (!leads || leads.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
          <p className="font-medium">{t("dashboard.noLeads")}</p>
          <p className="text-sm text-muted-foreground">{t("dashboard.noLeadsSubtitle")}</p>
        </div>
      )}

      {leads && leads.length > 0 && (
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-3 pr-2">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
