import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type FollowUpOutcome = "answered" | "no_answer" | "voicemail" | "cancelled"

interface FollowUpPromptProps {
  open: boolean
  onOutcome: (outcome: FollowUpOutcome) => void
}

export function FollowUpPrompt({ open, onOutcome }: FollowUpPromptProps) {
  const { t } = useTranslation()

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOutcome("cancelled")
      }}
      disablePointerDismissal
    >
      <SheetContent
        side="bottom"
        className="rounded-t-2xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        showCloseButton={false}
      >
        <SheetHeader>
          <SheetTitle>{t("followUp.title")}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-4 pt-0">
          <Button
            className="w-full"
            onClick={() => onOutcome("answered")}
          >
            {t("followUp.answered")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOutcome("no_answer")}
          >
            {t("followUp.noAnswer")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOutcome("voicemail")}
          >
            {t("followUp.voicemail")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOutcome("cancelled")}
          >
            {t("followUp.cancel")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
