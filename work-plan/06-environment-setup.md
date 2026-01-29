# Anti-Gravity 환경 설정 가이드

## 1. GitHub OAuth App 생성

### 단계
1. [GitHub Developer Settings](https://github.com/settings/developers) 접속
2. **OAuth Apps** → **New OAuth App** 클릭
3. 정보 입력:
   - **Application name**: Anti-Gravity
   - **Homepage URL**: `http://localhost:3000` (개발) / 실제 도메인 (배포)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. **Register application** 클릭
5. **Client ID** 복사
6. **Generate a new client secret** → **Client Secret** 복사

---

## 2. Supabase 프로젝트 생성

### 단계
1. [Supabase](https://supabase.com) 접속 및 로그인
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: anti-gravity
   - **Database Password**: 안전한 비밀번호 설정
   - **Region**: Northeast Asia (Tokyo) 권장
4. 프로젝트 생성 완료 후:
   - **Settings** → **API** 에서:
     - **Project URL** 복사
     - **anon public** 키 복사
     - **service_role secret** 키 복사

### 테이블 생성 (SQL Editor)
```sql
-- Projects 테이블
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  github_url VARCHAR(500),
  readme_content TEXT,
  custom_content JSONB DEFAULT '{}',
  thumbnail_url VARCHAR(500),
  tags TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(100)
);

-- Media 테이블
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  type VARCHAR(50) DEFAULT 'image',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger 설정
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 인덱스
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_media_project_id ON media(project_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- 읽기 정책 (모든 사용자)
CREATE POLICY "Allow public read" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public read" ON media
  FOR SELECT USING (true);

-- 쓰기 정책은 API에서 service_role로 처리
```

### Storage 버킷 생성
1. **Storage** 메뉴 이동
2. **New Bucket** 클릭
3. 버킷 정보:
   - **Name**: `media`
   - **Public bucket**: 체크

---

## 3. 환경 변수 설정

### `.env.local` 파일 생성
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here  # openssl rand -base64 32

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# GitHub API (Optional - for higher rate limits)
GITHUB_ACCESS_TOKEN=your-github-personal-access-token
```

### `.env.example` 파일 (Git에 포함)
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# GitHub API (Optional)
GITHUB_ACCESS_TOKEN=
```

---

## 4. NEXTAUTH_SECRET 생성

터미널에서 실행:
```bash
openssl rand -base64 32
```
생성된 값을 `NEXTAUTH_SECRET`에 설정

---

## 5. Vercel 배포 시 환경 변수

Vercel 대시보드에서 동일한 환경 변수 설정:
1. **Project Settings** → **Environment Variables**
2. 모든 환경 변수 추가
3. **NEXTAUTH_URL**은 실제 배포 도메인으로 변경:
   - `https://your-domain.vercel.app`

---

## 6. GitHub OAuth Callback URL 업데이트

배포 후 GitHub OAuth App 설정에서:
- **Authorization callback URL** 업데이트:
  - `https://your-domain.vercel.app/api/auth/callback/github`

---

## 체크리스트

- [ ] GitHub OAuth App 생성 완료
- [ ] GitHub Client ID / Secret 확보
- [ ] Supabase 프로젝트 생성 완료
- [ ] Supabase URL / Keys 확보
- [ ] 데이터베이스 테이블 생성 완료
- [ ] Storage 버킷 생성 완료
- [ ] `.env.local` 파일 설정 완료
- [ ] NEXTAUTH_SECRET 생성 완료
