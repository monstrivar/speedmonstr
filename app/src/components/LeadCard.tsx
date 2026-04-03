import { useTranslation } from "react-i18next"
import { Phone } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Lead } from "@/types"

interface LeadCardProps {
  lead: Lead
}

const dateFormatter = new Intl.DateTimeFormat("no", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

export function LeadCard({ lead }: LeadCardProps) {
  const { t } = useTranslation()

  const handleCall = () => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`)
    }
  }

  const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(" ")
  const receivedAt = lead.created_at ? dateFormatter.format(new Date(lead.created_at)) : null

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{fullName}</p>
            {receivedAt && (
              <p className="text-xs text-muted-foreground mt-0.5">{receivedAt}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0">
            {t(`lead.status.${lead.status}`, lead.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-start justify-between gap-3">
        {lead.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {lead.description}
          </p>
        )}
        {lead.phone && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCall}
            className="shrink-0 gap-1.5"
            aria-label={t("lead.callNow")}
          >
            <Phone className="size-4" />
            {t("lead.callNow")}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
