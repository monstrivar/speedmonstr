import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { useLeads } from "@/hooks/useLeads"
import { useAuth } from "@/hooks/useAuth"
import { Archive } from "lucide-react"
import { LeadCard } from "@/components/LeadCard"
import { LeadDetailSheet } from "@/components/LeadDetailSheet"
import type { Lead } from "@/types"

const ARCHIVED_STATUSES = ["fulgt_opp", "booket", "ikke_relevant"]

export function ArchivePage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const organizationId = useOrganizationId()
  const { data: leads, isLoading } = useLeads(organizationId)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const archivedLeads = leads?.filter((l) => ARCHIVED_STATUSES.includes(l.status)) ?? []

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight">{t("archive.title")}</h1>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!isLoading && archivedLeads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-2">
            <Archive className="size-5 text-muted-foreground" />
          </div>
          <p className="font-semibold">{t("archive.noLeads")}</p>
          <p className="text-sm text-muted-foreground max-w-[260px]">
            {t("archive.emptyDescription")}
          </p>
        </div>
      )}

      {archivedLeads.length > 0 && (
        <div className="space-y-2.5">
          {archivedLeads.map((lead) => (
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
