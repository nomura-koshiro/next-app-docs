# UIコンポーネント作成手順

このガイドでは、新しいUIコンポーネントを作成する手順を説明します。共通UIコンポーネントとFeature固有コンポーネントの両方のパターンを網羅し、Storybookとの統合方法まで解説します。

## 目次

1. [作成するもの](#-作成するもの)
2. [ステップ1: コンポーネントディレクトリを作成](#ステップ1-コンポーネントディレクトリを作成)
3. [ステップ2: コンポーネントファイルを作成](#ステップ2-コンポーネントファイルを作成)
4. [ステップ3: Storybookファイルを作成](#ステップ3-storybookファイルを作成)
5. [ステップ4: バレルエクスポートを作成](#ステップ4-バレルエクスポートを作成)
6. [ステップ5: 共通UIの場合は components/sample-ui/index.ts に追加](#ステップ5-共通uiの場合は-componentsuiindexts-に追加)
7. [ステップ6: Storybookで確認](#ステップ6-storybookで確認)
8. [ステップ7: 実際のコンポーネントで使用](#ステップ7-実際のコンポーネントで使用)
9. [チェックリスト](#-チェックリスト)
10. [実例: 完全なファイル構成](#-実例-完全なファイル構成)
11. [Tips](#-tips)

---

## 📋 作成するもの

- コンポーネントファイル（`.tsx`）
- Storybookファイル（`.stories.tsx`）
- バレルエクスポート（`index.ts`）

---

## ステップ1: コンポーネントディレクトリを作成

### 共通UIコンポーネントの場合

```bash
# components/sample-ui/ 配下に作成
mkdir src/components/sample-ui/badge
```

### Feature固有コンポーネントの場合

```bash
# features/{feature-name}/components/ 配下に作成
mkdir src/features/users/components/user-badge
```

---

## ステップ2: コンポーネントファイルを作成

### 基本パターン

```typescript
// src/components/sample-ui/badge/badge.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input bg-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
```

### Props型定義のパターン

```typescript
// パターン1: 基本的なProps
type BadgeProps = {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive'
  className?: string
}

// パターン2: HTML要素を拡張
type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'secondary' | 'destructive'
}

// パターン3: CVAのVariantPropsを使用（推奨）
import { type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(/* ... */)
type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>
```

---

## ステップ3: Storybookファイルを作成

```typescript
// src/components/sample-ui/badge/badge.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Badge } from './badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

// すべてのバリアントを一度に表示
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
```

---

## ステップ4: バレルエクスポートを作成

```typescript
// src/components/sample-ui/badge/index.ts
export { Badge, type BadgeProps } from './badge'
```

---

## ステップ5: 共通UIの場合は `components/sample-ui/index.ts` に追加

```typescript
// src/components/sample-ui/index.ts
export * from './alert'
export * from './badge'  // ← 追加
export * from './button'
export * from './card'
// ...
```

---

## ステップ6: Storybookで確認

```bash
pnpm storybook
```

→ <http://localhost:6006> で確認

---

## ステップ7: 実際のコンポーネントで使用

```typescript
// 使用例
import { Badge } from '@/components/sample-ui/badge'

export const UserCard = ({ user }: { user: User }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <Badge variant={user.isActive ? 'default' : 'secondary'}>
        {user.isActive ? 'アクティブ' : '非アクティブ'}
      </Badge>
    </div>
  )
}
```

---

## 🎯 チェックリスト

- [ ] コンポーネントディレクトリを作成
- [ ] `{component}.tsx` を作成
  - [ ] 型定義（Props）
  - [ ] CVAでバリアント定義（必要な場合）
  - [ ] `cn()`でclassName結合
- [ ] `{component}.stories.tsx` を作成
  - [ ] メタデータ定義
  - [ ] 主要なバリアントのStory
  - [ ] `autodocs`タグ
- [ ] `index.ts` でエクスポート
- [ ] `components/sample-ui/index.ts` に追加（共通UIの場合）
- [ ] Storybookで動作確認
- [ ] 実際のページで使用テスト

---

## 📝 実例: 完全なファイル構成

```text
src/components/sample-ui/badge/
├── badge.tsx           # コンポーネント本体
├── badge.stories.tsx   # Storybookストーリー
└── index.ts            # エクスポート
```

---

## 💡 Tips

### CVAを使うべきケース

- ✅ 複数のバリアントがある（variant, size, colorなど）
- ✅ 組み合わせによってスタイルが変わる
- ✅ デフォルト値が必要

### 使わなくてOKなケース

- ✅ バリアントが1つもない単純なコンポーネント
- ✅ `className`だけで十分なケース

### コンポーネント命名規則

| タイプ | 命名 | 例 |
|--------|------|---|
| **ファイル名** | kebab-case | `user-badge.tsx` |
| **コンポーネント名** | PascalCase | `UserBadge` |
| **Props型** | PascalCase + Props | `UserBadgeProps` |

---

## 参考リンク

- [コンポーネント設計](../04-development/03-component-design.md)
- [Storybook](../04-development/06-storybook.md)
- [スタイリング](../03-core-concepts/04-styling.md)
