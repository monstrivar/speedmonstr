import { useTranslation } from "react-i18next"
import { Phone, ChevronRight, Clock } from "lucide-react"
import type { Lead } from "@/types"

interface LeadCardProps {
  lead: Lead
  onPress?: (lead: Lead) => void
}

const timeFormatter = new Intl.DateTimeFormat("no", {
  hour: "2-digit",
  minute: "2-digit",
})

const dateFormatter = new Intl.DateTimeFormat("no", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

// Colors mapped to CSS variables defined in index.css (--status-*)
const STATUS_COLORS: Record<string, string> = {
  ny: "var(--status-ny)",
  sms_sendt: "var(--status-sms-sendt)",
  venter: "var(--status-venter)",
  fulgt_opp: "var(--status-fulgt-opp)",
  booket: "var(--status-booket)",
  ikke_relevant: "var(--status-ikke-relevant)",
}

function getTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Nå"
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}t`
  const days = Math.floor(hours / 24)
  if (days <= 7) return `${days}d`
  return dateFormatter.format(new Date(dateStr))
}

export function LeadCard({ lead, onPress }: LeadCardProps) {
  const { t } = useTranslation()

  const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(" ")
  const timeSince = lead.created_at ? getTimeSince(lead.created_at) : ""
  const timeStr = lead.created_at ? timeFormatter.format(new Date(lead.created_at)) : ""
  const statusColor = STATUS_COLORS[lead.status] ?? STATUS_COLORS.ny

  return (
    <button
      type="button"
      className="w-full text-left active:scale-[0.98] transition-transform"
      onClick={() => onPress?.(lead)}
    >
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/60">
        <div className="flex items-start gap-3">
          {/* Status indicator */}
          <div className="mt-1 size-2.5 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[15px] truncate">{fullName}</p>
              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <Clock className="size-3" />
                <span className="text-xs">{timeSince}</span>
              </div>
            </div>

            {lead.description && (
              <p className="text-[13px] text-muted-foreground line-clamp-3 mt-0.5 leading-snug">
                {lead.description}
              </p>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                  style={{ backgroundColor: `color-mix(in oklch, ${statusColor} 12%, transparent)`, color: statusColor }}
                >
                  {t(`lead.status.${lead.status}`, lead.status)}
                </span>
                {lead.source && (
                  <span className="text-[11px] text-muted-foreground">
                    {lead.source}
                  </span>
                )}
              </div>
              {lead.phone && (
                <Phone className="size-4 text-primary" />
              )}
            </div>
          </div>

          <ChevronRight className="size-4 text-muted-foreground/50 mt-1 shrink-0" />
        </div>
      </div>
    </button>
  )
}
