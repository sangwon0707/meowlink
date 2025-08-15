/**
 * LEGACY CODE - DO NOT USE
 * 
 * This file is an unused alternative database implementation using better-sqlite3.
 * The active implementation is in utils/database-sqlite3.js which uses the sqlite3 package.
 * 
 * This file exists for reference only and is not imported or used anywhere in the codebase.
 * It has been added to .gitignore to prevent accidental commits.
 * 
 * @deprecated Use utils/database-sqlite3.js instead
 */

/*
// Electron 환경에서 동작하는 SQLite 데이터베이스 매니저
import Database from "better-sqlite3"
import path from "path"

export interface LinkItem {
  id?: number
  url: string
  title: string
  domain: string
  favicon: string
  memo: string
  tags: string[]
  created_at: string
  reminder_date?: string
  is_favorite: boolean
  is_completed: boolean
}

class ElectronDatabaseManager {
  private db: Database.Database
  private static instance: ElectronDatabaseManager

  constructor() {
    // Electron userData 디렉토리에 데이터베이스 생성
    const userDataPath = window.electronAPI?.getUserDataPath?.() || "./data"
    const dbPath = path.join(userDataPath, "meowlink.db")

    this.db = new Database(dbPath)
    this.initDatabase()

    console.log(`🐊 Database initialized at: ${dbPath}`)
  }

  static getInstance(): ElectronDatabaseManager {
    if (!ElectronDatabaseManager.instance) {
      ElectronDatabaseManager.instance = new ElectronDatabaseManager()
    }
    return ElectronDatabaseManager.instance
  }

  private initDatabase(): void {
    // links 테이블 생성
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

    // 인덱스 생성
    const createIndexes = [
      "CREATE INDEX IF NOT EXISTS idx_links_domain ON links(domain)",
      "CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at)",
      "CREATE INDEX IF NOT EXISTS idx_links_is_favorite ON links(is_favorite)",
      "CREATE INDEX IF NOT EXISTS idx_links_reminder_date ON links(reminder_date)",
      "CREATE INDEX IF NOT EXISTS idx_links_tags ON links(tags)",
    ]

    this.db.exec(createLinksTable)
    createIndexes.forEach((index) => this.db.exec(index))
  }

  // 링크 추가
  addLink(link: Omit<LinkItem, "id">): LinkItem {
    const stmt = this.db.prepare(`
      INSERT INTO links (
        url, title, domain, favicon, memo, tags, 
        created_at, reminder_date, is_favorite, is_completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    try {
      const result = stmt.run(
        link.url,
        link.title,
        link.domain,
        link.favicon,
        link.memo,
        JSON.stringify(link.tags),
        link.created_at,
        link.reminder_date || null,
        link.is_favorite ? 1 : 0,
        link.is_completed ? 1 : 0,
      )

      const newLink = {
        id: result.lastInsertRowid as number,
        ...link,
      }

      // Electron 알림 표시
      if (window.electronAPI) {
        window.electronAPI.showNotification("Link Added! 🐊", `"${link.title}" has been saved to your collection`)
      }

      return newLink
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new Error("This URL has already been saved")
      }
      throw error
    }
  }

  // 모든 링크 조회
  getAllLinks(): LinkItem[] {
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      ORDER BY created_at DESC
    `)

    const rows = stmt.all()
    return rows.map(this.mapRowToLink)
  }

  // 링크 검색
  searchLinks(query: string): LinkItem[] {
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      WHERE title LIKE ? OR memo LIKE ? OR tags LIKE ?
      ORDER BY 
        CASE 
          WHEN title LIKE ? THEN 1
          WHEN memo LIKE ? THEN 2
          ELSE 3
        END,
        created_at DESC
    `)

    const searchTerm = `%${query}%`
    const rows = stmt.all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
    return rows.map(this.mapRowToLink)
  }

  // 필터별 링크 조회
  getLinksByFilter(filter: string): LinkItem[] {
    let stmt: Database.Statement

    switch (filter) {
      case "favorites":
        stmt = this.db.prepare("SELECT * FROM links WHERE is_favorite = 1 ORDER BY created_at DESC")
        break
      case "reminders":
        stmt = this.db.prepare(`
          SELECT * FROM links 
          WHERE reminder_date IS NOT NULL AND is_completed = 0 
          ORDER BY reminder_date ASC
        `)
        break
      case "completed":
        stmt = this.db.prepare("SELECT * FROM links WHERE is_completed = 1 ORDER BY created_at DESC")
        break
      default:
        return this.getAllLinks()
    }

    const rows = stmt.all()
    return rows.map(this.mapRowToLink)
  }

  // 링크 업데이트
  updateLink(id: number, updates: Partial<LinkItem>): boolean {
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

    const stmt = this.db.prepare(`
      UPDATE links SET ${fields.join(", ")} WHERE id = ?
    `)

    const result = stmt.run(...values)
    return result.changes > 0
  }

  // 링크 삭제
  deleteLink(id: number): boolean {
    const stmt = this.db.prepare("DELETE FROM links WHERE id = ?")
    const result = stmt.run(id)

    if (result.changes > 0 && window.electronAPI) {
      window.electronAPI.showNotification("Link Deleted", "Link has been removed from your collection")
    }

    return result.changes > 0
  }

  // 복습 예정 링크들
  getUpcomingReminders(): LinkItem[] {
    const today = new Date().toISOString().split("T")[0]
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      WHERE reminder_date <= ? AND is_completed = 0
      ORDER BY reminder_date ASC
    `)

    const rows = stmt.all(today)
    return rows.map(this.mapRowToLink)
  }

  // 통계 정보
  getStats() {
    const totalLinks = this.db.prepare("SELECT COUNT(*) as count FROM links").get().count
    const favoriteLinks = this.db.prepare("SELECT COUNT(*) as count FROM links WHERE is_favorite = 1").get().count
    const pendingReminders = this.db
      .prepare("SELECT COUNT(*) as count FROM links WHERE reminder_date IS NOT NULL AND is_completed = 0")
      .get().count

    return {
      total: totalLinks,
      favorites: favoriteLinks,
      reminders: pendingReminders,
    }
  }

  // 데이터베이스 행을 LinkItem 객체로 변환
  private mapRowToLink(row: any): LinkItem {
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

  // 데이터베이스 연결 종료
  close(): void {
    this.db.close()
  }
}

export default ElectronDatabaseManager
*/
