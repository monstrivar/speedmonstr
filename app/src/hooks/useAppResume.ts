import { App } from "@capacitor/app"
import { useEffect, useRef } from "react"

export function useAppResume(onResume: () => void) {
  const onResumeRef = useRef(onResume)
  onResumeRef.current = onResume

  useEffect(() => {
    const listenerPromise = App.addListener("appStateChange", ({ isActive }) => {
      if (isActive) {
        onResumeRef.current()
      }
    })
    return () => {
      void listenerPromise.then((handle) => handle.remove())
    }
  }, []) // empty deps — ref keeps callback current without re-registering
}
