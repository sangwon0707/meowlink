const { contextBridge, ipcRenderer } = require("electron")
const packageJson = require("./package.json")

console.log("🐊 Preload script loaded with React support")

contextBridge.exposeInMainWorld("electronAPI", {
  // 알림 표시
  showNotification: (title, body) => {
    return ipcRenderer.invoke("show-notification", { title, body })
  },

  // 외부 링크 열기
  openExternal: (url) => {
    return ipcRenderer.invoke("open-external", url)
  },

  // 앱 버전 가져오기
  getVersion: () => {
    return packageJson.version
  },

  // 사용자 데이터 경로 가져오기
  getUserDataPath: () => {
    return ipcRenderer.invoke("get-user-data-path")
  },

  // 데이터베이스 경로 가져오기
  getDatabasePath: () => {
    return ipcRenderer.invoke("get-database-path")
  },

  // 데이터베이스 폴더 열기
  revealDatabaseFolder: () => {
    return ipcRenderer.invoke("reveal-database-folder")
  },

  // 스플래시 윈도우 닫기
  closeSplash: () => {
    return ipcRenderer.invoke("close-splash")
  },

  // === 데이터베이스 API ===
  getAllLinks: () => {
    return ipcRenderer.invoke("db-get-all-links")
  },

  addLink: (linkData) => {
    return ipcRenderer.invoke("db-add-link", linkData)
  },

  saveLink: (linkData) => {
    return ipcRenderer.invoke("db-add-link", linkData)
  },

  updateLink: (id, updates) => {
    return ipcRenderer.invoke("db-update-link", id, updates)
  },

  deleteLink: (id) => {
    return ipcRenderer.invoke("db-delete-link", id)
  },

  searchLinks: (query) => {
    return ipcRenderer.invoke("db-search-links", query)
  },

  getLinksByFilter: (filter) => {
    return ipcRenderer.invoke("db-get-links-by-filter", filter)
  },

  getUpcomingReminders: () => {
    return ipcRenderer.invoke("db-get-upcoming-reminders")
  },

  getStats: () => {
    return ipcRenderer.invoke("db-get-stats")
  },

  // 메뉴 액션 리스너
  onMenuAction: (callback) => {
    const channels = [
      "open-add-dialog",
      "focus-search",
      "filter-links",
      "toggle-dark-mode",
      "check-reminders",
      "app-ready",
    ]

    channels.forEach((channel) => {
      ipcRenderer.on(channel, (event, ...args) => {
        callback({ type: channel }, ...args)
      })
    })
  },

  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },

  platform: process.platform,
  version: packageJson.version,
})

console.log("🐊 Preload script loaded with splash screen support")
