// This hook must be called after user is authenticated. Add to Layout or DashboardPage.
import { useEffect } from "react"
import { Capacitor } from "@capacitor/core"
import {
  PushNotifications,
  type ActionPerformed,
} from "@capacitor/push-notifications"
import { supabase } from "@/lib/supabase"

export function usePushNotifications(userId: string | null): void {
  useEffect(() => {
    if (!userId || !Capacitor.isNativePlatform()) return

    let registered = false

    async function register() {
      const result = await PushNotifications.requestPermissions()

      if (result.receive !== "granted") {
        console.warn("[Push] Permission not granted:", result.receive)
        return
      }

      await PushNotifications.register()
      registered = true
    }

    void register()

    const registrationListener = PushNotifications.addListener(
      "registration",
      async (token) => {
        if (!token.value?.trim()) {
          console.warn("[Push] Token is empty, skipping storage")
          return
        }

        const { error } = await supabase.from("push_tokens").upsert(
          {
            user_id: userId,
            token: token.value.trim(),
            platform: "ios",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,platform" }
        )

        if (error) {
          console.error("[Push] Failed to store token:", error)
        } else {
          console.log("[Push] Token stored successfully")
        }
      }
    )

    const registrationErrorListener = PushNotifications.addListener(
      "registrationError",
      (err) => {
        console.error("[Push] Registration error:", err)
      }
    )

    // Notification received while app is in foreground — log for now
    const notificationReceivedListener = PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("[Push] Notification received in foreground:", notification)
      }
    )

    const actionPerformedListener = PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: ActionPerformed) => {
        const data = notification.notification.data as
          | Record<string, string>
          | undefined

        // Deep link to specific lead if lead_id present
        if (data?.lead_id) {
          window.location.hash = `lead=${data.lead_id}`
          return
        }

        if (data?.phone) {
          window.location.href = `tel:${encodeURIComponent(data.phone)}`
          return
        }
      }
    )

    return () => {
      void Promise.all([
        registrationListener,
        registrationErrorListener,
        notificationReceivedListener,
        actionPerformedListener,
      ]).then(() => {
        void PushNotifications.removeAllListeners()
      })
    }
  }, [userId])
}
