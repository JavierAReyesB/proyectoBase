// utils/useIsMobile.ts
import { useState, useEffect } from "react"

export const useIsMobile = (bp = 840) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < bp)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [bp])

  return isMobile
}
