// URL 자동 수정 함수 - 간단하고 안전한 버전
export function correctUrl(url: string): string {
  if (!url) return url

  // 공백 제거
  url = url.trim()

  // 이미 https:// 또는 http://로 시작하는 경우 그대로 반환
  if (url.startsWith('https://') || url.startsWith('http://')) {
    return url
  }

  // 프로토콜이 없는 경우 https:// 추가
  // 도메인처럼 보이는 경우 (점이 포함되고 공백이 없는 경우)
  if (url.includes('.') && !url.includes(' ')) {
    return `https://${url}`
  }

  // 그 외의 경우는 원본 그대로 반환
  return url
}

// GitHub URL인지 확인
export function isGitHubUrl(url: string): boolean {
  return url.includes('github.com') && !url.includes('github.com/orgs')
}

// GitHub URL에서 사용자명 추출
export function extractGitHubUsername(url: string): string | null {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === 'github.com' || urlObj.hostname === 'www.github.com') {
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0)
      
      // GitHub 사용자 프로필: github.com/username
      // GitHub 리포지토리: github.com/username/repo
      if (pathParts.length >= 1) {
        const username = pathParts[0]
        // 특수 경로들 제외
        const excludedPaths = [
          'settings', 'notifications', 'pulls', 'issues', 'explore', 'topics', 
          'collections', 'events', 'marketplace', 'pricing', 'nonprofit', 
          'customer-stories', 'security', 'team', 'enterprise', 'features', 
          'git-guides', 'resources', 'roadmap', 'compare-plans', 'sponsors', 
          'advisors', 'about', 'blog', 'careers', 'press', 'shop', 'contact', 
          'privacy', 'terms', 'support', 'docs'
        ]
        
        if (!excludedPaths.includes(username)) {
          return username
        }
      }
    }
  } catch (error) {
    console.log('GitHub username 추출 실패:', error)
  }
  return null
}

// 고해상도 파비콘 URL 생성
export function getFaviconUrl(domain: string, url: string = ''): string {
  // GitHub 링크인지 확인
  if (isGitHubUrl(url)) {
    const githubUsername = extractGitHubUsername(url)
    if (githubUsername) {
      return `https://github.com/${githubUsername}.png?size=256`
    }
  }
  
  // 특별한 사이트들에 대한 고해상도 아이콘 직접 링크
  const specialIcons: { [key: string]: string } = {
    'youtube.com': 'https://www.youtube.com/s/desktop/f506bd45/img/favicon_144x144.png',
    'twitter.com': 'https://abs.twimg.com/favicons/twitter.2.ico',
    'x.com': 'https://abs.twimg.com/favicons/twitter.2.ico',
    'facebook.com': 'https://static.xx.fbcdn.net/rsrc.php/yb/r/hLRJ1GG_y0J.ico',
    'instagram.com': 'https://static.cdninstagram.com/rsrc.php/v3/yx/r/tBxa1Y9-Ql9.png',
    'linkedin.com': 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
    'reddit.com': 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-180x180.png',
    'stackoverflow.com': 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon@2.png',
    'discord.com': 'https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png',
    'slack.com': 'https://a.slack-edge.com/80588/marketing/img/meta/slack_hash_256.png'
  }
  
  // 특별한 사이트인 경우 고해상도 아이콘 사용
  if (specialIcons[domain]) {
    return specialIcons[domain]
  }
  
  // 기본적으로 DuckDuckGo favicon API 사용 (고해상도 지원)
  return `https://external-content.duckduckgo.com/ip3/${domain}.ico`
}