# 🐱 MeowLink

**개발자를 위한 모던 북마크 관리 앱**

*아름다운 디자인으로 소중한 링크를 정리하고 관리하세요*

[![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

---

## 🎯 **MeowLink란?**

MeowLink는 React, TypeScript, Electron으로 제작된 **모던 데스크톱 북마크 관리 앱**입니다. 중요한 웹 리소스를 깔끔하고 효율적으로 정리하고 접근할 수 있도록 개발자를 위해 특별히 설계되었습니다.

> **"완벽한 북마크 도우미 🐱"**

## ✨ **주요 기능**

### 🔗 **스마트 링크 관리**
- **원클릭 저장** - 자동 메타데이터 추출과 함께 링크 추가
- **인라인 메모 편집** - 모달 없이 카드에서 직접 노트 편집
- **스마트 URL 보정** - 편의를 위해 자동으로 https:// 추가
- **파비콘 가져오기** - 각 사이트의 아름다운 시각적 표시
- **제목 최적화** - 일관성을 위한 15자 제목 표시 정리
- **고정 카드 크기** - 균일한 그리드 레이아웃을 위한 일관된 415px 너비
- **해시태그 자동 대문자화** - 일관성을 위해 해시태그 자동 대문자 변환
- **환영 가이드** - 첫 실행 시 데이터베이스 위치 및 백업 설명 다이얼로그

### 🎨 **아름다운 모던 UI**
- **Tailwind CSS + shadcn/ui** - 전문적이고 일관된 디자인 시스템
- **오렌지 테마** (#ff8f00) - 전체적으로 독특한 브랜드 컬러
- **다크/라이트 모드** - 모든 조명 환경에 완벽 대응
- **고정 카드 크기** - 완벽한 그리드 정렬을 위한 정확한 415px × 208px 카드
- **다국어 텍스트 처리** - 영어와 한국어 콘텐츠를 위한 스마트 텍스트 자르기
- **깔끔하고 접근성 높은 디자인** - 글래스모피즘 효과 제거

### 🚀 **개발자 경험**
- **React 18 + TypeScript** - 모던 개발 스택
- **Context API 상태 관리** - 예측 가능한 상태 업데이트
- **IPC 보안** - 프로세스 간 안전한 통신
- **SQLite 로컬 저장소** - 빠르고, 프라이빗하며, 신뢰할 수 있는 데이터 저장
- **실시간 검색** - 모든 북마크에서 즉시 필터링
- **키보드 단축키** - 생각의 속도로 작업
- **중앙집중식 버전 관리** - 앱 버전의 단일 진실 소스

### 🎯 **핵심 기능**
- **북마크 관리** - 링크 추가, 편집, 삭제 및 정리
- **즐겨찾기 시스템** - 중요한 북마크에 별표 표시하여 빠른 접근
- **지능형 태그 시스템** - 자동 대문자 해시태그와 스마트 필터링
- **검색 기능** - 제목, URL, 메모 또는 태그로 북마크 찾기
- **직접 링크 액션** - 전용 버튼으로 별표, 편집, 삭제, 열기
- **일관된 레이아웃** - 고정 크기 카드로 레이아웃 변화 방지 및 시각적 조화 유지
- **데이터베이스 투명성** - 데이터 저장 위치를 항상 알고 백업하는 방법 제공

## 🛠 **기술 스택**

### **프론트엔드**
- **React 18** - 훅을 사용한 모던 UI 라이브러리
- **TypeScript** - 안전한 타입의 JavaScript
- **Tailwind CSS v3** - 유틸리티 우선 CSS 프레임워크
- **shadcn/ui** - 고품질 컴포넌트 라이브러리
- **Lucide React** - 아름답고 일관된 아이콘

### **백엔드**
- **Electron 13** - 크로스 플랫폼 데스크톱 프레임워크
- **Node.js** - JavaScript 런타임
- **SQLite3** - 경량 데이터베이스
- **better-sqlite3** - 고성능 SQLite 바인딩

### **빌드 도구**
- **Webpack 5** - 모듈 번들러
- **PostCSS** - CSS 처리
- **Electron Builder** - 애플리케이션 패키징
- **TypeScript Compiler** - 타입 체크 및 컴파일

## 🚀 **설치 및 개발**

### **필요 조건**
- Node.js 16+
- npm 또는 yarn
- Git

### **개발 환경 설정**
```bash
# 저장소 클론
git clone https://github.com/sangwon0707/meowlink.git
cd meowlink

# 의존성 설치
npm install

# React 컴포넌트 빌드
npm run build-react

# 개발 모드로 실행
npm run dev

# 일반 모드로 앱 시작
npm start
```

### **빌드 명령어**

#### **🚀 프로덕션 빌드 (배포용)**
```bash
# 최종 사용자를 위한 플랫폼별 빌드
npm run build-mac     # → dist/MeowLink-0.1.0.dmg (macOS 설치 파일)
npm run build-win     # → dist/MeowLink Setup 0.1.0.exe (Windows 설치 파일)
npm run build-linux  # → dist/MeowLink-0.1.0.AppImage (Linux 실행 파일)

# 모든 플랫폼용 빌드 (환경이 지원하는 경우)
npm run build

# 빠른 개발 빌드 (macOS)
./scripts/quick-build.sh
```

#### **⚙️ 개발 빌드**
```bash
# React 프론트엔드만 빌드
npm run build-react

# 설치 파일 없이 패키징 (테스트용)
npm run pack
```

#### **📦 배포 파일**
빌드 후 `dist/` 폴더에서 배포 가능한 파일을 찾을 수 있습니다:
- **DMG 파일** - macOS 사용자는 Applications 폴더로 드래그
- **EXE 파일** - Windows 사용자는 설치 프로그램 실행
- **AppImage 파일** - Linux 사용자는 실행 가능하게 만든 후 실행
- **Node.js 불필요** - 최종 사용자는 클릭만 하면 실행!

### **유지보수**
```bash
# 빌드 파일 정리
npm run clean

# 네이티브 모듈 재빌드
npm run rebuild
```

## 📁 **프로젝트 구조**

```
meowlink/
├── main.js                 # Electron 메인 프로세스
├── preload.js             # 보안 IPC 브리지
├── package.json           # 의존성 및 스크립트
├── webpack.config.js      # 빌드 설정
├── tailwind.config.js     # Tailwind CSS 설정
├── postcss.config.js      # PostCSS 설정
│
├── src/                   # React TypeScript 소스
│   ├── index.tsx         # 애플리케이션 진입점
│   ├── App.tsx           # 메인 React 컴포넌트
│   ├── contexts/         # React Context 제공자
│   ├── components/       # React 컴포넌트
│   │   ├── ui/          # shadcn/ui 컴포넌트
│   │   ├── Sidebar.tsx  # GitHub 링크가 있는 네비게이션 사이드바
│   │   ├── LinkCard.tsx # 고정 크기 북마크 카드 (415px)
│   │   └── AddLinkModal.tsx # 자동 대문자 태그 기능이 있는 링크 추가/편집 다이얼로그
│   ├── types/           # TypeScript 정의
│   ├── utils/           # 유틸리티 함수
│   │   └── textUtils.ts # 다국어 텍스트 처리 유틸리티
│   └── styles/          # CSS 및 스타일링
│
├── utils/                # Node.js 유틸리티
│   ├── database-sqlite3.js  # SQLite 작업
│   ├── database-electron.ts # TypeScript 데이터베이스
│   └── scraper.js          # 웹 메타데이터 추출
│
├── build/                # Webpack 빌드 출력
├── dist/                 # Electron 빌더 배포
├── assets/              # 애플리케이션 아이콘
└── scripts/             # 빌드 자동화 스크립트
```

## 🎮 **사용법**

### **첫 실행 경험**
🎊 **환영 다이얼로그** - 첫 실행 시 MeowLink는 친근한 환영 다이얼로그를 표시합니다:
- 북마크 데이터가 로컬에 저장되는 위치 설명
- 시스템의 정확한 데이터베이스 파일 경로 표시
- "Finder에서 보기" 및 "경로 복사" 버튼 제공
- 로컬 저장소의 백업 및 프라이버시 이점 설명

### **기본 작업**
1. **링크 추가** - 오렌지색 "링크 추가" 버튼 클릭 또는 키보드 단축키 사용
2. **메모 편집** - 카드의 메모 영역을 직접 클릭하여 인라인으로 노트 편집
3. **링크 관리** - 각 카드의 액션 버튼(별표, 편집, 삭제, 열기) 사용
4. **검색** - 검색 바에 입력하여 북마크 즉시 필터링
5. **필터** - 사이드바에서 "모든 북마크" 또는 "즐겨찾기" 클릭
6. **데이터베이스 위치** - 메뉴를 통해 접근: MeowLink → 데이터베이스 위치 보기

### **키보드 단축키**
| 단축키 | 동작 |
|----------|--------|
| `⌘+N` / `Ctrl+N` | 새 북마크 추가 |
| `⌘+F` / `Ctrl+F` | 검색 포커스 |
| `Escape` | 모달 닫기/편집 취소 |

### **기능 상세**

#### **인라인 메모 편집**
- 메모 영역을 클릭하여 직접 편집
- 빠른 노트 변경을 위해 전체 편집 모달을 열 필요 없음
- 앱 테마에 맞는 오렌지색 "저장" 버튼
- 변경 사항을 취소하는 "취소" 버튼

#### **스마트 URL 처리**
- 프로토콜이 없는 URL에 자동으로 `https://` 추가
- 무한 슬래시 추가 버그 방지
- 저장 전 URL 유효성 검사

#### **일관된 카드 레이아웃**
- 모든 카드가 균일한 크기(415px × 208px) 유지
- 일관성을 위해 제목을 15자로 자름
- 호버나 편집 시에도 콘텐츠 영역이 이동하지 않음
- 고정된 크기로 완벽한 그리드 정렬

#### **스마트 태그 관리**
- 해시태그 입력 시 자동으로 대문자로 변환
- 기존 태그도 일관성을 위해 대문자로 표시
- 입력 중 시각적 태그 미리보기
- 클릭으로 태그 삭제 가능한 쉬운 인터페이스

### **📁 데이터 관리 및 백업**

#### **데이터베이스 위치**
북마크는 SQLite 데이터베이스에 로컬로 저장됩니다:
- **macOS**: `~/Library/Application Support/MeowLink/meowlink.db`
- **Windows**: `%APPDATA%/MeowLink/meowlink.db` 
- **Linux**: `~/.config/MeowLink/meowlink.db`

#### **쉬운 백업**
1. **메뉴 접근**: MeowLink → 데이터베이스 위치 보기
2. **파일 복사**: `meowlink.db` 파일을 백업 위치로 단순 복사
3. **복원**: 데이터베이스 파일을 교체하여 모든 북마크 복원

#### **프라이버시 장점**
- ✅ **로컬 저장소만** - 클라우드 동기화나 외부 서버 없음
- ✅ **완전한 프라이버시** - 데이터가 컴퓨터를 떠나지 않음
- ✅ **완전한 제어** - 북마크 데이터를 직접 소유하고 관리
- ✅ **빠른 성능** - 네트워크 지연이나 동기화 지연이 없음

## 🎨 **디자인 시스템**

### **색상**
- **기본 오렌지**: #ff8f00 (HSL: 34 100% 50%)
- **오렌지 전경**: 오렌지 배경에 흰색 텍스트
- **오렌지 호버**: #cc7300 (HSL: 34 100% 40%)

### **컴포넌트**
- **카드**: 호버 효과가 있는 고정 415px × 208px 크기
- **버튼**: 오렌지 기본, 고스트 보조, 파괴적 빨강
- **타이포그래피**: 다국어 지원하는 Inter 폰트 패밀리
- **아이콘**: Lucide React, 16px 표준 크기
- **태그**: 일관된 스타일링의 자동 대문자 포맷

### **다크 모드**
- 자동 시스템 감지로 완전 지원
- 사이드바에서 토글 사용 가능
- 적절한 대비율 유지
- 라이트/다크 모드에서 일관된 오렌지 테마

## 🗺 **로드맵**

### **완료됨 ✅**
- [x] React + TypeScript 마이그레이션
- [x] Tailwind CSS + shadcn/ui 통합
- [x] 오렌지 테마 구현 (#ff8f00)
- [x] **고정 카드 크기** - 일관된 415px × 208px 크기
- [x] **해시태그 자동 대문자화** - 자동 태그 포맷팅
- [x] **다국어 텍스트 유틸리티** - 영어/한국어를 위한 스마트 텍스트 자르기
- [x] **GitHub 통합** - 사이드바 헤더에 리포지토리 링크
- [x] 인라인 메모 편집 기능
- [x] 직접 액션 버튼 (드롭다운 없음)
- [x] 오렌지 테마 다크 모드 토글
- [x] URL 보정 알고리즘
- [x] 확인과 함께 삭제 기능
- [x] 검색 및 필터링 시스템
- [x] **환영 다이얼로그** - 첫 실행 데이터베이스 위치 가이드
- [x] **데이터베이스 투명성** - 데이터베이스 위치 메뉴 접근
- [x] **중앙집중식 버전 관리** - 단일 진실 소스 시스템
- [x] **데이터 백업 가이드** - 사용자 친화적 백업 지침

### **계획됨 🚧**
- [ ] **브라우저 확장** - 원클릭 저장을 위한 Chrome/Firefox 확장
- [ ] **가져오기/내보내기** - 북마크 백업 및 복원
- [ ] **고급 검색** - 필터가 있는 전문 검색
- [ ] **벌크 작업** - 여러 북마크 선택하여 작업
- [ ] **키보드 네비게이션** - 완전한 키보드 접근성
- [ ] **사용자 정의 태그** - 고급 태깅 및 정리
- [ ] **분석 대시보드** - 사용 통계 및 인사이트

### **미래 아이디어 💡**
- [ ] **클라우드 동기화** - 선택적 클라우드 백업
- [ ] **팀 공유** - 협업 북마크 컬렉션
- [ ] **API 통합** - 다른 도구와 연결
- [ ] **모바일 앱** - iOS/Android 동반 앱
- [ ] **웹 버전** - 브라우저 기반 접근

## 🤝 **기여하기**

1. 저장소를 **포크**하세요
2. 기능 브랜치를 **생성**하세요 (`git checkout -b feature/amazing-feature`)
3. 변경 사항을 **커밋**하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 **푸시**하세요 (`git push origin feature/amazing-feature`)
5. **Pull Request**를 **열어**주세요

### **개발 가이드라인**
- 기존 TypeScript 패턴을 따르세요
- 스타일링에는 Tailwind CSS를 사용하세요
- shadcn/ui 컴포넌트 일관성을 유지하세요
- 적절한 에러 처리를 추가하세요
- 필요에 따라 문서를 업데이트하세요

## 📄 **라이선스**

이 프로젝트는 **MIT 라이선스** 하에 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 **감사의 말**

- **Electron** - 크로스 플랫폼 데스크톱 프레임워크
- **React** - UI 라이브러리 및 생태계
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **shadcn/ui** - 아름다운 컴포넌트 라이브러리
- **SQLite** - 신뢰할 수 있는 로컬 데이터베이스
- **개발자 커뮤니티** - 영감과 피드백

---

**깔끔하고 효율적인 도구를 사랑하는 개발자들을 위해 🐱으로 만들어졌습니다**

⭐ **유용하다고 생각하시면 이 저장소에 별표를 눌러주세요!**