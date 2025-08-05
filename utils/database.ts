// Electron 환경에서 사용할 SQLite 데이터베이스 유틸리티
// npm install better-sqlite3 @types/better-sqlite3 필요

import Database from "better-sqlite3"
import path from "path"
import { app } from "electron"

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

class DatabaseManager {
  private db: Database.Database
  private static instance: DatabaseManager

  constructor() {
    // Electron 앱 데이터 디렉토리에 데이터베이스 파일 생성
    const dbPath = path.join(app.getPath("userData"), "meowlink.db")
    this.db = new Database(dbPath)
    this.initDatabase()
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
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
        tags TEXT, -- JSON 문자열로 저장
        created_at TEXT NOT NULL,
        reminder_date TEXT,
        is_favorite INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0
      )
    `

    // 인덱스 생성 (검색 성능 향상)
    const createIndexes = [
      "CREATE INDEX IF NOT EXISTS idx_links_domain ON links(domain)",
      "CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at)",
      "CREATE INDEX IF NOT EXISTS idx_links_is_favorite ON links(is_favorite)",
      "CREATE INDEX IF NOT EXISTS idx_links_reminder_date ON links(reminder_date)",
    ]

    this.db.exec(createLinksTable)
    createIndexes.forEach((index) => this.db.exec(index))

    console.log("Database initialized successfully")
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

      return {
        id: result.lastInsertRowid as number,
        ...link,
      }
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
      ORDER BY created_at DESC
    `)

    const searchTerm = `%${query}%`
    const rows = stmt.all(searchTerm, searchTerm, searchTerm)
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
    return result.changes > 0
  }

  // 태그별 통계
  getTagStats(): { tag: string; count: number }[] {
    const links = this.getAllLinks()
    const tagCounts = new Map<string, number>()

    links.forEach((link) => {
      link.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
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

  // 데이터베이스 백업
  backup(backupPath: string): void {
    this.db.backup(backupPath)
  }

  // 데이터베이스 연결 종료
  close(): void {
    this.db.close()
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
}

export default DatabaseManager
