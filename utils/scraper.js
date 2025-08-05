// 안정적인 웹 스크래핑 유틸리티
const axios = require("axios")
const cheerio = require("cheerio")

// 메타데이터 추출
async function extractMetadata(url) {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // 기본 파비콘 URL
    const defaultFavicon = `https://www.google.com/s2/favicons?domain=${domain}`

    try {
      // 페이지 HTML 가져오기 (타임아웃과 에러 처리 강화)
      const response = await axios.get(url, {
        timeout: 8000,
        maxRedirects: 3,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        validateStatus: (status) => {
          return status >= 200 && status < 400 // 리다이렉트도 허용
        },
      })

      const $ = cheerio.load(response.data)

      // 제목 추출 (우선순위: og:title > title > URL)
      let title =
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").text().trim()

      if (!title || title.length === 0) {
        title = domain
      }

      // 제목 정리 (길이 제한 및 특수문자 처리)
      title = title.substring(0, 200).trim()

      // 설명 추출
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        $('meta[name="twitter:description"]').attr("content")

      // 파비콘 추출
      let favicon = defaultFavicon
      const faviconLink =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="apple-touch-icon"]').attr("href")

      if (faviconLink) {
        try {
          favicon = faviconLink.startsWith("http") ? faviconLink : new URL(faviconLink, url).href
        } catch {
          favicon = defaultFavicon
        }
      }

      return {
        title,
        description: description?.substring(0, 500),
        favicon,
        domain,
      }
    } catch (scrapeError) {
      console.warn("Failed to scrape metadata:", scrapeError.message)

      // 스크래핑 실패 시 기본값 반환
      return {
        title: domain,
        favicon: defaultFavicon,
        domain,
      }
    }
  } catch (urlError) {
    throw new Error("Invalid URL provided")
  }
}

// GitHub URL 특별 처리
function isGitHubUrl(url) {
  return url.includes("github.com")
}

function extractGitHubInfo(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
    }
  }
  return null
}

// YouTube URL 특별 처리
function isYouTubeUrl(url) {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

module.exports = {
  extractMetadata,
  isGitHubUrl,
  extractGitHubInfo,
  isYouTubeUrl,
  extractYouTubeId,
}
