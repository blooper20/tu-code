# Anti-Gravity 프로젝트 계획서

> 개발자 팀원들의 성과물을 가장 감각적으로 보여주는 GitHub 연동 포트폴리오 아카이빙 플랫폼

---

## 문서 목록

| 번호 | 문서 | 설명 |
|------|------|------|
| 01 | [프로젝트 개요](./01-project-overview.md) | 비전, 핵심 가치, 기술 스택, 주요 기능 |
| 02 | [개발 로드맵](./02-development-roadmap.md) | Phase별 개발 계획 및 태스크 |
| 03 | [폴더 구조](./03-folder-structure.md) | 프로젝트 디렉토리 구조 |
| 04 | [디자인 시스템](./04-design-system.md) | 컬러, 타이포그래피, 컴포넌트 스타일 |
| 05 | [API 명세서](./05-api-spec.md) | REST API 엔드포인트 및 스펙 |
| 06 | [환경 설정 가이드](./06-environment-setup.md) | GitHub OAuth, Supabase, 환경 변수 설정 |

---

## 빠른 시작

### 1. 프로젝트 초기화
```bash
npx create-next-app@latest anti-gravity --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd anti-gravity
```

### 2. 필수 패키지 설치
```bash
# Auth
npm install next-auth@beta

# Database
npm install @supabase/supabase-js

# Markdown
npm install react-markdown remark-gfm rehype-highlight

# Animation
npm install framer-motion

# Editor (선택)
npm install @tiptap/react @tiptap/starter-kit

# Icons
npm install lucide-react

# Utils
npm install clsx tailwind-merge
```

### 3. 환경 변수 설정
[환경 설정 가이드](./06-environment-setup.md) 참고

### 4. 개발 서버 실행
```bash
npm run dev
```

---

## 개발 우선순위

```
🔴 Critical (먼저 완료)
├── Phase 1: 프로젝트 초기 설정
├── Phase 2: 인증 시스템
├── Phase 3: 데이터베이스
└── Phase 8: 배포

🟠 High (핵심 기능)
├── Phase 4: GitHub API 연동
└── Phase 5: 핵심 기능 개발

🟡 Medium (추가 기능)
├── Phase 6: Rich Text Editor
└── Phase 7: 애니메이션
```

---

## 주요 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 14 (App Router) | SSR, API Routes, 최신 기능 |
| 스타일링 | Tailwind CSS | 빠른 개발, 일관된 디자인 |
| 애니메이션 | Framer Motion | React 최적화, 선언적 API |
| 인증 | NextAuth.js v5 | GitHub OAuth 특화 |
| DB | Supabase | PostgreSQL + 실시간 + Storage |
| 배포 | Vercel | Next.js 최적화, 자동 배포 |

---

## 관리자 화이트리스트

현재 지정된 관리자:
- `blooper20`

추가 관리자는 `lib/constants.ts`에서 관리

---

## 다음 단계

1. 이 계획서를 검토하고 수정 사항 확인
2. GitHub OAuth App 생성
3. Supabase 프로젝트 생성
4. 개발 시작!

---

*이 문서는 개발 진행에 따라 업데이트됩니다.*
