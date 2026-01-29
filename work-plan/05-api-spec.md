# Anti-Gravity API 명세서

## 인증 (Authentication)

### NextAuth.js Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/auth/[...nextauth]` | NextAuth.js 핸들러 |
| GET | `/api/auth/session` | 현재 세션 정보 |
| GET | `/api/auth/providers` | 사용 가능한 인증 제공자 |

---

## 프로젝트 API

### GET /api/projects
모든 프로젝트 목록 조회

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "프로젝트 이름",
      "description": "프로젝트 설명",
      "github_url": "https://github.com/user/repo",
      "thumbnail_url": "https://...",
      "tags": ["React", "TypeScript"],
      "is_featured": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/projects/:id
특정 프로젝트 상세 조회

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "프로젝트 이름",
    "description": "프로젝트 설명",
    "github_url": "https://github.com/user/repo",
    "readme_content": "# README 내용...",
    "custom_content": {
      "blocks": [...]
    },
    "thumbnail_url": "https://...",
    "tags": ["React", "TypeScript"],
    "is_featured": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "created_by": "github_username",
    "media": [
      {
        "id": "uuid",
        "url": "https://...",
        "type": "image"
      }
    ]
  }
}
```

### POST /api/projects
새 프로젝트 생성 (관리자 전용)

**Request:**
```json
{
  "title": "프로젝트 이름",
  "description": "프로젝트 설명",
  "github_url": "https://github.com/user/repo",
  "tags": ["React", "TypeScript"],
  "is_featured": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "프로젝트 이름",
    ...
  }
}
```

### PUT /api/projects/:id
프로젝트 수정 (관리자 전용)

**Request:**
```json
{
  "title": "수정된 이름",
  "description": "수정된 설명",
  "custom_content": {
    "blocks": [...]
  },
  "tags": ["React", "Next.js"],
  "is_featured": true
}
```

### DELETE /api/projects/:id
프로젝트 삭제 (관리자 전용)

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## GitHub API

### POST /api/github/readme
GitHub Repository의 README 가져오기

**Request:**
```json
{
  "url": "https://github.com/user/repo"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "readme": "# README 내용 (Markdown)",
    "repo": {
      "name": "repo",
      "full_name": "user/repo",
      "description": "Repository 설명",
      "html_url": "https://github.com/user/repo",
      "stargazers_count": 100,
      "forks_count": 20,
      "language": "TypeScript",
      "topics": ["react", "nextjs"]
    }
  }
}
```

---

## 미디어 API

### POST /api/media/upload
미디어 파일 업로드 (관리자 전용)

**Request:** `multipart/form-data`
- `file`: 업로드할 파일
- `project_id`: 연결할 프로젝트 ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://supabase.storage.url/...",
    "type": "image"
  }
}
```

### DELETE /api/media/:id
미디어 삭제 (관리자 전용)

---

## 에러 응답

모든 에러 응답은 다음 형식을 따릅니다:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

### 에러 코드

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | 로그인 필요 |
| `FORBIDDEN` | 403 | 관리자 권한 필요 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `VALIDATION_ERROR` | 400 | 잘못된 요청 |
| `GITHUB_API_ERROR` | 502 | GitHub API 오류 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |

---

## 관리자 권한 체크

### 화이트리스트 방식
```typescript
// lib/constants.ts
export const ADMIN_WHITELIST = [
  'blooper20',
  // 추가 관리자 GitHub ID
];

// lib/auth.ts
export function isAdmin(githubUsername: string): boolean {
  return ADMIN_WHITELIST.includes(githubUsername);
}
```

### 미들웨어 적용
```typescript
// 관리자 전용 API에 적용
export async function withAdminAuth(
  req: Request,
  handler: () => Promise<Response>
): Promise<Response> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.login) {
    return Response.json(
      { success: false, error: { code: 'UNAUTHORIZED' } },
      { status: 401 }
    );
  }

  if (!isAdmin(session.user.login)) {
    return Response.json(
      { success: false, error: { code: 'FORBIDDEN' } },
      { status: 403 }
    );
  }

  return handler();
}
```

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/github/*` | 10 req/min |
| `/api/projects/*` (GET) | 100 req/min |
| `/api/projects/*` (POST/PUT/DELETE) | 20 req/min |
| `/api/media/upload` | 5 req/min |
