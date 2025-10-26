# スタイリング

このドキュメントでは、Tailwind CSS v4とCVA（Class Variance Authority）を使用したスタイリング手法について説明します。CSS-onlyアプローチ、バリアント管理、レスポンシブデザイン、ダークモード対応など、プロジェクトのスタイリング戦略を理解できます。

## 目次

1. [Tailwind CSS v4の基本](#tailwind-css-v4の基本)
2. [cn()ユーティリティ](#cnユーティリティ)
3. [CVA (バリアント管理)](#cva-バリアント管理)
4. [レスポンシブデザイン](#レスポンシブデザイン)
5. [ダークモード](#ダークモード)
6. [よくあるパターン](#よくあるパターン)
7. [ベストプラクティス](#ベストプラクティス)

---

## Tailwind CSS v4の基本

### CSS-onlyアプローチ

設定ファイル不要。globals.cssで全て管理します。

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-primary: hsl(220 91% 63%);
  --color-brand-secondary: hsl(160 84% 39%);
}
```

### 基本的な使い方

```typescript
export const Button = () => {
  return (
    <button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
      クリック
    </button>
  )
}
```

---

## cn()ユーティリティ

条件付きクラスの管理に使用します。

```typescript
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
```

### 使用例

```typescript
import { cn } from '@/utils/cn'

type ButtonProps = {
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

---

## CVA (バリアント管理)

複雑なバリアントを型安全に管理します。

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva('rounded-lg font-semibold transition-colors', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      destructive: 'bg-red-500 text-white hover:bg-red-600',
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

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = ({ variant, size, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

---

## レスポンシブデザイン

### ブレークポイント

| プレフィックス | 最小幅 |
|--------------|-------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |

### モバイルファースト

```typescript
// モバイル: 100%, タブレット: 50%, デスクトップ: 33%
<div className="w-full md:w-1/2 lg:w-1/3">

// モバイル: 縦並び, タブレット以上: 横並び
<div className="flex flex-col md:flex-row">

// フォントサイズも可変
<div className="text-sm md:text-base lg:text-lg">
```

### グリッドレイアウト

```typescript
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
@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(0 0% 10%);

  @media (prefers-color-scheme: dark) {
    --color-background: hsl(0 0% 10%);
    --color-foreground: hsl(0 0% 100%);
  }
}
```

### dark:プレフィックス

```typescript
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  アプリ
</div>
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
<button className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
  クリック
</button>
```

### 入力フィールド

```typescript
<input
  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2"
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

## ベストプラクティス

### 1. クラスの順序を統一

**推奨順序:** レイアウト → サイズ → スタイル → 状態

```typescript
// ✅ Good
<div className="flex items-center w-full h-12 rounded-lg bg-white p-4 shadow-md hover:shadow-lg">

// ❌ Bad
<div className="p-4 bg-white flex shadow-md w-full rounded-lg h-12 items-center hover:shadow-lg">
```

### 2. 複雑なスタイルはCVAで管理

```typescript
// ✅ Good
const buttonVariants = cva('rounded-lg', {
  variants: { variant: { primary: '...', secondary: '...' } },
})

// ❌ Bad
<div className={variant === 'primary' ? '...' : '...'}>
```

### 3. Prettier Pluginを使用

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

## 参考リンク

- [Tailwind CSS v4](https://tailwindcss.com/)
- [CVA](https://cva.style/)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
