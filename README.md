<p align="center">
  <img src="public/logo.png" alt="Tucode Pamoja Logo" width="120" height="120" />
</p>

<h1 align="center">Tucode Pamoja</h1>

<p align="center">
  <strong>Code Together, Vibe Forever</strong>
</p>

<p align="center">
  '함께'라는 가치 아래 모여 코드로 소통하고 성장의 온기를 나누는 팀,<br/>
  우리의 모든 발자취를 이곳에 기록합니다.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## Features

### For Visitors
- **Project Showcase** - 팀의 프로젝트를 감각적인 카드 UI로 탐색
- **Category Filtering** - Web, App, AI, Game 등 카테고리별 필터링
- **Infinite Scroll** - 끊김 없는 스크롤 경험
- **Project Details** - GitHub README 자동 렌더링 + 커스텀 컨텐츠
- **Team Introduction** - 팀원 소개 (3D Glassmorphism 카드)

### For Admins
- **GitHub OAuth** - GitHub 계정으로 간편 로그인
- **Project CRUD** - 프로젝트 생성, 수정, 삭제
- **GitHub Integration** - Repository URL 입력 시 README 자동 fetch
- **Rich Text Editor** - Tiptap 기반 에디터 (이미지, 영상, 링크 지원)
- **Media Upload** - Supabase Storage를 통한 이미지 업로드
- **Drag & Drop Sorting** - 프로젝트 순서 변경
- **Team Management** - 팀원 정보 관리

### UI/UX
- **Dark Theme** - 감각적인 다크 모드 디자인
- **Full Page Scroll** - Scroll Snap 기반 랜딩 페이지
- **Animations** - Framer Motion 페이지 전환 & 인터랙션
- **Responsive** - 모바일, 태블릿, 데스크톱 대응

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Auth** | [NextAuth.js v5](https://authjs.dev/) + GitHub Provider |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Storage** | Supabase Storage |
| **Editor** | [Tiptap](https://tiptap.dev/) |
| **Drag & Drop** | [dnd-kit](https://dndkit.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Markdown** | react-markdown + rehype-highlight |

---

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm or yarn or pnpm
- Supabase account
- GitHub OAuth App

### Environment Variables

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub API (Optional - for higher rate limits)
GITHUB_ACCESS_TOKEN=your-github-token
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tu-code.git
cd tu-code

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Database Setup

Supabase에서 다음 테이블을 생성하세요:

```sql
-- projects 테이블
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  github_url VARCHAR(500),
  website_url VARCHAR(500),
  readme_content TEXT,
  custom_content TEXT,
  thumbnail_url VARCHAR(500),
  category VARCHAR(50) DEFAULT 'Web',
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100)
);

-- team_members 테이블
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  github_url VARCHAR(500),
  profile_image VARCHAR(500),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- media 테이블 (선택)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── projects/                 # Projects list
│   ├── team/                     # Team page
│   ├── (main)/projects/[id]/     # Project detail
│   ├── admin/                    # Admin dashboard
│   │   ├── projects/             # Project management
│   │   └── team/                 # Team management
│   └── api/auth/                 # NextAuth API
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── projects/                 # Project-related components
│   ├── team/                     # Team-related components
│   ├── editor/                   # Rich text editor
│   ├── admin/                    # Admin components
│   └── layout/                   # Layout components
├── hooks/                        # Custom React hooks
└── lib/
    ├── auth.ts                   # NextAuth configuration
    ├── actions.ts                # Server Actions
    ├── supabase/                 # Supabase clients
    └── github/                   # GitHub API utilities
```

---

## Admin Access

관리자 권한은 `src/lib/constants.ts`의 whitelist로 관리됩니다:

```typescript
export const ADMIN_WHITELIST = [
  'your-github-username',
  // Add more admin GitHub IDs
];
```

---

## Deployment

### Vercel (Recommended)

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 환경 변수 설정
3. GitHub OAuth 앱의 callback URL 업데이트:
   - `https://your-domain.vercel.app/api/auth/callback/github`
4. 배포

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret
# ... 나머지 환경 변수
```

---

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Made with passion by <strong>Tucode Pamoja</strong>
</p>
 
