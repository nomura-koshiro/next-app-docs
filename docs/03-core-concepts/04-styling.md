# スタイリング

Tailwind CSS v4とCVAを使用したスタイリングガイドです。

## 目次

1. [Tailwind CSS v4の特徴](#tailwind-css-v4の特徴)
2. [基本的な使い方](#基本的な使い方)
3. [カスタムカラーの定義](#カスタムカラーの定義)
4. [CVAによるバリアント管理](#cvaによるバリアント管理)
5. [レスポンシブデザイン](#レスポンシブデザイン)
6. [ダークモード](#ダークモード)
7. [ベストプラクティス](#ベストプラクティス)

---

## Tailwind CSS v4の特徴

### CSS-onlyアプローチ

Tailwind v4では**設定ファイル不要**のCSS-onlyアプローチを採用しています。

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* カスタム設定をCSSで定義 */
  --color-brand-primary: hsl(220 91% 63%);
}
```

### 主な変更点（v3 → v4）

| v3 | v4 |
|----|-----|
| `tailwind.config.js`で設定 | `@theme`ブロックで設定 |
| JavaScript設定 | CSS Variables |
| `extend: {}`が必要 | 直接定義 |

---

## 基本的な使い方

### クラス名の適用

```typescript
export const Button = () => {
  return (
    <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
      クリック
    </button>
  )
}
```

### cn()ユーティリティで条件付きクラス

```typescript
import { cn } from '@/utils/cn'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export const Button = ({ variant = 'primary', className }: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-900',
        className
      )}
    >
      クリック
    </button>
  )
}
```

### cn()の実装

```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
```

---

## カスタムカラーの定義

### @themeブロックで定義

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ブランドカラー */
  --color-brand-primary: hsl(220 91% 63%);
  --color-brand-secondary: hsl(160 84% 39%);

  /* 筋肉部位別カラー */
  --color-muscle-chest: hsl(220 70% 50%);
  --color-muscle-back: hsl(160 70% 50%);
  --color-muscle-legs: hsl(280 70% 50%);
  --color-muscle-shoulders: hsl(30 70% 50%);
  --color-muscle-arms: hsl(10 70% 50%);
  --color-muscle-core: hsl(50 70% 50%);

  /* ステータスカラー */
  --color-success: hsl(142 76% 36%);
  --color-warning: hsl(38 92% 50%);
  --color-error: hsl(0 84% 60%);
  --color-info: hsl(199 89% 48%);
}
```

### 使用例

```typescript
// ブランドカラー
<div className="bg-brand-primary text-white">
  アプリ
</div>

// 筋肉部位カラー
<div className="bg-muscle-chest">胸</div>
<div className="bg-muscle-back">背中</div>

// ステータスカラー
<div className="bg-success">成功</div>
<div className="bg-error">エラー</div>
```

### 標準カラーも利用可能

```typescript
// Tailwind標準カラー（red-500, blue-500等）も使用可能
<div className="bg-red-500 text-white">エラー</div>
<div className="bg-green-500 text-white">成功</div>
```

---

## CVAによるバリアント管理

### CVA (Class Variance Authority)とは

複雑なバリアントを型安全に管理するライブラリ。

### 基本的な使い方

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva('rounded-lg font-semibold transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
      outline: 'border border-gray-300 hover:bg-gray-50',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### 複合バリアント (compoundVariants)

```typescript
const buttonVariants = cva('rounded-lg', {
  variants: {
    variant: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-200',
    },
    size: {
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      size: 'lg',
      className: 'uppercase tracking-wider',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
  },
})
```

### 実装例: Cardコンポーネント

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const cardVariants = cva('rounded-lg border', {
  variants: {
    variant: {
      default: 'border-gray-200 bg-white',
      elevated: 'border-gray-200 bg-white shadow-lg',
      outlined: 'border-gray-300 bg-transparent',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
})

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = ({ variant, padding, className, ...props }: CardProps) => {
  return (
    <div className={cn(cardVariants({ variant, padding }), className)} {...props} />
  )
}
```

---

## レスポンシブデザイン

### ブレークポイント

| プレフィックス | 最小幅 | 用途 |
|--------------|-------|------|
| `sm:` | 640px | モバイル（横） |
| `md:` | 768px | タブレット |
| `lg:` | 1024px | デスクトップ（小） |
| `xl:` | 1280px | デスクトップ（大） |
| `2xl:` | 1536px | ワイド画面 |

### モバイルファーストの実装

```typescript
// ✅ Good: モバイルファースト
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* モバイル: 100%, タブレット: 50%, デスクトップ: 33% */}
</div>

<div className="flex flex-col md:flex-row">
  {/* モバイル: 縦並び, タブレット以上: 横並び */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* フォントサイズも可変 */}
</div>
```

### コンテナ

```typescript
// 中央寄せコンテナ
<div className="container mx-auto px-4">
  <h1>アプリ</h1>
</div>

// 最大幅を指定
<div className="mx-auto max-w-7xl px-4">
  <h1>コンテンツ</h1>
</div>
```

### グリッドレイアウト

```typescript
// レスポンシブグリッド
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <Card>カード1</Card>
  <Card>カード2</Card>
  <Card>カード3</Card>
</div>
```

---

## ダークモード

### 設定

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* ライトモード */
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(0 0% 10%);

  /* ダークモード */
  @media (prefers-color-scheme: dark) {
    --color-background: hsl(0 0% 10%);
    --color-foreground: hsl(0 0% 100%);
  }
}
```

### dark:プレフィックス

```typescript
// システム設定に応じて自動切り替え
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  アプリ
</div>
```

### 手動切り替え（Zustandで管理）

```typescript
// stores/theme-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
)
```

```typescript
// app/layout.tsx
'use client'

import { useThemeStore } from '@/stores/theme-store'
import { useEffect } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  return <html lang="ja">{children}</html>
}
```

---

## ベストプラクティス

### 1. クラスの順序を統一

**推奨順序:** レイアウト → サイズ → スタイル → 状態

```typescript
// ✅ Good
<div className="flex items-center justify-between w-full h-12 rounded-lg bg-white p-4 shadow-md hover:shadow-lg">

// ❌ Bad
<div className="p-4 bg-white flex shadow-md w-full rounded-lg h-12 items-center hover:shadow-lg justify-between">
```

### 2. 複雑なスタイルはCVAで管理

```typescript
// ✅ Good: CVAでバリアント管理
const cardVariants = cva('rounded-lg border', {
  variants: {
    variant: { default: '...', elevated: '...' },
  },
})

// ❌ Bad: 条件分岐が複雑
<div className={
  variant === 'default' ? 'rounded-lg border border-gray-200 bg-white' :
  variant === 'elevated' ? 'rounded-lg border border-gray-200 bg-white shadow-lg' :
  '...'
}>
```

### 3. カスタムカラーは@themeで定義

```typescript
// ✅ Good: カスタムカラーを定義
@theme {
  --color-brand-primary: hsl(220 91% 63%);
}
<div className="bg-brand-primary">

// ❌ Bad: 任意の値を直接指定
<div className="bg-[#4F7FFF]">
```

### 4. 再利用可能なコンポーネント化

```typescript
// ✅ Good: 共通コンポーネント化
export const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-auto max-w-7xl px-4">{children}</div>
}

// 使用
<Container>
  <h1>コンテンツ</h1>
</Container>
```

### 5. Prettier Plugin for Tailwindを使用

自動でクラス名をソート。

```bash
pnpm add -D prettier-plugin-tailwindcss
```

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## よくあるパターン

### カード

```typescript
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold">タイトル</h3>
  <p className="mt-2 text-gray-600">説明文</p>
</div>
```

### ボタン

```typescript
<button className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
  クリック
</button>
```

### 入力フィールド

```typescript
<input
  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
  type="text"
/>
```

### フレックスレイアウト

```typescript
// 中央揃え
<div className="flex items-center justify-center">

// 両端揃え
<div className="flex items-center justify-between">

// 縦並び
<div className="flex flex-col gap-4">
```

---

## トラブルシューティング

### スタイルが適用されない

1. `@import "tailwindcss"`が`globals.css`にあるか確認
2. `globals.css`が`app/layout.tsx`でインポートされているか確認

```typescript
// app/layout.tsx
import './globals.css'
```

### カスタムカラーが表示されない

`@theme`ブロック内で定義されているか確認。

```css
/* ✅ Good */
@theme {
  --color-brand-primary: hsl(220 91% 63%);
}

/* ❌ Bad: @theme外で定義 */
--color-brand-primary: hsl(220 91% 63%);
```

### ダークモードが動かない

`html`タグに`dark`クラスが付与されているか確認。

```typescript
document.documentElement.classList.add('dark')
```

---

## 参考リンク

### 内部ドキュメント

- [コンポーネント設計](../04-implementation/01-component-design.md)
- [技術スタック](./01-tech-stack.md)

### 外部リンク

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [CVA (Class Variance Authority)](https://cva.style/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
