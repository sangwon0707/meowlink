
# 📘 AI에게 의미 있는 프론트엔드 코드를 작성하게 하기 위한 방침 문서

## 🔧 기술 스택
- React (최신 버전)
- Tailwind CSS (단, 스타일 전용으로만 사용)

---

## 🎯 전제 방침
아래의 코딩 규칙을 반드시 지켜서 프론트엔드를 개발할 것.  
코드는 깔끔하고, 의미 있는 구조와 이름으로 작성되어야 하며, 이후 백엔드와의 연동까지 고려된 형태여야 함.

---

## ✅ 1. 의미 있는 변수명과 함수명
- 역할, 용도, 그룹이 드러나게 지을 것
- `data`, `temp`, `x` 같은 추상적 이름 사용 금지  
- 상태 변수 예: `userName`, `isLoading`, `loginFormData`
- 함수 예: `handleSubmitLoginForm`, `fetchUserProfile` (동사+행위 구조)

---

## ✅ 2. TailwindCSS는 스타일 전용
- Tailwind 클래스는 오직 시각적 표현만 담당
- 역할, 의미, 상태 등은 `className`, `id`, 컴포넌트 구조로 표현
- 복잡한 Tailwind 클래스는 변수로 정리

---

## ✅ 3. 시멘틱 태그 우선 사용
- `<div>`를 남용하지 말고 의미 있는 태그 사용:
  - `<form>`, `<label>`, `<input>`, `<button>`, `<section>`, `<article>` 등
- 접근성까지 고려된 구조로 작성

---

## ✅ 4. Form 요소는 구조적으로 정확하게 작성
- 각 `input`, `select`, `textarea`에 반드시 `name`, `value`, `onChange` 지정
- 폼 전체를 객체로 관리 (`useState`, `react-hook-form` 등)
- 백엔드 전송 시 JSON 형태로 바로 보낼 수 있도록 구성

---

## ✅ 5. 반복되는 구조는 컴포넌트화
- 동일한 UI/입력 폼이 반복된다면 컴포넌트로 추출
- props도 명확히 작성

---

## ✅ 6. 상태와 로직 분리
- `useState`, `useEffect`, `useCallback` 등은 역할별로 분리
- fetch/axios 요청은 `api` 또는 `services` 모듈로 관리

---

## ✅ 7. 그룹 기반 네이밍 통일 예시
```ts
// login 관련 상태 변수
const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");

// 관련 함수
const handleLoginSubmit = () => { ... };
```

---

## 🧠 한 줄 요약
**"의미 있는 이름, 역할 중심 구조, Tailwind는 스타일만, 백엔드 연동 고려된 폼 구성, 컴포넌트화와 상태 분리까지 포함해서 작성해줘."**
