import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"

export function LoginPage() {
  const { t } = useTranslation()
  const { signIn, signInWithPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usePassword, setUsePassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (usePassword && password) {
      const { error: signInError } = await signInWithPassword(email, password)
      setLoading(false)
      if (signInError) {
        setError(signInError.message)
      }
    } else {
      const { error: signInError } = await signIn(email)
      setLoading(false)
      if (signInError) {
        setError(t("auth.errorMessage"))
      } else {
        setSent(true)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-safe-top">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("auth.title")}</CardTitle>
          <CardDescription>{t("auth.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-2">
              <p className="font-medium">{t("auth.successTitle")}</p>
              <p className="text-sm text-muted-foreground">
                {t("auth.successMessage", { email })}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("auth.emailLabel")}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {usePassword && (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t("auth.passwordLabel")}
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("auth.submitting") : usePassword ? t("auth.signInButton") : t("auth.submitButton")}
              </Button>
              <button
                type="button"
                className="w-full text-xs text-muted-foreground underline"
                onClick={() => setUsePassword(!usePassword)}
              >
                {usePassword ? t("auth.useMagicLink") : t("auth.usePassword")}
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
