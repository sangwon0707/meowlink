/**
 * Version utility - Single source of truth for app version
 * Reads version from package.json to avoid hardcoding
 */

// In Electron, we can access package.json through require
// This will be available in both main and renderer processes
export function getAppVersion(): string {
  try {
    // In renderer process, get version through electronAPI
    if (typeof window !== 'undefined' && window.electronAPI?.getVersion) {
      return window.electronAPI.getVersion()
    }
    
    // Fallback - this will be updated when package.json is updated
    return '0.1.0'
  } catch (error) {
    console.warn('Could not get app version:', error)
    return '0.1.0'
  }
}

// For display purposes - adds 'v' prefix
export function getDisplayVersion(): string {
  return `v${getAppVersion()}`
}

// Version comparison utilities
export function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const cleaned = version.replace(/^v/, '')
  const [major = 0, minor = 0, patch = 0] = cleaned.split('.').map(Number)
  return { major, minor, patch }
}

export function compareVersions(a: string, b: string): number {
  const versionA = parseVersion(a)
  const versionB = parseVersion(b)
  
  if (versionA.major !== versionB.major) return versionA.major - versionB.major
  if (versionA.minor !== versionB.minor) return versionA.minor - versionB.minor
  return versionA.patch - versionB.patch
}