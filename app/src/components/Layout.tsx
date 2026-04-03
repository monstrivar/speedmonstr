import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/useAuth"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()

  // Register for push notifications after user is authenticated
  usePushNotifications(user?.id ?? null)

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-background"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <span className="font-heading font-semibold text-lg">{t("app.name", "Monstr")}</span>
        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
          {t("auth.signOut")}
        </Button>
      </header>
      <main
        className="flex-1 px-4 py-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {children}
      </main>
    </div>
  )
}
