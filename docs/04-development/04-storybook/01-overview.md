# Storybook

本ドキュメントでは、UIコンポーネントの開発・ドキュメント化・デバッグのためのStorybookの使用方法について説明します。Next.js 15との統合、Storyの作成方法、インタラクションテスト、MSWとの統合について解説します。

## 目次

1. [Storybookとは](#storybookとは)
2. [セットアップ](#セットアップ)
3. [Storyの作成](#storyの作成)
4. [アドオンの活用](#アドオンの活用)
5. [インタラクションテスト](#インタラクションテスト)
6. [Next.js特有の機能](#nextjs特有の機能)
7. [ベストプラクティス](#ベストプラクティス)

---

## Storybookとは

**Storybook**は、UIコンポーネントを独立した環境で開発・テストできるツールです。

### 主な用途

| 用途 | 説明 |
|------|------|
| **コンポーネント開発** | アプリから切り離して開発 |
| **ビジュアルテスト** | 様々な状態を確認 |
| **ドキュメント化** | 自動生成されるカタログ |
| **デザインレビュー** | デザイナーとの共同作業 |

### メリット

- ✅ コンポーネントを隔離して開発
- ✅ 様々なPropsパターンを簡単に確認
- ✅ レスポンシブデザインの検証
- ✅ アクセシビリティチェック
- ✅ 自動ドキュメント生成

---

## セットアップ

### インストール確認

```bash
# Storybookが既にインストールされているか確認
ls .storybook
```

### Next.js統合の確認

Storybook 8+ は Next.js 15と自動統合します。

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',  // Next.jsフレームワーク
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
}

export default config
```

### 開発サーバー起動

```bash
# Storybookを起動
pnpm storybook

# または
cd CAMP_front
pnpm storybook
```

ブラウザで <http://localhost:6006> を開く

### ビルド

```bash
# 本番用ビルド
pnpm build-storybook

# ビルド結果の確認
ls storybook-static
```

---

## Storyの作成

### 基本的なStory

```typescript
// components/sample-ui/button/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'

const meta = {
  title: 'Sample UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// デフォルトStory
export const Primary: Story = {
  args: {
    children: 'ボタン',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'ボタン',
    variant: 'secondary',
  },
}

export const Large: Story = {
  args: {
    children: '大きいボタン',
    size: 'lg',
  },
}

export const Disabled: Story = {
  args: {
    children: '無効なボタン',
    disabled: true,
  },
}
```

### コンポーネント階層

```text
components/
├── ui/
│   ├── button.tsx
│   ├── button.stories.tsx       # UI/Button
│   ├── card.tsx
│   └── card.stories.tsx         # UI/Card
│
└── layouts/
    ├── header.tsx
    └── header.stories.tsx       # Layouts/Header
```

### 複数バリアントの表示

```typescript
// components/sample-ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// すべてのバリアントを一度に表示
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
}

// すべてのサイズを一度に表示
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
```

### フォームコンポーネントのStory

```typescript
// components/sample-ui/input.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Input } from './input'

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'テキストを入力',
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">ユーザー名</label>
      <Input placeholder="名前を入力してください" />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <label className="mb-2 block text-sm font-medium">メールアドレス</label>
      <Input
        type="email"
        placeholder="email@example.com"
        className="border-red-500"
      />
      <p className="mt-1 text-sm text-red-500">
        正しいメールアドレスを入力してください
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: '無効な入力',
    disabled: true,
  },
}
```

### 複雑なコンポーネントのStory

```typescript
// features/training/components/training-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { TrainingCard } from './training-card'

const meta = {
  title: 'Features/Training/TrainingCard',
  component: TrainingCard,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TrainingCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    training: {
      id: '1',
      name: 'ベンチプレス',
      date: '2025-01-15',
      sets: [
        { weight: 80, reps: 10, rpe: 8 },
        { weight: 85, reps: 8, rpe: 9 },
        { weight: 90, reps: 6, rpe: 9.5 },
      ],
    },
  },
}

export const NoSets: Story = {
  args: {
    training: {
      id: '2',
      name: 'スクワット',
      date: '2025-01-16',
      sets: [],
    },
  },
}

export const LongName: Story = {
  args: {
    training: {
      id: '3',
      name: 'バーベルバックスクワット（ハイバー）',
      date: '2025-01-17',
      sets: [
        { weight: 100, reps: 5, rpe: 8 },
      ],
    },
  },
}
```

---

## アドオンの活用

### 主要なアドオン

| アドオン | 用途 |
|---------|------|
| **Controls** | Propsを動的に変更 |
| **Actions** | イベントハンドラをログ出力 |
| **Viewport** | レスポンシブ表示をテスト |
| **Accessibility** | a11yチェック |

### Controlsアドオン

Propsを動的に変更できます。

```typescript
const meta = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive'],
      description: 'ボタンのバリアント',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Button>
```

### Actionsアドオン

イベントハンドラの動作を確認できます。

```typescript
export const WithActions: Story = {
  args: {
    children: 'クリック',
    onClick: () => console.log('Button clicked!'),
  },
  parameters: {
    actions: {
      handles: ['click'],
    },
  },
}
```

### Viewportアドオン

レスポンシブデザインをテストできます。

```typescript
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
```

---

## インタラクションテスト

### Play関数でインタラクションをテスト

```typescript
// components/sample-ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from '@storybook/test'
import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const ClickTest: Story = {
  args: {
    children: 'クリックしてください',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // クリックイベント
    await userEvent.click(button)

    // 検証
    await expect(button).toBeInTheDocument()
  },
}
```

### フォームのインタラクションテスト

```typescript
// features/auth/components/login-form.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from '@storybook/test'
import { LoginForm } from './login-form'

const meta = {
  title: 'Features/Auth/LoginForm',
  component: LoginForm,
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const FillAndSubmit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // メールアドレス入力
    const emailInput = canvas.getByLabelText('メールアドレス')
    await userEvent.type(emailInput, 'user@example.com')

    // パスワード入力
    const passwordInput = canvas.getByLabelText('パスワード')
    await userEvent.type(passwordInput, 'password123')

    // ログインボタンクリック
    const submitButton = canvas.getByRole('button', { name: 'ログイン' })
    await userEvent.click(submitButton)

    // 検証
    await expect(emailInput).toHaveValue('user@example.com')
    await expect(passwordInput).toHaveValue('password123')
  },
}
```

---

## Next.js特有の機能

### Next.js Imageコンポーネント

Next.js の `Image` コンポーネントは Storybook で自動的にモックされます。

```typescript
// components/ui/avatar.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Image from 'next/image'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="relative h-16 w-16">
      <Image
        src="/avatar.jpg"
        alt="ユーザーアバター"
        fill
        className="rounded-full"
      />
    </div>
  ),
}
```

### Next.js Linkコンポーネント

`Link` コンポーネントも自動的にモックされます。

```typescript
// components/ui/nav-link.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Link from 'next/link'
import { NavLink } from './nav-link'

const meta = {
  title: 'UI/NavLink',
  component: NavLink,
} satisfies Meta<typeof NavLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Link href="/dashboard" className="text-blue-500 hover:underline">
      ダッシュボード
    </Link>
  ),
}
```

### Next.js Router のモック

`useRouter`, `usePathname`, `useSearchParams` などをモックする必要がある場合：

```typescript
// components/ui/breadcrumb.stories.tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Breadcrumb } from './breadcrumb'

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/training/123',
        query: { id: '123' },
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const TrainingDetail: Story = {}
```

### Server Componentsの扱い

**重要:** Storybook は Client Components のみサポートします。

```typescript
// ❌ Bad: Server Component は Storybook で使用不可
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ✅ Good: Client Component に分離
// features/dashboard/components/dashboard-content.tsx
'use client'

export const DashboardContent = ({ data }: { data: Data }) => {
  return <div>{data}</div>
}

// features/dashboard/components/dashboard-content.stories.tsx
export const Default: Story = {
  args: {
    data: mockData,
  },
}
```

### フォントの設定

Next.js のフォント最適化は `.storybook/preview.ts` で設定：

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite'
import { Inter } from 'next/font/google'
import '../src/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={inter.className}>
        <Story />
      </div>
    ),
  ],
}

export default preview
```

### AppProviderの設定

アプリケーションと同じ環境を再現するため、`AppProvider` を Storybook の全体的なデコレーターとして設定します。
これにより、MSW、React Query、ErrorBoundary などがすべてのStoryで利用可能になります。

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite'
import { AppProvider } from '../src/app/provider'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
}

export default preview
```

#### AppProviderに含まれる機能

`AppProvider` には以下のプロバイダーが含まれています：

| プロバイダー | 機能 |
|------------|------|
| **MSWProvider** | APIモックの自動初期化 |
| **ErrorBoundary** | エラーハンドリング |
| **QueryClientProvider** | React Query による状態管理 |
| **ReactQueryDevtools** | 開発時のデバッグツール |

#### MSWの有効化

Storybook でMSWを有効にするには、環境変数を設定します：

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

MSWが有効な場合、すべてのStoryで `src/mocks/handlers` で定義したモックAPIが自動的に使用されます。

**メリット:**

- ✅ アプリケーションと完全に同じプロバイダー構成
- ✅ MSWによるAPI モック が自動的に有効
- ✅ React Query のキャッシュ動作を再現
- ✅ エラーハンドリングの動作確認が可能

**注意:**

- MSWを無効にしたい場合は `NEXT_PUBLIC_ENABLE_API_MOCKING=false` に設定
- Storybook起動時に環境変数の変更を反映するには再起動が必要

---

## ベストプラクティス

### 1. Storyは`.stories.tsx`ファイルに配置

```text
components/ui/
├── button.tsx
└── button.stories.tsx        # ✅ コンポーネントと同じディレクトリ
```

### 2. 様々な状態をカバー

```typescript
// ✅ Good: 主要な状態をすべて網羅
export const Default: Story = { ... }
export const Loading: Story = { ... }
export const Error: Story = { ... }
export const Empty: Story = { ... }
export const Disabled: Story = { ... }
```

### 3. 実データに近いモックを使用

```typescript
// ✅ Good: 実際のデータ構造を模倣
export const WithRealData: Story = {
  args: {
    training: {
      id: '123',
      name: 'ベンチプレス',
      date: '2025-01-15T10:00:00Z',
      sets: [
        { id: '1', weight: 80, reps: 10, rpe: 8 },
        { id: '2', weight: 85, reps: 8, rpe: 9 },
      ],
    },
  },
}
```

### 4. アクセシビリティを確認

```typescript
// ✅ Good: a11yアドオンで確認
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
} satisfies Meta<typeof Button>
```

### 5. ドキュメントを自動生成

```typescript
// ✅ Good: autodocs タグを使用
const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],  // 自動ドキュメント生成
  parameters: {
    docs: {
      description: {
        component: 'アプリケーション全体で使用する基本的なボタンコンポーネント',
      },
    },
  },
} satisfies Meta<typeof Button>
```

### 6. デコレーターで共通設定

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/nextjs-vite'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
}

export default preview
```

---

## コマンド一覧

### 開発

```bash
# Storybook起動
pnpm storybook

# 特定のポートで起動
pnpm storybook -p 6007
```

### ビルド

```bash
# 本番ビルド
pnpm build-storybook

# 出力ディレクトリ指定
pnpm build-storybook -o dist-storybook
```

### デプロイ

```bash
# Vercelにデプロイ（例）
vercel deploy storybook-static

# Netlifyにデプロイ（例）
netlify deploy --dir=storybook-static
```

---

## トラブルシューティング

### Storybookが起動しない

```bash
# キャッシュをクリア
rm -rf node_modules/.cache

# 再インストール
pnpm install

# Storybookを再起動
pnpm storybook
```

### Tailwindスタイルが適用されない

`.storybook/preview.ts`でCSSをインポート：

```typescript
import '../src/styles/globals.css'
```

### TypeScriptエラー

```bash
# 型チェック
npx tsc --noEmit

# Storybook用の型定義を確認
ls node_modules/@storybook/nextjs-vite/types
```

---

## 参考リンク

- [コンポーネント設計](../03-component-design/index.md)
- [コーディング規約](../01-coding-standards/index.md)
- [テスト戦略](../../05-testing/01-testing-strategy.md)
- [Storybook公式ドキュメント](https://storybook.js.org/docs)
- [Storybook for React](https://storybook.js.org/docs/react/get-started/introduction)
- [Interaction Testing](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
- [Visual Testing](https://storybook.js.org/docs/react/writing-tests/visual-testing)
