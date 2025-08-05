const { app, BrowserWindow, Menu, shell, ipcMain, dialog, Notification } = require("electron")
const path = require("path")
const fs = require("fs")

const isDev = process.env.NODE_ENV === "development" || process.argv.includes("--dev")

let mainWindow
let splashWindow
let dbManager

app.whenReady().then(() => {
  createSplashWindow()
  initializeDatabase()

  // 5초 후 메인 윈도우 생성
  setTimeout(() => {
    createMainWindow()
    createMenu()
  }, 5000)

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow()
      setTimeout(() => {
        createMainWindow()
        createMenu()
      }, 5000)
    }
  })
})

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 399,
    height: 385,
    resizable: false, 
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: getAppIcon(),
  })

  splashWindow.loadFile(path.join(__dirname, "renderer/splash.html"))

  splashWindow.on("closed", () => {
    splashWindow = null
  })
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: !isDev,
    },
    show: false,
    icon: getAppIcon(),
  })

  // React 빌드 결과 로드
  const buildPath = path.join(__dirname, "build/index.html")
  
  if (fs.existsSync(buildPath)) {
    mainWindow.loadFile(buildPath)
    // 개발 모드에서도 개발자 도구 자동 열기 비활성화
    // if (isDev) {
    //   mainWindow.webContents.openDevTools()
    // }
  } else {
    console.error("React build not found! Please run 'npm run build-react' first.")
    // 폴백으로 기존 HTML 사용
    if (fs.existsSync(path.join(__dirname, "renderer/index.html"))) {
      mainWindow.loadFile(path.join(__dirname, "renderer/index.html"))
    } else {
      dialog.showErrorBox("Build Error", "No UI files found. Please run 'npm run build-react' first.")
      app.quit()
    }
  }

  mainWindow.once("ready-to-show", () => {
    // 스플래시 윈도우 닫기
    if (splashWindow) {
      splashWindow.close()
    }

    mainWindow.show()

    // 메인 윈도우가 준비되었음을 알림
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("app-ready")
      }
    }, 500)
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })
}

function getAppIcon() {
  const iconPath = path.join(__dirname, "assets")

  const customIcon = path.join(iconPath, "meowlink-icon.png")
  if (fs.existsSync(customIcon)) {
    return customIcon
  }

  if (process.platform === "darwin") {
    const icnsPath = path.join(iconPath, "icon.icns")
    return fs.existsSync(icnsPath) ? icnsPath : path.join(iconPath, "icon.png")
  } else if (process.platform === "win32") {
    const icoPath = path.join(iconPath, "icon.ico")
    return fs.existsSync(icoPath) ? icoPath : path.join(iconPath, "icon.png")
  } else {
    return path.join(iconPath, "icon.png")
  }
}

function initializeDatabase() {
  try {
    const DatabaseManager = require("./utils/database-sqlite3")
    dbManager = DatabaseManager.getInstance()
    console.log("✅ Database manager initialized")
  } catch (error) {
    console.error("❌ Failed to initialize database:", error)
  }
}

function createMenu() {
  const isMac = process.platform === "darwin"

  const template = [
    ...(isMac
      ? [
          {
            label: app.getName(),
            submenu: [
              {
                label: "About MeowLink",
                click: () => {
                  const packageJson = require("./package.json")
                  dialog.showMessageBox(mainWindow, {
                    type: "info",
                    title: "About MeowLink",
                    message: "MeowLink 🐱",
                    detail: `Knowledge Collection App for Developers\nVersion ${packageJson.version}\nBuilt with Electron`,
                    icon: getAppIcon(),
                  })
                },
              },
              {
                label: "Show Database Location",
                click: () => {
                  const dbPath = path.join(app.getPath("userData"), "meowlink.db")
                  dialog.showMessageBox(mainWindow, {
                    type: "info",
                    title: "Database Location",
                    message: "Your MeowLink Database",
                    detail: `Your bookmarks are stored at:\n\n${dbPath}\n\nClick "Show in Finder" to open the folder.`,
                    buttons: ["OK", "Show in Finder"],
                    defaultId: 0,
                    icon: getAppIcon(),
                  }).then((response) => {
                    if (response.response === 1) {
                      shell.showItemInFolder(dbPath)
                    }
                  })
                },
              },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [
        {
          label: "Add New Link",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("open-add-dialog")
            }
          },
        },
        ...(!isMac ? [{ type: "separator" }, { role: "quit" }] : []),
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectall" },
        { type: "separator" },
        {
          label: "Find",
          accelerator: "CmdOrCtrl+F",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("focus-search")
            }
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "All Links",
          accelerator: "CmdOrCtrl+1",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("filter-links", "all")
            }
          },
        },
        {
          label: "Favorites",
          accelerator: "CmdOrCtrl+2",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("filter-links", "favorites")
            }
          },
        },
        {
          label: "Reminders",
          accelerator: "CmdOrCtrl+3",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("filter-links", "reminders")
            }
          },
        },
        { type: "separator" },
        {
          label: "Toggle Dark Mode",
          accelerator: "CmdOrCtrl+Shift+D",
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send("toggle-dark-mode")
            }
          },
        },
        { type: "separator" },
        { role: "reload" },
        { role: "forcereload" },
        { role: "toggledevtools" },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }, ...(isMac ? [{ type: "separator" }, { role: "front" }] : [])],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// IPC 핸들러들
ipcMain.handle("show-notification", (event, { title, body }) => {
  try {
    if (Notification.isSupported()) {
      const notification = new Notification({
        title,
        body,
        icon: getAppIcon(),
      })
      notification.show()
      return true
    }
    return false
  } catch (error) {
    console.error("Notification error:", error)
    return false
  }
})

ipcMain.handle("open-external", (event, url) => {
  shell.openExternal(url)
})

ipcMain.handle("get-user-data-path", () => {
  return app.getPath("userData")
})

// 데이터베이스 경로 가져오기
ipcMain.handle("get-database-path", () => {
  const path = require("path")
  return path.join(app.getPath("userData"), "meowlink.db")
})

// 데이터베이스 폴더를 파일 탐색기에서 열기
ipcMain.handle("reveal-database-folder", () => {
  shell.showItemInFolder(path.join(app.getPath("userData"), "meowlink.db"))
})

// 스플래시 윈도우 닫기
ipcMain.handle("close-splash", () => {
  if (splashWindow) {
    splashWindow.close()
  }
})

// 데이터베이스 IPC 핸들러들
ipcMain.handle("db-get-all-links", async () => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.getAllLinks()
})

ipcMain.handle("db-add-link", async (event, linkData) => {
  if (!dbManager) throw new Error("Database not initialized")

  try {
    const scraper = require("./utils/scraper")
    const metadata = await scraper.extractMetadata(linkData.url)

    // GitHub URL인 경우 React에서 생성한 고해상도 프로필 사진 유지
    const isGitHub = linkData.url.includes('github.com')
    
    const enrichedLinkData = {
      ...linkData,
      title: metadata.title,
      domain: metadata.domain,
      favicon: isGitHub ? linkData.favicon : metadata.favicon,
    }

    return await dbManager.addLink(enrichedLinkData)
  } catch (error) {
    console.error("Failed to add link:", error)
    throw error
  }
})

ipcMain.handle("db-update-link", async (event, id, updates) => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.updateLink(id, updates)
})

ipcMain.handle("db-delete-link", async (event, id) => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.deleteLink(id)
})

ipcMain.handle("db-search-links", async (event, query) => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.searchLinks(query)
})

ipcMain.handle("db-get-links-by-filter", async (event, filter) => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.getLinksByFilter(filter)
})

ipcMain.handle("db-get-upcoming-reminders", async () => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.getUpcomingReminders()
})

ipcMain.handle("db-get-stats", async () => {
  if (!dbManager) throw new Error("Database not initialized")
  return await dbManager.getStats()
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("before-quit", async () => {
  if (dbManager) {
    try {
      await dbManager.close()
    } catch (error) {
      console.error("Error closing database:", error)
    }
  }
})
