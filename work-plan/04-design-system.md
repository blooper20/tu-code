# Anti-Gravity 디자인 시스템

## 컬러 팔레트

### Base Colors (다크 테마)
```css
:root {
  /* Background */
  --bg-primary: #0a0a0f;      /* 메인 배경 - 깊은 우주 */
  --bg-secondary: #121218;    /* 카드/섹션 배경 */
  --bg-tertiary: #1a1a24;     /* hover 상태 */

  /* Surface */
  --surface-1: #1e1e2a;       /* 카드 배경 */
  --surface-2: #252532;       /* 입력 필드 */
  --surface-3: #2d2d3d;       /* 구분선 */
}
```

### Primary Colors (네온 퍼플)
```css
:root {
  --primary-50: #f5f3ff;
  --primary-100: #ede9fe;
  --primary-200: #ddd6fe;
  --primary-300: #c4b5fd;
  --primary-400: #a78bfa;
  --primary-500: #8b5cf6;      /* 메인 퍼플 */
  --primary-600: #7c3aed;
  --primary-700: #6d28d9;
  --primary-800: #5b21b6;
  --primary-900: #4c1d95;
}
```

### Accent Colors (일렉트릭 블루)
```css
:root {
  --accent-50: #eff6ff;
  --accent-100: #dbeafe;
  --accent-200: #bfdbfe;
  --accent-300: #93c5fd;
  --accent-400: #60a5fa;
  --accent-500: #3b82f6;       /* 메인 블루 */
  --accent-600: #2563eb;
  --accent-700: #1d4ed8;
  --accent-800: #1e40af;
  --accent-900: #1e3a8a;
}
```

### Text Colors
```css
:root {
  --text-primary: #ffffff;     /* 주요 텍스트 */
  --text-secondary: #a1a1aa;   /* 보조 텍스트 */
  --text-tertiary: #71717a;    /* 비활성 텍스트 */
  --text-muted: #52525b;       /* 음소거 텍스트 */
}
```

### Semantic Colors
```css
:root {
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}
```

### Gradient
```css
:root {
  /* 네온 그라디언트 */
  --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  --gradient-glow: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(59, 130, 246, 0.5) 100%);

  /* 배경 그라디언트 */
  --gradient-bg: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 100%);
}
```

---

## 타이포그래피

### Font Family
```css
:root {
  --font-sans: 'Inter', 'Pretendard', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Space Grotesk', sans-serif;  /* 히어로 타이틀 */
}
```

### Font Sizes
```css
:root {
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  --text-8xl: 6rem;        /* 96px - 히어로 타이틀 */
}
```

### Font Weights
```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

---

## Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

---

## Border Radius

```css
:root {
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* 원형 */
}
```

---

## Shadows & Glow Effects

```css
:root {
  /* 기본 그림자 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

  /* 네온 글로우 */
  --glow-purple: 0 0 20px rgba(139, 92, 246, 0.5);
  --glow-blue: 0 0 20px rgba(59, 130, 246, 0.5);
  --glow-intense: 0 0 40px rgba(139, 92, 246, 0.7), 0 0 80px rgba(59, 130, 246, 0.3);
}
```

---

## Animation

### Timing
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 플로팅 애니메이션 (Anti-Gravity)
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(2deg);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
  }
}
```

---

## Component Styles

### 버튼
```css
/* Primary Button */
.btn-primary {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  transition: all var(--duration-normal) var(--ease-default);
}

.btn-primary:hover {
  box-shadow: var(--glow-purple);
  transform: translateY(-2px);
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--surface-3);
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--surface-1);
  color: var(--text-primary);
}
```

### 카드
```css
.card {
  background: var(--surface-1);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--duration-normal) var(--ease-default);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), var(--glow-purple);
  border-color: var(--primary-500);
}
```

### 입력 필드
```css
.input {
  background: var(--surface-2);
  border: 1px solid var(--surface-3);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}
```

---

## Tailwind Config

```javascript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#8b5cf6',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#1a1a24',
          foreground: '#a1a1aa',
        },
        card: {
          DEFAULT: '#1e1e2a',
          foreground: '#ffffff',
        },
        border: '#2d2d3d',
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
};
```
