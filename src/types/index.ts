// 링크 아이템 타입 정의
export interface LinkItem {
  id: number
  url: string
  title: string
  domain: string
  favicon: string
  memo?: string
  tags: string[]
  created_at: string
  is_favorite: boolean
  updated_at?: string
}

// 필터 타입 - 간단하게 유지
export type FilterType = 'all' | 'favorites'

// 새 링크 폼 데이터
export interface NewLinkData {
  url: string
  title?: string
  memo: string
  tags: string
}

// Electron API 타입
export interface ElectronAPI {
  getAllLinks: () => Promise<LinkItem[]>
  addLink: (link: Omit<LinkItem, 'id' | 'created_at' | 'updated_at'>) => Promise<LinkItem>
  saveLink: (link: Omit<LinkItem, 'id' | 'created_at' | 'updated_at'>) => Promise<LinkItem>
  updateLink: (id: number, updates: Partial<LinkItem>) => Promise<LinkItem | null>
  deleteLink: (id: number) => Promise<boolean>
  showNotification: (title: string, body: string) => Promise<boolean>
  openExternal: (url: string) => Promise<void>
  getVersion: () => string
  getDatabasePath: () => Promise<string>
  revealDatabaseFolder: () => Promise<void>
  onMenuAction?: (callback: (event: any, data?: any) => void) => void
  removeAllListeners?: (channel: string) => void
  platform?: string
  version?: string
  getUserDataPath?: () => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    isDev?: boolean
  }
}