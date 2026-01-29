# Anti-Gravity 폴더 구조

```
anti-gravity/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (main)/                   # 메인 레이아웃 그룹
│   │   ├── page.tsx                 # 메인 홈페이지
│   │   ├── layout.tsx               # 메인 레이아웃
│   │   └── 📁 projects/
│   │       └── 📁 [id]/
│   │           └── page.tsx         # 프로젝트 상세
│   │
│   ├── 📁 admin/                    # 관리자 영역
│   │   ├── page.tsx                 # 대시보드
│   │   ├── layout.tsx               # 관리자 레이아웃
│   │   └── 📁 projects/
│   │       ├── page.tsx             # 프로젝트 목록
│   │       ├── 📁 new/
│   │       │   └── page.tsx         # 새 프로젝트
│   │       └── 📁 [id]/
│   │           └── page.tsx         # 프로젝트 편집
│   │
│   ├── 📁 api/                      # API Routes
│   │   ├── 📁 auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts         # NextAuth 핸들러
│   │   ├── 📁 projects/
│   │   │   ├── route.ts             # GET all, POST
│   │   │   └── 📁 [id]/
│   │   │       └── route.ts         # GET, PUT, DELETE
│   │   └── 📁 github/
│   │       └── 📁 readme/
│   │           └── route.ts         # README fetch
│   │
│   ├── globals.css                  # 전역 스타일
│   └── layout.tsx                   # 루트 레이아웃
│
├── 📁 components/                   # 공통 컴포넌트
│   ├── 📁 ui/                       # 기본 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── loading.tsx
│   │
│   ├── 📁 layout/                   # 레이아웃 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── nav.tsx
│   │   └── sidebar.tsx
│   │
│   ├── 📁 auth/                     # 인증 관련
│   │   ├── login-button.tsx
│   │   ├── user-menu.tsx
│   │   └── auth-guard.tsx
│   │
│   ├── 📁 projects/                 # 프로젝트 관련
│   │   ├── project-card.tsx
│   │   ├── project-grid.tsx
│   │   ├── project-detail.tsx
│   │   ├── readme-renderer.tsx
│   │   └── media-gallery.tsx
│   │
│   ├── 📁 editor/                   # Rich Text Editor
│   │   ├── editor.tsx
│   │   ├── toolbar.tsx
│   │   ├── media-uploader.tsx
│   │   └── embed-handler.tsx
│   │
│   └── 📁 effects/                  # 애니메이션/효과
│       ├── parallax-container.tsx
│       ├── floating-element.tsx
│       ├── scroll-reveal.tsx
│       └── hero-animation.tsx
│
├── 📁 lib/                          # 유틸리티 & 설정
│   ├── 📁 supabase/
│   │   ├── client.ts                # Supabase 클라이언트
│   │   ├── server.ts                # 서버 사이드 클라이언트
│   │   └── types.ts                 # DB 타입 정의
│   │
│   ├── 📁 github/
│   │   ├── api.ts                   # GitHub API 함수
│   │   └── parser.ts                # URL 파서
│   │
│   ├── auth.ts                      # NextAuth 설정
│   ├── utils.ts                     # 공통 유틸
│   └── constants.ts                 # 상수 (관리자 목록 등)
│
├── 📁 hooks/                        # 커스텀 훅
│   ├── use-auth.ts
│   ├── use-projects.ts
│   ├── use-scroll.ts
│   └── use-media-upload.ts
│
├── 📁 types/                        # TypeScript 타입
│   ├── project.ts
│   ├── user.ts
│   └── api.ts
│
├── 📁 styles/                       # 추가 스타일
│   └── markdown.css                 # Markdown 렌더링 스타일
│
├── 📁 public/                       # 정적 파일
│   ├── 📁 images/
│   │   └── logo.svg
│   └── 📁 fonts/
│
├── 📁 work-plan/                    # 프로젝트 계획 문서
│   ├── 01-project-overview.md
│   ├── 02-development-roadmap.md
│   ├── 03-folder-structure.md
│   ├── 04-design-system.md
│   └── 05-api-spec.md
│
├── .env.local                       # 환경 변수
├── .env.example                     # 환경 변수 예시
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 폴더 설명

### `/app`
Next.js 14 App Router 기반의 페이지 및 API 라우트

### `/components`
재사용 가능한 React 컴포넌트
- **ui**: 버튼, 카드 등 기본 UI
- **layout**: 헤더, 푸터 등 레이아웃
- **auth**: 인증 관련 컴포넌트
- **projects**: 프로젝트 표시 컴포넌트
- **editor**: Rich Text Editor
- **effects**: 애니메이션 효과

### `/lib`
비즈니스 로직 및 외부 서비스 연동
- **supabase**: 데이터베이스 클라이언트
- **github**: GitHub API 연동

### `/hooks`
React 커스텀 훅

### `/types`
TypeScript 타입 정의

### `/public`
이미지, 폰트 등 정적 파일
