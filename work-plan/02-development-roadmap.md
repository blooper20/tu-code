# Anti-Gravity 개발 로드맵

## Phase 1: 프로젝트 초기 설정 🏗️

### 1.1 개발 환경 구축
- [ ] Next.js 14 프로젝트 생성 (App Router)
- [ ] Tailwind CSS 설정
- [ ] ESLint + Prettier 설정
- [ ] 폴더 구조 설계

### 1.2 디자인 시스템 구축
- [ ] 컬러 팔레트 정의 (다크 테마)
  - Background: `#0a0a0f`, `#121218`
  - Primary: `#8b5cf6` (네온 퍼플)
  - Accent: `#3b82f6` (일렉트릭 블루)
  - Text: `#ffffff`, `#a1a1aa`
- [ ] 타이포그래피 설정
- [ ] 공통 컴포넌트 스켈레톤

### 1.3 외부 서비스 설정
- [ ] GitHub OAuth App 생성
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정 (.env.local)

---

## Phase 2: 인증 시스템 🔐

### 2.1 NextAuth.js 설정
- [ ] NextAuth.js v5 설치 및 설정
- [ ] GitHub Provider 연동
- [ ] Session 관리 설정

### 2.2 관리자 권한 시스템
- [ ] 관리자 화이트리스트 정의
- [ ] 권한 체크 미들웨어 작성
- [ ] 보호된 API 라우트 설정

### 2.3 인증 UI
- [ ] 로그인 버튼 컴포넌트
- [ ] 사용자 아바타/메뉴
- [ ] 로그인/로그아웃 플로우

---

## Phase 3: 데이터베이스 설계 💾

### 3.1 Supabase 스키마 설계
```sql
-- projects 테이블
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  github_url VARCHAR(500),
  readme_content TEXT,
  custom_content JSONB,
  thumbnail_url VARCHAR(500),
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100)
);

-- media 테이블
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  type VARCHAR(50), -- image, gif, video
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 Supabase 클라이언트 설정
- [ ] Supabase SDK 설치
- [ ] 클라이언트 초기화
- [ ] TypeScript 타입 생성

---

## Phase 4: GitHub API 연동 🐙

### 4.1 README 자동 가져오기
- [ ] GitHub REST API 클라이언트 설정
- [ ] Repository URL 파싱
- [ ] README.md 콘텐츠 fetch
- [ ] Repository 메타데이터 가져오기

### 4.2 Markdown 변환
- [ ] Markdown → HTML 변환 (react-markdown)
- [ ] 코드 하이라이팅 (rehype-highlight)
- [ ] 커스텀 스타일링

---

## Phase 5: 핵심 기능 개발 ⚡

### 5.1 메인 페이지
- [ ] 히어로 섹션 (팀 로고 + 타이틀)
- [ ] 프로젝트 그리드/리스트
- [ ] 무한 스크롤 구현
- [ ] 패럴랙스 효과

### 5.2 프로젝트 상세 페이지
- [ ] README 콘텐츠 렌더링
- [ ] 미디어 갤러리
- [ ] 프로젝트 메타 정보

### 5.3 관리자 대시보드
- [ ] 프로젝트 목록 관리
- [ ] 새 프로젝트 추가 폼
- [ ] 프로젝트 편집 페이지

---

## Phase 6: Rich Text Editor 📝

### 6.1 에디터 설정
- [ ] Tiptap 또는 Editor.js 설치
- [ ] 기본 편집 기능 (텍스트, 헤딩, 리스트)
- [ ] Markdown 지원

### 6.2 미디어 기능
- [ ] 이미지 업로드 (Supabase Storage)
- [ ] GIF 지원
- [ ] YouTube/Vimeo 임베드
- [ ] 드래그 앤 드롭

---

## Phase 7: 애니메이션 & 인터랙션 ✨

### 7.1 Framer Motion 설정
- [ ] 페이지 전환 애니메이션
- [ ] 스크롤 기반 애니메이션
- [ ] Hover 효과

### 7.2 Anti-Gravity 효과
- [ ] 플로팅 요소 애니메이션
- [ ] 패럴랙스 레이어
- [ ] 마우스 인터랙션

---

## Phase 8: 최적화 & 배포 🚀

### 8.1 성능 최적화
- [ ] 이미지 최적화 (next/image)
- [ ] 코드 스플리팅
- [ ] SEO 메타 태그

### 8.2 Vercel 배포
- [ ] GitHub Repository 연결
- [ ] 환경 변수 설정
- [ ] 도메인 설정 (선택)

### 8.3 QA & 버그 수정
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 반응형 확인
- [ ] 최종 버그 수정

---

## 마일스톤 요약

| Phase | 목표 | 우선순위 |
|-------|------|----------|
| 1 | 프로젝트 초기 설정 | 🔴 Critical |
| 2 | 인증 시스템 | 🔴 Critical |
| 3 | 데이터베이스 | 🔴 Critical |
| 4 | GitHub API | 🟠 High |
| 5 | 핵심 기능 | 🟠 High |
| 6 | Rich Text Editor | 🟡 Medium |
| 7 | 애니메이션 | 🟡 Medium |
| 8 | 배포 | 🔴 Critical |
