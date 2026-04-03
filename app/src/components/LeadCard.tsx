import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Lead } from "@/types"

interface LeadCardProps {
  lead: Lead
  onPress?: (lead: Lead) => void
}

const dateFormatter = new Intl.DateTimeFormat("no", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

export function LeadCard({ lead, onPress }: LeadCardProps) {
  const { t } = useTranslation()

  const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(" ")
  const receivedAt = lead.created_at ? dateFormatter.format(new Date(lead.created_at)) : null

  return (
    <button
      type="button"
      className={`w-full text-left${onPress ? " cursor-pointer" : ""}`}
      onClick={() => onPress?.(lead)}
    >
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
        {lead.description && (
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {lead.description}
            </p>
          </CardContent>
        )}
      </Card>
    </button>
  )
}
