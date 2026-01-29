# Anti-Gravity 프로젝트 개요

## 프로젝트 비전
**"개발자 팀원들의 성과물을 가장 감각적으로 보여주는 GitHub 연동 포트폴리오 아카이빙 플랫폼"**

중력을 거스르는(Anti-Gravity) 컨셉으로, 단순한 프로젝트 리스트업을 넘어 **'보는 재미'**가 있는 포트폴리오 페이지를 구현합니다.

---

## 핵심 가치
1. **자동화** - GitHub README 기반 프로젝트 페이지 자동 생성
2. **시각적 임팩트** - 패럴랙스 스크롤, 플로팅 애니메이션
3. **자유도** - 미디어 커스터마이징 (이미지, GIF, 영상)
4. **접근 제어** - GitHub OAuth + 관리자 화이트리스트

---

## 기술 스택

| 구분 | 기술 | 선정 이유 |
|------|------|-----------|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG, SEO 최적화, React Server Components |
| **Styling** | Tailwind CSS + Framer Motion | 빠른 개발, 부드러운 애니메이션 |
| **Auth** | NextAuth.js v5 | GitHub OAuth 최적화 |
| **Database** | Supabase (PostgreSQL) | 실시간 데이터, 무료 티어 |
| **Storage** | Supabase Storage | 미디어 파일 저장 |
| **Deployment** | Vercel | GitHub 연동 자동 배포 |

---

## 주요 기능

### 1. 인증 시스템
- GitHub OAuth 로그인
- 관리자 화이트리스트 (지정된 GitHub ID만 CRUD 권한)

### 2. 프로젝트 관리
- GitHub Repository URL 입력 → README.md 자동 파싱
- Markdown → HTML 변환 (예쁜 레이아웃)
- 프로젝트 CRUD (관리자 전용)

### 3. 미디어 커스터마이징
- Rich Text Editor (Tiptap 또는 Editor.js)
- 이미지/GIF 드래그 앤 드롭 업로드
- YouTube/Vimeo 영상 임베드

### 4. UI/UX
- 다크 모드 기반 (Deep Charcoal/Black)
- 네온 퍼플/일렉트릭 블루 포인트 컬러
- 무한 스크롤 + 패럴랙스 효과
- 플로팅 애니메이션 (중력을 거스르는 느낌)

---

## 페이지 구조

```
/                    # 메인 홈 (팀 로고 + 프로젝트 리스트)
/projects/[id]       # 프로젝트 상세 페이지
/admin               # 관리자 대시보드
/admin/projects/new  # 새 프로젝트 추가
/admin/projects/[id] # 프로젝트 편집
/api/auth/*          # NextAuth 인증 API
/api/projects/*      # 프로젝트 CRUD API
/api/github/*        # GitHub API 연동
```
