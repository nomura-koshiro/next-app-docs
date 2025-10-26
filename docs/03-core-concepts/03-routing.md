# ルーティング

このドキュメントでは、Next.js 15のApp Routerを使用したルーティングとナビゲーションについて説明します。ファイルシステムベースのルーティング、動的ルート、型安全なパス管理、メタデータ設定など、ルーティングに関する実装方法を理解できます。

## 目次

1. [基本](#基本)
2. [ルートグループ](#ルートグループ)
3. [動的ルート](#動的ルート)
4. [型安全なパス管理 (paths.ts)](#型安全なパス管理-pathsts)
5. [ナビゲーション](#ナビゲーション)
6. [ローディングとエラー処理](#ローディングとエラー処理)
7. [メタデータ](#メタデータ)

---

## 基本

### ファイルシステムベースのルーティング

`app/`ディレクトリの構造がそのままルートになります。

```text
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

| ファイル名      | 用途                 |
| --------------- | -------------------- |
| `page.tsx`      | ページコンポーネント |
| `layout.tsx`    | レイアウト           |
| `loading.tsx`   | ローディングUI       |
| `error.tsx`     | エラーUI             |
| `not-found.tsx` | 404ページ            |

---

## ルートグループ

`(folder)`で括弧を使うと、URLに影響せずにルートをグループ化できます。

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx      → /login
│   └── register/
│       └── page.tsx      → /register
│
└── (dashboard)/
    ├── sample-users/
    │   └── page.tsx      → /sample-users
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

```text
app/items/[id]/page.tsx  → /items/1, /items/2, ...
```

### 実装例（このプロジェクトの方針: Client Component）

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

  sample: {
    form: {
      getHref: () => '/sample-form',
    },
    login: {
      getHref: () => '/sample-login',
    },
    pageList: {
      getHref: () => '/sample-page-list',
    },
    users: {
      list: {
        getHref: () => '/sample-users',
      },
      create: {
        getHref: () => '/sample-users/new',
      },
      detail: {
        getHref: (id: string) => `/sample-users/${id}`,
      },
      edit: {
        getHref: (id: string) => `/sample-users/${id}/edit`,
      },
      delete: {
        getHref: (id: string) => `/sample-users/${id}/delete`,
      },
    },
  },
} as const;
```

### 使用例

**基本的な使用:**

```typescript
import Link from 'next/link'
import { paths } from '@/config/paths'

export const Navigation = () => {
  return (
    <nav>
      <Link href={paths.home.getHref()}>ホーム</Link>
      <Link href={paths.sample.users.list.getHref()}>ユーザー一覧</Link>
      <Link href={paths.sample.form.getHref()}>サンプルフォーム</Link>
    </nav>
  )
}
```

**パラメータ付き:**

```typescript
import { paths } from '@/config/paths'

// ユーザー詳細ページへのリンク
<Link href={paths.sample.users.detail.getHref('123')}>
  ユーザー詳細
</Link>

// ユーザー編集ページへのリンク
<Link href={paths.sample.users.edit.getHref(userId)}>
  編集
</Link>
```

**useRouterでの使用:**

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { paths } from '@/config/paths'

export const CreateUserForm = () => {
  const router = useRouter()

  const handleSubmit = async (data: CreateUserInput) => {
    const user = await createUser(data)
    // 作成後、ユーザー詳細ページへ遷移
    router.push(paths.sample.users.detail.getHref(user.id))
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## ナビゲーション

### 1. Linkコンポーネント

```typescript
import Link from 'next/link'

<Link href="/sample-users">ユーザー一覧</Link>
<Link href={`/sample-users/${user.id}`}>{user.name}</Link>
```

### 2. useRouterフック

```typescript
'use client'

import { useRouter } from 'next/navigation'

export const CreateUserForm = () => {
  const router = useRouter()

  const handleSubmit = async () => {
    await createUser()
    router.push('/sample-users')  // ページ遷移
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## ローディングとエラー処理

### loading.tsx

```typescript
// app/sample-users/loading.tsx
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
// app/sample-users/error.tsx
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
// app/sample-users/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="p-8">
      <h2>ユーザーが見つかりません</h2>
      <Link href="/sample-users">一覧に戻る</Link>
    </div>
  )
}
```

---

## メタデータ

### 静的メタデータ

```typescript
// app/sample-users/page.tsx
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
// app/sample-users/[id]/page.tsx
```

---

## 参考リンク

- [Next.js App Router](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
