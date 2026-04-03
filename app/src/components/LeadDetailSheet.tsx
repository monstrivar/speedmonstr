import { useTranslation } from "react-i18next"
import { Phone, Mail, Building2 } from "lucide-react"
import { Haptics, ImpactStyle } from "@capacitor/haptics"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useCallTracking } from "@/hooks/useCallTracking"
import { useUpdateLeadStatus } from "@/hooks/useLeadMutations"
import { FollowUpPrompt } from "./FollowUpPrompt"
import type { Lead } from "@/types"

interface LeadDetailSheetProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  organizationId: string
}

const dateFormatter = new Intl.DateTimeFormat("no", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function LeadDetailSheet({
  lead,
  open,
  onOpenChange,
  userId,
  organizationId,
}: LeadDetailSheetProps) {
  const { t } = useTranslation()

  const { handleCallPress, showFollowUp, handleFollowUpOutcome } =
    useCallTracking({ leadId: lead?.id ?? "", userId })

  const { mutate: updateStatus, isPending } = useUpdateLeadStatus(organizationId)

  function handleCallPressWithHaptics() {
    Haptics.impact({ style: ImpactStyle.Medium })
    handleCallPress()
  }

  const fullName = lead
    ? [lead.first_name, lead.last_name].filter(Boolean).join(" ")
    : ""

  const receivedAt =
    lead?.created_at ? dateFormatter.format(new Date(lead.created_at)) : null

  return (
    <>
      <Sheet open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
        <SheetContent
          side="bottom"
          className="h-[85dvh] rounded-t-2xl overflow-y-auto"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>{fullName}</SheetTitle>
            {receivedAt && (
              <SheetDescription>
                {t("lead.receivedLabel")}: {receivedAt}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="flex flex-col gap-3 px-4 pb-4">
            {/* Lead detail fields */}
            {lead?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground shrink-0" />
                <span>{lead.phone}</span>
              </div>
            )}
            {lead?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground shrink-0" />
                <span>{lead.email}</span>
              </div>
            )}
            {lead?.company && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="size-4 text-muted-foreground shrink-0" />
                <span>{lead.company}</span>
              </div>
            )}
            {lead?.description && (
              <p className="text-sm text-muted-foreground">{lead.description}</p>
            )}
            {lead?.source && (
              <div className="text-sm">
                <span className="font-medium">{t("lead.source")}: </span>
                <span className="text-muted-foreground">{lead.source}</span>
              </div>
            )}

            {/* Ring button */}
            {lead?.phone && (
              <Button asChild size="lg" className="w-full gap-2 mt-2">
                <a
                  href={`tel:${lead.phone}`}
                  onClick={handleCallPressWithHaptics}
                >
                  <Phone className="size-5" />
                  {t("lead.callNow")}
                </a>
              </Button>
            )}

            <Separator className="my-1" />

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={isPending || !lead}
                onClick={() => {
                  if (lead) updateStatus({ leadId: lead.id, status: "fulgt_opp" })
                }}
              >
                {t("lead.markAsFollowedUp")}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={isPending || !lead}
                onClick={() => {
                  if (lead) updateStatus({ leadId: lead.id, status: "ikke_relevant" })
                }}
              >
                {t("lead.notRelevant")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <FollowUpPrompt open={showFollowUp} onOutcome={handleFollowUpOutcome} />
    </>
  )
}
