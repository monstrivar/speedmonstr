import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { usePushNotifications } from "@/hooks/usePushNotifications"
import { useAppResume } from "@/hooks/useAppResume"
import { BottomTabBar } from "@/components/BottomTabBar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Register for push notifications after user is authenticated
  usePushNotifications(user?.id ?? null)

  // Refetch data when app comes back to foreground
  useAppResume(() => {
    queryClient.invalidateQueries({ queryKey: ["leads"] })
    queryClient.invalidateQueries({ queryKey: ["response-time"] })
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        className="sticky top-0 z-10 flex items-center px-5 py-3 bg-background/80 backdrop-blur-lg border-b border-border/40"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <span className="font-semibold text-lg tracking-tight">{t("app.name", "Monstr")}</span>
      </header>
      <main className="flex-1 overflow-y-auto px-5 py-5">
        {children}
      </main>
      <BottomTabBar />
    </div>
  )
}
