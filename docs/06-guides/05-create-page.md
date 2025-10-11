# ページ追加手順(App Router)

このガイドでは、Next.js App Routerで新しいページを追加する手順を説明します。基本的なページから動的ルート、メタデータ設定、エラーハンドリングまで、ページ開発に必要なすべてのパターンを網羅します。

## 目次

1. [作成するもの](#作成するもの)
2. [パターン1: 基本的なページを追加](#パターン1-基本的なページを追加)
3. [パターン2: メタデータを追加](#パターン2-メタデータを追加)
4. [パターン3: 動的ルート(Dynamic Routes)](#パターン3-動的ルートdynamic-routes)
5. [パターン4: ルートグループを使う](#パターン4-ルートグループを使う)
6. [パターン5: loading.tsxを追加](#パターン5-loadingtsxを追加)
7. [パターン6: error.tsxを追加](#パターン6-errortsxを追加)
8. [パターン7: not-found.tsxを追加](#パターン7-not-foundtsxを追加)
9. [パターン8: Server ComponentとClient Componentの使い分け](#パターン8-server-componentとclient-componentの使い分け)
10. [パターン9: paths.tsにルートを追加](#パターン9-pathstsにルートを追加)
11. [チェックリスト](#チェックリスト)
12. [ファイル構成例](#ファイル構成例)
13. [Tips](#tips)

---

## 📋 作成するもの

- ページファイル(`page.tsx`)
- メタデータ(`metadata`)
- レイアウト(必要な場合)
- ローディングUI(必要な場合)
- エラーUI(必要な場合)

---

## パターン1: 基本的なページを追加

### ステップ1: ディレクトリを作成

```bash
# 例: /posts ページを作成
mkdir -p src/app/\(sample\)/posts
```

### ステップ2: page.tsxを作成

```typescript
// src/app/(sample)/posts/page.tsx
import PostsPage from '@/features/posts/routes/posts'

export default function Page() {
  return <PostsPage />
}
```

**ポイント:**
- `page.tsx` という名前が必須
- デフォルトエクスポートが必須
- ルートコンポーネントは `features/*/routes/*/` からインポート

---

## パターン2: メタデータを追加

```typescript
// src/app/(sample)/posts/page.tsx
import type { Metadata } from 'next'
import PostsPage from '@/features/posts/routes/posts'

export const metadata: Metadata = {
  title: '投稿一覧',
  description: 'すべての投稿を表示します',
}

export default function Page() {
  return <PostsPage />
}
```

### 動的なメタデータ

```typescript
// src/app/(sample)/posts/[id]/page.tsx
import type { Metadata } from 'next'
import PostDetailPage from '@/features/posts/routes/post-detail'

type Props = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params

  // データを取得してメタデータを生成
  // const post = await getPost(id)

  return {
    title: `投稿 #${id}`,
    description: '投稿の詳細ページ',
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return <PostDetailPage postId={id} />
}
```

---

## パターン3: 動的ルート(Dynamic Routes)

### 単一パラメータ

```bash
# /posts/123 のようなURLを作成
mkdir -p src/app/\(sample\)/posts/\[id\]
```

```typescript
// src/app/(sample)/posts/[id]/page.tsx
import PostDetailPage from '@/features/posts/routes/post-detail'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  return <PostDetailPage postId={id} />
}
```

### 複数パラメータ

```bash
# /users/123/posts/456 のようなURLを作成
mkdir -p src/app/\(sample\)/users/\[userId\]/posts/\[postId\]
```

```typescript
// src/app/(sample)/users/[userId]/posts/[postId]/page.tsx
type Props = {
  params: Promise<{
    userId: string
    postId: string
  }>
}

export default async function Page({ params }: Props) {
  const { userId, postId } = await params

  return <UserPostDetailPage userId={userId} postId={postId} />
}
```

---

## パターン4: ルートグループを使う

### (sample) グループ内に追加

```bash
# /posts にアクセス可能(グループ名はURLに含まれない)
mkdir -p src/app/\(sample\)/posts
```

**ルートグループの特徴:**
- `(sample)` はURLに含まれない
- レイアウトを共有するために使う
- 複数のグループを作ってレイアウトを分けられる

### 別のグループを作る

```bash
# 管理画面用の別グループ
mkdir -p src/app/\(admin\)/dashboard
```

```typescript
// src/app/(admin)/layout.tsx
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <aside>管理画面メニュー</aside>
      <main>{children}</main>
    </div>
  )
}
```

---

## パターン5: loading.tsxを追加

```typescript
// src/app/(sample)/posts/loading.tsx
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
```

**表示タイミング:**
- ページコンポーネントがSuspendしている間に表示
- データフェッチ中に自動的に表示される

---

## パターン6: error.tsxを追加

```typescript
// src/app/(sample)/posts/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorMessage } from '@/components/ui/error-message'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ErrorMessage message={error.message || 'エラーが発生しました'} />
      <Button onClick={reset}>再試行</Button>
    </div>
  )
}
```

**ポイント:**
- `'use client'` が必須
- `error` と `reset` をpropsで受け取る
- ページ単位でエラーをキャッチ

---

## パターン7: not-found.tsxを追加

```typescript
// src/app/(sample)/posts/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">投稿が見つかりません</h1>
      <p className="text-gray-600">指定された投稿は存在しません</p>
      <Link href="/posts">
        <Button>投稿一覧に戻る</Button>
      </Link>
    </div>
  )
}
```

**使用方法:**
```typescript
// page.tsx内で notFound() を呼ぶ
import { notFound } from 'next/navigation'

export default async function Page({ params }: Props) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound() // not-found.tsx が表示される
  }

  return <PostDetailPage post={post} />
}
```

---

## パターン8: Server ComponentとClient Componentの使い分け

### Server Component(デフォルト)

```typescript
// src/app/(sample)/posts/page.tsx
// 'use client' なし = Server Component

import { getPostsQueryOptions } from '@/features/posts/api/get-posts'
import { getQueryClient } from '@/lib/get-query-client'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import PostsPage from '@/features/posts/routes/posts'

export default async function Page() {
  const queryClient = getQueryClient()

  // サーバーでデータをプリフェッチ
  await queryClient.prefetchQuery(getPostsQueryOptions())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsPage />
    </HydrationBoundary>
  )
}
```

**メリット:**
- サーバーでデータ取得可能
- バンドルサイズが小さい
- SEOに有利

### Client Component

```typescript
// src/app/(sample)/posts/new/page.tsx
// 'use client' 必要
import NewPostPage from '@/features/posts/routes/new-post'

export default function Page() {
  return <NewPostPage />
}
```

**必要な場合:**
- `useState`, `useEffect` などのフックを使う
- イベントハンドラを使う(`onClick` など)
- ブラウザAPIを使う

---

## パターン9: paths.tsにルートを追加

```typescript
// src/config/paths.ts
export const paths = {
  // ... 既存のパス

  posts: {
    list: {
      getHref: () => '/posts',
    },
    detail: {
      getHref: (id: string) => `/posts/${id}`,
    },
    create: {
      getHref: () => '/posts/new',
    },
    edit: {
      getHref: (id: string) => `/posts/${id}/edit`,
    },
    delete: {
      getHref: (id: string) => `/posts/${id}/delete`,
    },
  },
} as const
```

**使用例:**
```typescript
import Link from 'next/link'
import { paths } from '@/config/paths'

<Link href={paths.posts.detail.getHref(post.id)}>
  投稿を見る
</Link>
```

---

## 🎯 チェックリスト

### 基本ページ

- [ ] ディレクトリを作成(`src/app/(sample)/...`)
- [ ] `page.tsx` を作成
  - [ ] デフォルトエクスポート
  - [ ] Featureコンポーネントをインポート
- [ ] メタデータを追加(`metadata` または `generateMetadata`)
- [ ] `paths.ts` にルートを追加

### 動的ルート

- [ ] `[param]` ディレクトリを作成
- [ ] `params` の型定義(`Promise<{ param: string }>`)
- [ ] `await params` でパラメータ取得

### オプション

- [ ] `loading.tsx` を追加(必要なら)
- [ ] `error.tsx` を追加(必要なら)
- [ ] `not-found.tsx` を追加(必要なら)
- [ ] `layout.tsx` を追加(グループ単位で共通レイアウトが必要なら)

---

## 📝 ファイル構成例

### シンプルなページ

```
src/app/(sample)/posts/
├── page.tsx          # ページコンポーネント
└── loading.tsx       # ローディングUI(オプション)
```

### 動的ルート

```
src/app/(sample)/posts/
├── page.tsx          # 一覧ページ
├── new/
│   └── page.tsx      # 作成ページ
└── [id]/
    ├── page.tsx      # 詳細ページ
    ├── edit/
    │   └── page.tsx  # 編集ページ
    └── delete/
        └── page.tsx  # 削除ページ
```

### 完全な構成(すべてのファイル)

```
src/app/(sample)/posts/
├── layout.tsx        # レイアウト
├── page.tsx          # ページ
├── loading.tsx       # ローディングUI
├── error.tsx         # エラーUI
└── not-found.tsx     # 404ページ
```

---

## 💡 Tips

### ルート優先順位

| パターン | 例 | 優先順位 |
|---------|-----|---------|
| **静的** | `/posts/new` | 高 |
| **動的** | `/posts/[id]` | 低 |
| **Catch-all** | `/posts/[...slug]` | 最低 |

→ `/posts/new` は `[id]` より優先される

### ファイル命名規則

| ファイル名 | 用途 | Client必須 |
|-----------|------|-----------|
| `page.tsx` | ページコンテンツ | - |
| `layout.tsx` | レイアウト | - |
| `loading.tsx` | ローディングUI | - |
| `error.tsx` | エラーUI | ✅ |
| `not-found.tsx` | 404ページ | - |
| `template.tsx` | 再マウント必要なレイアウト | - |

### Server ComponentでのデータフェッチNG例

```typescript
// ❌ Bad: Server Componentで useQuery は使えない
export default function Page() {
  const { data } = useQuery(getPostsQueryOptions()) // Error!
  return <div>{data}</div>
}

// ✅ Good: Client Componentに切り出す
export default function Page() {
  return <PostsPage /> // routes/posts/posts.tsx内でuseQueryを使う
}
```

### paramsの型定義(Next.js 15+)

```typescript
// ✅ Good: Promise型を使う(Next.js 15+)
type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  // ...
}

// ❌ Bad: 古い書き方(Next.js 14以前)
type Props = {
  params: { id: string } // Promiseなし
}
```

---

## 参考リンク

- [ルーティング](../03-core-concepts/03-routing.md)
- [Feature作成](./03-create-feature.md)
- [コンポーネント作成](./01-create-component.md)
- [Next.js App Router公式ドキュメント](https://nextjs.org/docs/app)
