// Runs client-side; returns a SystemInfo object
import type { SystemInfo } from './types'

const recentErrors: string[] = []

if (typeof window !== 'undefined') {
  const _prevOnError = window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
    recentErrors.push(`${message} @ ${source}:${lineno}:${colno}`)
    if (recentErrors.length > 5) recentErrors.shift()
    if (_prevOnError) return _prevOnError(message, source, lineno, colno, error)
    return false
  }
}

export function collectSystemInfo(): SystemInfo {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { effectiveType?: string }
  }

  return {
    userAgent:         nav.userAgent,
    platform:          nav.platform,
    language:          nav.language,
    screenWidth:       screen.width,
    screenHeight:      screen.height,
    windowWidth:       window.innerWidth,
    windowHeight:      window.innerHeight,
    hardwareConcurrency: nav.hardwareConcurrency ?? 0,
    deviceMemory:      nav.deviceMemory,
    connectionType:    nav.connection?.effectiveType,
    recentErrors:      [...recentErrors],
  }
}
