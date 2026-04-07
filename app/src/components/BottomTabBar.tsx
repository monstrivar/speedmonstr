import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { Home, Archive, Activity, Settings } from "lucide-react"

const tabs = [
  { key: "dashboard", path: "/", icon: Home },
  { key: "archive", path: "/archive", icon: Archive },
  { key: "activity", path: "/activity", icon: Activity },
  { key: "settings", path: "/settings", icon: Settings },
] as const

export function BottomTabBar() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav
      className="sticky bottom-0 z-10 grid grid-cols-4 border-t border-border/40 bg-background/80 backdrop-blur-lg"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      {tabs.map(({ key, path, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={key}
            type="button"
            onClick={() => navigate(path)}
            aria-label={t(`navigation.${key}`)}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 pt-2 pb-1 text-xs transition-colors ${
              active
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="size-5" aria-hidden="true" strokeWidth={active ? 2.2 : 1.6} />
            <span>{t(`navigation.${key}`)}</span>
          </button>
        )
      })}
    </nav>
  )
}
