// Electron 메인 프로세스에서 실행할 데이터베이스 설정 스크립트
const { app } = require("electron")
const DatabaseManager = require("../utils/database").default

// 앱이 준비되면 데이터베이스 초기화
app.whenReady().then(() => {
  try {
    const db = DatabaseManager.getInstance()
    console.log("✅ Database initialized successfully")

    // 앱 종료 시 데이터베이스 연결 정리
    app.on("before-quit", () => {
      db.close()
      console.log("🐊 See you later, Elegator!")
    })
  } catch (error) {
    console.error("❌ Failed to initialize database:", error)
  }
})

// 복습 알림 스케줄러
function scheduleReminders() {
  const db = DatabaseManager.getInstance()
  const upcomingReminders = db.getUpcomingReminders()

  upcomingReminders.forEach((link) => {
    // macOS 알림 생성
    const { Notification } = require("electron")

    if (Notification.isSupported()) {
      const notification = new Notification({
        title: "🐊 Elegator Reminder",
        body: `Time to review: ${link.title}`,
        silent: false,
      })

      notification.on("click", () => {
        // 링크 열기 또는 앱 포커스
        require("electron").shell.openExternal(link.url)
      })

      notification.show()
    }
  })
}

// 매일 오전 9시에 복습 알림 체크
setInterval(() => {
  const now = new Date()
  if (now.getHours() === 9 && now.getMinutes() === 0) {
    scheduleReminders()
  }
}, 60000) // 1분마다 체크

module.exports = { scheduleReminders }
