# Anti-Gravity 프로젝트 현황 분석

> 마지막 업데이트: 2026-01-31

## 전체 진행률: 약 75%

---

## Phase별 완료 현황

| Phase | 내용 | 상태 | 진행률 |
|-------|------|------|--------|
| Phase 1 | 프로젝트 초기 설정 | ✅ 완료 | 100% |
| Phase 2 | 인증 시스템 | ✅ 완료 | 100% |
| Phase 3 | 데이터베이스 설계 | ✅ 완료 | 100% |
| Phase 4 | GitHub API 연동 | ✅ 완료 | 100% |
| Phase 5 | 핵심 기능 개발 | ✅ 완료 | 100% |
| Phase 6 | Rich Text Editor | ✅ 완료 | 100% |
| Phase 7 | 애니메이션 & 인터랙션 | ✅ 완료 | 100% |
| Phase 8 | 최적화 & 배포 | ❌ 미시작 | 0% |

---

## 계획 vs 실제 구현 비교

### 폴더 구조

| 계획된 폴더/파일 | 실제 구현 | 상태 |
|-----------------|----------|------|
| `src/app/` 라우팅 | 구현됨 | ✅ |
| `src/components/ui/` | 구현됨 (infinite-scroll, image-picker, category-filter) | ✅ |
| `src/components/layout/` | navbar.tsx만 존재 | 🟡 |
| `src/components/auth/` | 미구현 (page에 inline) | 🟡 |
| `src/components/projects/` | 구현됨 (2개 파일) | ✅ |
| `src/components/editor/` | 구현됨 (rich-text-editor.tsx) | ✅ |
| `src/components/effects/` | 미구현 | 🔴 |
| `src/hooks/` | 구현됨 (use-infinite-projects) | ✅ |
| `src/types/` | 미구현 (lib/supabase/types.ts만 존재) | 🟡 |
| `src/lib/supabase/` | 구현됨 | ✅ |
| `src/lib/github/` | 구현됨 | ✅ |
| `src/app/api/projects/` | 미구현 (Server Actions 사용) | 🟡 |
| `src/app/admin/projects/[id]/` | 구현됨 | ✅ |

### 페이지 구현 현황

| 페이지 | 경로 | 상태 |
|--------|------|------|
| 메인 홈 | `/` | ✅ |
| 프로젝트 상세 | `/projects/[id]` | ✅ |
| 관리자 대시보드 | `/admin` | ✅ |
| 프로젝트 목록 | `/admin/projects` | ✅ |
| 새 프로젝트 | `/admin/projects/new` | ✅ |
| 프로젝트 편집 | `/admin/projects/[id]` | ✅ |

### 기능 구현 현황

| 기능 | 상태 | 비고 |
|------|------|------|
| GitHub OAuth 로그인 | ✅ | NextAuth.js v5 |
| 관리자 권한 체크 | ✅ | Whitelist 방식 |
| 프로젝트 생성 (Create) | ✅ | Server Action |
| 프로젝트 조회 (Read) | ✅ | Supabase 직접 호출 |
| 프로젝트 수정 (Update) | ✅ | Server Action |
| 프로젝트 삭제 (Delete) | ✅ | Server Action |
| GitHub README 자동 fetch | ✅ | 프로젝트 생성 시 |
| Markdown 렌더링 | ✅ | react-markdown |
| 미디어 업로드 | ✅ | Supabase Storage + ImagePicker |
| Rich Text Editor | ✅ | Tiptap (이미지, 영상, 링크 지원) |
| 무한 스크롤 | ✅ | Custom Hook + Intersection Observer |
| 프로젝트 순서 변경 | ✅ | Drag & Drop |
| 카테고리 필터링 | ✅ | 탭 메뉴 + 필터링 |
| 패럴랙스 효과 | ✅ | Framer Motion |
| 페이지 전환 애니메이션 | ✅ | template.tsx |
| README 새로고침 | ✅ | 편집 페이지 |

---

## 구현된 주요 파일 목록

src/
├── app/
│   ├── page.tsx                          # 메인 홈페이지 (무한 스크롤 적용)
│   ├── layout.tsx                        # 루트 레이아웃
│   ├── globals.css                       # 전역 스타일
│   ├── (main)/projects/[id]/page.tsx     # 프로젝트 상세
│   ├── admin/
│   │   ├── page.tsx                      # 관리자 대시보드
│   │   ├── layout.tsx                    # 관리자 레이아웃
│   │   └── projects/
│   │       ├── page.tsx                  # 프로젝트 목록 (편집 버튼 추가)
│   │       ├── new/page.tsx              # 새 프로젝트 (이미지 업로드 추가)
│   │       └── [id]/page.tsx             # 프로젝트 편집 (이미지 업로드 추가)
│   └── api/auth/[...nextauth]/route.ts   # NextAuth 핸들러
├── components/
│   ├── providers.tsx                     # SessionProvider
│   ├── layout/navbar.tsx                 # 네비게이션 바
│   ├── ui/
│   │   ├── image-picker.tsx              # 이미지 업로더
│   │   └── infinite-scroll-trigger.tsx   # 무한 스크롤 트리거
│   └── projects/
│       ├── project-card.tsx              # 프로젝트 카드
│       └── markdown-renderer.tsx         # Markdown 렌더러
├── hooks/
│   └── use-infinite-projects.ts          # 무한 스크롤 훅
└── lib/
    ├── auth.ts                           # NextAuth 설정
    ├── actions.ts                        # Server Actions (uploadThumbnail 추가)
    ├── constants.ts                      # 상수 (관리자 목록)
    ├── supabase/
    │   ├── client.ts                     # 클라이언트 Supabase
    │   ├── server.ts                     # 서버 Supabase
    │   └── types.ts                      # DB 타입
    └── github/
        └── api.ts                        # GitHub API 함수

---

## 남은 작업 (우선순위별)

### 🔴 Critical (즉시 필요)

1. **무한 스크롤 구현**
   - 위치: 메인 페이지 프로젝트 그리드
   - 방식: Intersection Observer 또는 react-infinite-scroll

2. **미디어 업로드 기능**
   - Supabase Storage 연동
   - 프로젝트 썸네일 커스텀 업로드

3. **프로젝트 순서 변경**
   - order_index 필드 활용
   - 드래그 앤 드롭 (선택)

### 🟠 High (곧 필요)

4. **Rich Text Editor 연동**
   - Tiptap 또는 Editor.js
   - custom_content JSONB 필드 활용

5. **YouTube/Vimeo 임베드**
   - 미디어 갤러리 기능

6. **UI 컴포넌트 분리**
   - `src/components/ui/` 폴더 생성
   - button, card, input, modal, loading

7. **페이지 전환 애니메이션**
   - Framer Motion layout animations

8. **패럴랙스/플로팅 효과 강화**
    - 스크롤 기반 인터랙션

### 🟢 Low (나중에)

9. **커스텀 훅 분리**
    - `src/hooks/` 폴더 생성
    - use-auth, use-projects, use-scroll

10. **타입 파일 정리**
    - `src/types/` 폴더 생성
    - project.ts, user.ts, api.ts

11. **Vercel 배포 설정**
    - 환경 변수 설정
    - 도메인 연결

12. **SEO 메타 태그**
    - 각 페이지 metadata export

13. **Rate Limiting**
    - API 요청 제한 (선택)

---

## 최근 완료된 작업 (New)

- **Landing Page Overhaul**: Full Page Scroll (Scroll Snap), Storytelling Sections, Fireworks Effect
- **Team Section**: `TeamCardPremium` 컴포넌트 고도화 (3D Glassmorphism, Flipping Card)
- **Navbar**: Auto-hide interaction on home page
- **Performance**: 폰트 최적화 및 레이아웃 시프트 방지

---

## 다음 스프린트 제안

### Sprint 2: UX 개선 (완료)
- [x] 무한 스크롤
- [x] 로딩 스켈레톤 개선
- [x] 에러 핸들링
- [x] 랜딩 페이지 인터랙션 강화 (Fireworks, Scroll Snap)

### Sprint 3: 미디어 기능 (완료)
- [x] Supabase Storage 설정
- [x] 이미지 업로드
- [x] 썸네일 커스터마이징

### Sprint 4: 배포 (대기)
- [ ] Vercel 배포
- [ ] 환경 변수 설정
