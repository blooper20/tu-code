# Tu-Code (Pamoja)

**Tu-Code**는 현대적인 웹 개발 팀을 위한 올인원 포트폴리오 및 프로젝트 관리 플랫폼입니다.  
직관적인 대시보드를 통해 프로젝트의 배포 상태를 실시간으로 모니터링하고, 클라이언트의 문의를 효율적으로 관리할 수 있습니다.

🔗 **Live Demo:** [https://tucode-pamoja-beta.vercel.app/](https://tucode-pamoja-beta.vercel.app/)

![Project Preview](https://tucode-pamoja-beta.vercel.app/opengraph-image.png)

---

## ✨ Key Features

### 📊 Admin Command Center
관리자 대시보드는 팀의 모든 활동을 한눈에 파악할 수 있는 사령탑 역할을 합니다.
- **실시간 통계**: 총 프로젝트 수, 배포/빌드/중단 상태별 프로젝트 현황을 실시간으로 확인합니다.
- **메시지 알림**: 프로젝트 관련 문의와 팀원 개인 문의를 구분하여 읽지 않은 메시지 수를 알려줍니다.
- **팀 관리**: 등록된 팀원 현황을 모니터링합니다.

### 🚀 Project Management
프로젝트의 수명 주기를 체계적으로 관리합니다.
- **상태 추적**: `Live` (배포 중), `Building` (빌드 중), `Stopped` (중단됨) 등 프로젝트의 현재 상태를 시각적으로 관리합니다.
- **기술 스택 태깅**: 각 프로젝트에 사용된 기술을 태그로 관리하여 포트폴리오를 풍성하게 만듭니다.

### 💬 Messaging System
클라이언트 및 팀 간의 원활한 소통을 지원합니다.
- **프로젝트 문의**: 특정 프로젝트에 대한 기술적/비즈니스 문의를 수신합니다.
- **개인 문의**: 팀원 개개인에게 도착한 메시지를 별도로 관리합니다.

### 🎨 Premium UI/UX
사용자 경험을 최우선으로 고려한 디자인 시스템을 적용했습니다.
- **Modern Aesthetics**: 다크 모드 기반의 세련된 컬러 팔레트와 글래스모피즘(Glassmorphism) 효과.
- **Micro-Interactions**: `Framer Motion`을 활용한 부드러운 전환과 인터랙티브한 반응.
- **Responsive Design**: 모바일터 데스크탑까지 완벽하게 대응하는 반응형 레이아웃.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

로컬 환경에서 프로젝트를 실행하려면 다음 단계를 따르세요.

### 1. Clone the repository
```bash
git clone https://github.com/Start-Pamoja/tu-code.git
cd tu-code
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
루트 디렉토리에 `.env.local` 파일을 생성하고 Supabase 환경 변수를 설정하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run the development server
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 🤝 Team
**Tu-Code Pamoja Team**  
우리는 더 나은 개발 문화를 함께 만들어갑니다.
