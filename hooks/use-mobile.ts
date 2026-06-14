import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Synchronous initial call removed, already handled by useState initialization or handled externally instead?
    // Actually, setting window inner width safely in useEffect:
    if (isMobile !== (window.innerWidth < MOBILE_BREAKPOINT)) {
       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
