# ルーティング

Next.js 15のApp Routerを使用したルーティングとナビゲーションについて説明します。

## 基本

### ファイルシステムベースのルーティング

`app/`ディレクトリの構造がそのままルートになります。

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
└── items/
    ├── page.tsx          → /items
    └── [id]/
        └── page.tsx      → /items/:id
```

### 特殊ファイル

| ファイル名 | 用途 |
|-----------|------|
| `page.tsx` | ページコンポーネント |
| `layout.tsx` | レイアウト |
| `loading.tsx` | ローディングUI |
| `error.tsx` | エラーUI |
| `not-found.tsx` | 404ページ |

---

## ルートグループ

`(folder)`で括弧を使うと、URLに影響せずにルートをグループ化できます。

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx      → /login
│   └── register/
│       └── page.tsx      → /register
│
└── (dashboard)/
    ├── users/
    │   └── page.tsx      → /users
    └── settings/
        └── page.tsx      → /settings
```

### レイアウトの適用

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

---

## 動的ルート

### [id]フォルダ

```
app/items/[id]/page.tsx  → /items/1, /items/2, ...
```

### 実装例（Server Component）

```typescript
// app/items/[id]/page.tsx
interface ItemPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params
  const item = await fetchItem(id)

  return (
    <div>
      <h1>{item.name}</h1>
    </div>
  )
}
```

### 実装例（Client Component）

```typescript
'use client'

import { useParams } from 'next/navigation'

export const ItemDetail = () => {
  const params = useParams()
  const id = params.id as string

  const { data: item } = useItem(id)

  return <div>{item?.name}</div>
}
```

---

## 型安全なパス管理 (paths.ts)

### なぜpaths.tsが必要か？

- ❌ ハードコーディング: `<Link href="/auth/login">` → タイポのリスク
- ✅ 型安全: `<Link href={paths.auth.login.getHref()}>` → IDE補完、一元管理

### 実装

```typescript
// src/config/paths.ts
export const paths = {
  home: {
    getHref: () => '/',
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo !== undefined && redirectTo !== null && redirectTo !== '' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo !== undefined && redirectTo !== null && redirectTo !== '' ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    logout: {
      getHref: () => '/auth/logout',
    },
  },

  app: {
    root: {
      getHref: () => '/app',
    },
    dashboard: {
      getHref: () => '/app/dashboard',
    },
    profile: {
      getHref: () => '/app/profile',
    },
    settings: {
      getHref: () => '/app/settings',
    },
  },
} as const
```

### 使用例

```typescript
import Link from 'next/link'
import { paths } from '@/config/paths'

export const Navigation = () => {
  return (
    <nav>
      <Link href={paths.home.getHref()}>ホーム</Link>
      <Link href={paths.auth.login.getHref()}>ログイン</Link>
      <Link href={paths.app.dashboard.getHref()}>ダッシュボード</Link>
    </nav>
  )
}
```

### リダイレクト機能

```typescript
// ログイン後にダッシュボードへリダイレクト
<Link href={paths.auth.login.getHref('/app/dashboard')}>
  ログイン
</Link>
```

---

## ナビゲーション

### 1. Linkコンポーネント

```typescript
import Link from 'next/link'

<Link href="/users">ユーザー一覧</Link>
<Link href={`/users/${user.id}`}>{user.name}</Link>
```

### 2. useRouterフック

```typescript
'use client'

import { useRouter } from 'next/navigation'

export const CreateUserForm = () => {
  const router = useRouter()

  const handleSubmit = async () => {
    await createUser()
    router.push('/users')  // ページ遷移
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 3. redirectとnotFound (Server Component)

```typescript
import { redirect, notFound } from 'next/navigation'

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()  // 404ページへ
  }

  if (!user.isActive) {
    redirect('/users')  // リダイレクト
  }

  return <div>{user.name}</div>
}
```

---

## ローディングとエラー処理

### loading.tsx

```typescript
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
    </div>
  )
}
```

### error.tsx

```typescript
// app/users/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="p-8">
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <button onClick={reset}>再試行</button>
    </div>
  )
}
```

### not-found.tsx

```typescript
// app/users/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="p-8">
      <h2>ユーザーが見つかりません</h2>
      <Link href="/users">一覧に戻る</Link>
    </div>
  )
}
```

---

## メタデータ

### 静的メタデータ

```typescript
// app/users/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ユーザー一覧',
  description: 'ユーザー管理ページ',
}

export default function UsersPage() {
  return <div>...</div>
}
```

### 動的メタデータ

```typescript
// app/users/[id]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await fetchUser(id)

  return {
    title: `${user.name} - アプリ`,
    description: user.bio,
  }
}
```

---

## 参考リンク

- [Next.js App Router](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
