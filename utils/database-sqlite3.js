// 크로스플랫폼 호환 SQLite3 데이터베이스 매니저
const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const fs = require("fs")

class DatabaseManager {
  constructor() {
    this.db = null
    this.isInitialized = false
    this.initDatabase()
  }

  static getInstance() {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  initDatabase() {
    try {
      // 사용자 데이터 디렉토리 확인/생성
      const userDataPath = this.getUserDataPath()
      if (!fs.existsSync(userDataPath)) {
        fs.mkdirSync(userDataPath, { recursive: true })
      }

      const dbPath = path.join(userDataPath, "meowlink.db")
      console.log(`🐊 Database path: ${dbPath}`)

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("Database connection error:", err)
          throw err
        }
        console.log("🐊 Connected to SQLite database")
        this.createTables()
      })
    } catch (error) {
      console.error("Database initialization error:", error)
      throw error
    }
  }

  getUserDataPath() {
    // Electron 환경에서는 app.getPath('userData') 사용
    // 테스트 환경에서는 로컬 폴더 사용
    try {
      const { app } = require("electron")
      return app.getPath("userData")
    } catch {
      // Electron이 없는 환경에서는 로컬 data 폴더 사용
      const dataPath = path.join(__dirname, "..", "data")
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true })
      }
      return dataPath
    }
  }

  createTables() {
    const createLinksTable = `
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        favicon TEXT,
        memo TEXT,
        tags TEXT,
        created_at TEXT NOT NULL,
        reminder_date TEXT,
        is_favorite INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `

    const createIndexes = [
      "CREATE INDEX IF NOT EXISTS idx_links_domain ON links(domain)",
      "CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at)",
      "CREATE INDEX IF NOT EXISTS idx_links_is_favorite ON links(is_favorite)",
      "CREATE INDEX IF NOT EXISTS idx_links_reminder_date ON links(reminder_date)",
      "CREATE INDEX IF NOT EXISTS idx_links_tags ON links(tags)",
    ]

    this.db.serialize(() => {
      this.db.run(createLinksTable, (err) => {
        if (err) {
          console.error("Error creating links table:", err)
        } else {
          console.log("✅ Links table created/verified")
        }
      })

      createIndexes.forEach((indexQuery, i) => {
        this.db.run(indexQuery, (err) => {
          if (err) {
            console.error(`Error creating index ${i}:`, err)
          }
        })
      })

      this.isInitialized = true
      console.log("✅ Database initialization completed")
    })
  }

  // Promise 래퍼 함수들
  runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes,
          })
        }
      })
    })
  }

  getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // 링크 추가
  async addLink(link) {
    try {
      const query = `
        INSERT INTO links (
          url, title, domain, favicon, memo, tags, 
          created_at, reminder_date, is_favorite, is_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

      // created_at이 없으면 자동 생성
      const created_at = link.created_at || new Date().toISOString().split('T')[0]

      const params = [
        link.url,
        link.title,
        link.domain,
        link.favicon,
        link.memo,
        JSON.stringify(link.tags || []),
        created_at,
        link.reminder_date || null,
        link.is_favorite ? 1 : 0,
        link.is_completed ? 1 : 0,
      ]

      const result = await this.runQuery(query, params)

      // 알림 표시 (Electron 환경에서만)
      this.showNotification("Link Added! 🐊", `"${link.title}" has been saved`)

      return {
        id: result.lastID,
        ...link,
        created_at,
      }
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("This URL has already been saved")
      }
      throw error
    }
  }

  // 모든 링크 조회
  async getAllLinks() {
    try {
      const query = "SELECT * FROM links ORDER BY created_at DESC"
      const rows = await this.allQuery(query)
      return rows.map(this.mapRowToLink)
    } catch (error) {
      console.error("Error getting all links:", error)
      throw error
    }
  }

  // 링크 검색
  async searchLinks(searchQuery) {
    try {
      const query = `
        SELECT * FROM links 
        WHERE title LIKE ? OR memo LIKE ? OR tags LIKE ?
        ORDER BY 
          CASE 
            WHEN title LIKE ? THEN 1
            WHEN memo LIKE ? THEN 2
            ELSE 3
          END,
          created_at DESC
      `

      const searchTerm = `%${searchQuery}%`
      const params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]

      const rows = await this.allQuery(query, params)
      return rows.map(this.mapRowToLink)
    } catch (error) {
      console.error("Error searching links:", error)
      throw error
    }
  }

  // 필터별 링크 조회
  async getLinksByFilter(filter) {
    try {
      let query
      const params = []

      switch (filter) {
        case "favorites":
          query = "SELECT * FROM links WHERE is_favorite = 1 ORDER BY created_at DESC"
          break
        case "reminders":
          query = `
            SELECT * FROM links 
            WHERE reminder_date IS NOT NULL AND is_completed = 0 
            ORDER BY reminder_date ASC
          `
          break
        case "completed":
          query = "SELECT * FROM links WHERE is_completed = 1 ORDER BY created_at DESC"
          break
        default:
          return await this.getAllLinks()
      }

      const rows = await this.allQuery(query, params)
      return rows.map(this.mapRowToLink)
    } catch (error) {
      console.error("Error getting links by filter:", error)
      throw error
    }
  }

  // 링크 업데이트
  async updateLink(id, updates) {
    try {
      const fields = []
      const values = []

      Object.entries(updates).forEach(([key, value]) => {
        if (key === "id") return

        if (key === "tags") {
          fields.push("tags = ?")
          values.push(JSON.stringify(value))
        } else if (key === "is_favorite" || key === "is_completed") {
          fields.push(`${key} = ?`)
          values.push(value ? 1 : 0)
        } else {
          fields.push(`${key} = ?`)
          values.push(value)
        }
      })

      if (fields.length === 0) return false

      fields.push("updated_at = CURRENT_TIMESTAMP")
      values.push(id)

      const query = `UPDATE links SET ${fields.join(", ")} WHERE id = ?`
      const result = await this.runQuery(query, values)

      return result.changes > 0
    } catch (error) {
      console.error("Error updating link:", error)
      throw error
    }
  }

  // 링크 삭제
  async deleteLink(id) {
    try {
      const query = "DELETE FROM links WHERE id = ?"
      const result = await this.runQuery(query, [id])

      if (result.changes > 0) {
        this.showNotification("Link Deleted", "Link has been removed from your collection")
      }

      return result.changes > 0
    } catch (error) {
      console.error("Error deleting link:", error)
      throw error
    }
  }

  // 복습 예정 링크들
  async getUpcomingReminders() {
    try {
      const today = new Date().toISOString().split("T")[0]
      const query = `
        SELECT * FROM links 
        WHERE reminder_date <= ? AND is_completed = 0
        ORDER BY reminder_date ASC
      `

      const rows = await this.allQuery(query, [today])
      return rows.map(this.mapRowToLink)
    } catch (error) {
      console.error("Error getting upcoming reminders:", error)
      throw error
    }
  }

  // 통계 정보
  async getStats() {
    try {
      const totalResult = await this.getQuery("SELECT COUNT(*) as count FROM links")
      const favoriteResult = await this.getQuery("SELECT COUNT(*) as count FROM links WHERE is_favorite = 1")
      const reminderResult = await this.getQuery(
        "SELECT COUNT(*) as count FROM links WHERE reminder_date IS NOT NULL AND is_completed = 0",
      )

      return {
        total: totalResult.count,
        favorites: favoriteResult.count,
        reminders: reminderResult.count,
      }
    } catch (error) {
      console.error("Error getting stats:", error)
      return { total: 0, favorites: 0, reminders: 0 }
    }
  }

  // 데이터베이스 행을 LinkItem 객체로 변환
  mapRowToLink(row) {
    return {
      id: row.id,
      url: row.url,
      title: row.title,
      domain: row.domain,
      favicon: row.favicon,
      memo: row.memo,
      tags: JSON.parse(row.tags || "[]"),
      created_at: row.created_at,
      reminder_date: row.reminder_date,
      is_favorite: Boolean(row.is_favorite),
      is_completed: Boolean(row.is_completed),
    }
  }

  // 알림 표시 (Electron 환경에서만)
  showNotification(title, body) {
    try {
      // 브라우저 환경에서는 렌더러 프로세스를 통해 알림
      if (typeof window !== "undefined" && window.electronAPI) {
        window.electronAPI.showNotification(title, body)
      }
    } catch (error) {
      // 알림 실패는 무시 (중요하지 않은 기능)
      console.log("Notification not available:", error.message)
    }
  }

  // 데이터베이스 연결 종료
  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error("Error closing database:", err)
          } else {
            console.log("🐊 Database connection closed")
          }
          resolve()
        })
      } else {
        resolve()
      }
    })
  }
}

module.exports = DatabaseManager
