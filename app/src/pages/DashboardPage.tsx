import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/useAuth"
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { useLeads } from "@/hooks/useLeads"
import { useResponseTime } from "@/hooks/useResponseTime"
import { Phone } from "lucide-react"
import { LeadCard } from "@/components/LeadCard"
import { LeadDetailSheet } from "@/components/LeadDetailSheet"
import type { Lead } from "@/types"

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const organizationId = useOrganizationId()
  const { data: leads, isLoading } = useLeads(organizationId)
  const responseTime = useResponseTime(organizationId)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const leadCount = leads?.length ?? 0
  const newCount = leads?.filter((l) => l.status === "ny").length ?? 0

  return (
    <div className="space-y-5">
      {/* Header with count */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        {leadCount > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {leadCount} {t("dashboard.leads").toLowerCase()}
            {newCount > 0 && (
              <span className="text-primary font-medium"> — {newCount} {t("lead.status.ny").toLowerCase()}</span>
            )}
          </p>
        )}
      </div>

      {/* Stats row */}
      {(responseTime.data || newCount > 0) && (
        <div className="flex gap-3">
          {newCount > 0 && (
            <div className="flex-1 rounded-2xl bg-primary/5 border border-primary/10 p-3.5">
              <p className="text-xs text-muted-foreground font-medium">{t("dashboard.newLeads")}</p>
              <p className="text-2xl font-bold text-primary mt-0.5">{newCount}</p>
            </div>
          )}
          {responseTime.data && (
            <div className="flex-1 rounded-2xl bg-emerald-50 border border-emerald-100 p-3.5">
              <p className="text-xs text-muted-foreground font-medium">{t("dashboard.avgResponseTime")}</p>
              <p className="text-2xl font-bold text-emerald-700 mt-0.5">
                {responseTime.data} <span className="text-sm font-normal">{t("dashboard.minutes")}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && leadCount === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-2">
            <Phone className="size-5 text-muted-foreground" />
          </div>
          <p className="font-semibold">{t("dashboard.noLeads")}</p>
          <p className="text-sm text-muted-foreground max-w-[240px]">{t("dashboard.noLeadsSubtitle")}</p>
        </div>
      )}

      {leadCount > 0 && (
        <div className="space-y-2.5">
          {leads!.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onPress={(l) => setSelectedLead(l)}
            />
          ))}
        </div>
      )}

      <LeadDetailSheet
        lead={selectedLead}
        open={selectedLead !== null}
        onOpenChange={(open) => { if (!open) setSelectedLead(null) }}
        userId={user?.id ?? ""}
        organizationId={organizationId}
      />
    </div>
  )
}
