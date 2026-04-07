import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type FollowUpOutcome = "answered" | "no_answer" | "voicemail" | "cancelled"

interface FollowUpPromptProps {
  open: boolean
  onOutcome: (outcome: FollowUpOutcome, note?: string) => void
}

export function FollowUpPrompt({ open, onOutcome }: FollowUpPromptProps) {
  const { t } = useTranslation()
  const [showNote, setShowNote] = useState(false)
  const [note, setNote] = useState("")

  function handleOutcome(outcome: FollowUpOutcome) {
    onOutcome(outcome, note.trim() || undefined)
    setShowNote(false)
    setNote("")
  }

  function handleClose() {
    onOutcome("cancelled")
    setShowNote(false)
    setNote("")
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
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
          {showNote && (
            <div className="space-y-2 mb-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("followUp.notePlaceholder")}
                autoFocus
              />
            </div>
          )}

          <Button
            className="w-full"
            onClick={() => handleOutcome("answered")}
          >
            {t("followUp.answered")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOutcome("no_answer")}
          >
            {t("followUp.noAnswer")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOutcome("voicemail")}
          >
            {t("followUp.voicemail")}
          </Button>

          {!showNote && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowNote(true)}
            >
              {t("followUp.addNote")}
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => handleOutcome("cancelled")}
          >
            {t("followUp.cancel")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
