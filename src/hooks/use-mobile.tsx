
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Keeping this value but making better usage of it

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Set initial state based on window width
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Add event listener for resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => checkMobile();
    
    // Check immediately on mount
    checkMobile();
    
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
