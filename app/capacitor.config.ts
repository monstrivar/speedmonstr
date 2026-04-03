import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "no.monstr.app",
  appName: "Monstr",
  webDir: "dist",
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#111111",
    },
  },
}

export default config
