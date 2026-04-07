import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/useAuth"
import { useOrganizationId } from "@/hooks/useOrganizationId"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SettingsPage() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const organizationId = useOrganizationId()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t("settings.title")}</h1>

      <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
        <div className="text-sm text-muted-foreground">{t("settings.account")}</div>
        <div className="text-sm font-medium">{user?.email}</div>
      </div>

      <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
        <div className="text-sm text-muted-foreground">{t("settings.notifications")}</div>
        <p className="text-xs text-muted-foreground">{t("settings.comingSoon")}</p>
      </div>

      <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
        <div className="text-sm text-muted-foreground">{t("settings.team")}</div>
        <p className="text-xs text-muted-foreground">{t("settings.comingSoon")}</p>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full text-destructive border-destructive/30"
        onClick={() => void signOut()}
      >
        {t("auth.signOut")}
      </Button>
    </div>
  )
}
