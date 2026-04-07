import { useTranslation } from "react-i18next"

export function ActivityPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-4">📊</div>
      <h1 className="text-xl font-semibold mb-2">{t("activity.title")}</h1>
      <p className="text-muted-foreground text-sm max-w-[260px]">
        {t("activity.emptyDescription")}
      </p>
    </div>
  )
}
