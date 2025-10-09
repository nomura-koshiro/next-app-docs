# ルーティング

Next.js 15のApp Routerを使用したルーティングとナビゲーションについて説明します。

## 目次

1. [App Routerの基本](#app-routerの基本)
2. [ルート構成](#ルート構成)
3. [ルートグループ](#ルートグループ)
4. [動的ルート](#動的ルート)
5. [ナビゲーション](#ナビゲーション)
6. [ローディングとエラー処理](#ローディングとエラー処理)
7. [メタデータ](#メタデータ)

---

## App Routerの基本

### ファイルシステムベースのルーティング

Next.js 15のApp Routerは、`app/`ディレクトリの構造がそのままルートになります。

```
app/
├── page.tsx              → /
├── page-a/
│   └── page.tsx          → /page-a
├── page-b/
│   └── page.tsx          → /page-b
└── items/
    ├── page.tsx          → /items
    └── [id]/
        └── page.tsx      → /items/:id
```

### 主要な特殊ファイル

| ファイル名 | 用途 |
|-----------|------|
| `page.tsx` | ページコンポーネント（UIを表示） |
| `layout.tsx` | レイアウト（ページを囲む） |
| `loading.tsx` | ローディングUI |
| `error.tsx` | エラーUI |
| `not-found.tsx` | 404ページ |

---

## ルート構成

### アプリのルート構成

```
app/
├── layout.tsx                    # ルートレイアウト
├── page.tsx                      # / (ホームページ)
│
├── (group-a)/                    # ルートグループA
│   ├── layout.tsx                # グループAレイアウト
│   ├── page-a/
│   │   └── page.tsx              # /page-a
│   └── page-b/
│       └── page.tsx              # /page-b
│
├── (group-b)/                    # ルートグループB
│   ├── layout.tsx                # グループBレイアウト
│   ├── page-c/
│   │   └── page.tsx              # /page-c
│   ├── items/
│   │   ├── page.tsx              # /items
│   │   ├── new/
│   │   │   └── page.tsx          # /items/new
│   │   └── [id]/
│   │       ├── page.tsx          # /items/:id
│   │       └── edit/
│   │           └── page.tsx      # /items/:id/edit
│   ├── page-d/
│   │   └── page.tsx              # /page-d
│   └── page-e/
│       └── page.tsx              # /page-e
│
└── api/                          # API Routes
    └── resource/
        └── route.ts              # /api/resource
```

---

## ルートグループ

### ルートグループとは

`(folder)`のように括弧で囲むことで、URLに影響を与えずにルートをグループ化できます。

### (group-a) グループ

グループA関連のページをグループ化。

```typescript
// app/(group-a)/layout.tsx
export default function GroupALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
```

### (group-b) グループ

グループB関連のページをグループ化。

```typescript
// app/(group-b)/layout.tsx
import { Header } from '@/components/layouts/header'
import { Sidebar } from '@/components/layouts/sidebar'

export default function GroupBLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
```

---

## 動的ルート

### [id]フォルダによる動的セグメント

```
app/items/[id]/page.tsx  → /items/1, /items/2, ...
```

### 実装例

```typescript
// app/items/[id]/page.tsx
import { useItem } from '@/features/{feature-name}/api/get-item'

interface ItemPageProps {
  params: Promise<{ id: string }>
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { id } = await params
  const item = await fetchItem(id)

  return (
    <div>
      <h1>{item.name}</h1>
      {/* ... */}
    </div>
  )
}
```

### パラメータの取得（Client Component）

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

### Catch-all Segments

```
app/shop/[...slug]/page.tsx  → /shop/a, /shop/a/b, /shop/a/b/c
```

```typescript
interface ShopPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params
  // slug = ['a', 'b', 'c']
}
```

---

## ナビゲーション

### 1. Linkコンポーネント

**推奨:** クライアントサイドナビゲーションに使用。

```typescript
import Link from 'next/link'

export const TrainingList = () => {
  return (
    <div>
      <Link href="/training/new" className="text-blue-500">
        新規作成
      </Link>

      <Link href={`/training/${training.id}`}>
        {training.name}
      </Link>
    </div>
  )
}
```

### 2. useRouterフック

プログラマティックなナビゲーション。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export const TrainingForm = () => {
  const router = useRouter()

  const handleSubmit = async (data: FormData) => {
    await createTraining(data)

    // ナビゲーション
    router.push('/training')

    // 戻る
    // router.back()

    // リフレッシュ
    // router.refresh()
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 3. redirectとnotFound

Server Componentでのリダイレクト。

```typescript
import { redirect, notFound } from 'next/navigation'

export default async function TrainingPage({ params }: TrainingPageProps) {
  const { id } = await params
  const training = await fetchTraining(id)

  if (!training) {
    notFound()  // 404ページへ
  }

  if (!training.isPublished) {
    redirect('/training')  // リダイレクト
  }

  return <div>{training.name}</div>
}
```

### 4. URLSearchParams

クエリパラメータの操作。

```typescript
'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export const TrainingFilter = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('filter', filter)

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select onChange={(e) => handleFilterChange(e.target.value)}>
      <option value="all">すべて</option>
      <option value="active">アクティブ</option>
    </select>
  )
}
```

---

## ローディングとエラー処理

### loading.tsx

Suspenseベースの自動ローディングUI。

```typescript
// app/(dashboard)/training/loading.tsx
export default function TrainingLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
    </div>
  )
}
```

### error.tsx

エラーバウンダリの自動適用。

```typescript
// app/(dashboard)/training/error.tsx
'use client'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TrainingError({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-bold">エラーが発生しました</h2>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        再試行
      </button>
    </div>
  )
}
```

### not-found.tsx

カスタム404ページ。

```typescript
// app/(dashboard)/training/not-found.tsx
import Link from 'next/link'

export default function TrainingNotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold">トレーニングが見つかりません</h2>
      <Link href="/training" className="mt-4 text-blue-500">
        一覧に戻る
      </Link>
    </div>
  )
}
```

---

## メタデータ

### 静的メタデータ

```typescript
// app/(dashboard)/training/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'トレーニング一覧',
  description: 'あなたのトレーニング記録を管理します',
}

export default function TrainingPage() {
  return <div>...</div>
}
```

### 動的メタデータ

```typescript
// app/(dashboard)/training/[id]/page.tsx
import type { Metadata } from 'next'

interface GenerateMetadataProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { id } = await params
  const training = await fetchTraining(id)

  return {
    title: `${training.name} - アプリ`,
    description: training.description,
  }
}

export default async function TrainingPage({ params }: GenerateMetadataProps) {
  const { id } = await params
  const training = await fetchTraining(id)

  return <div>{training.name}</div>
}
```

### Open Graph画像

```typescript
export const metadata: Metadata = {
  title: 'アプリ',
  openGraph: {
    title: 'アプリ',
    description: 'トレーニング記録管理アプリ',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

---

## ルーティングのベストプラクティス

### 1. Server Componentを優先

```typescript
// ✅ Good: Server Component（デフォルト）
export default async function TrainingPage() {
  const trainings = await fetchTrainings()

  return <div>{trainings.map(...)}</div>
}
```

### 2. 必要な場合のみClient Component

```typescript
// ✅ Good: インタラクティブな部分のみClient Component
'use client'

export const TrainingFilter = () => {
  const [filter, setFilter] = useState('all')

  return <select value={filter} onChange={(e) => setFilter(e.target.value)}>...</select>
}
```

### 3. Linkコンポーネントを使用

```typescript
// ✅ Good: Linkでクライアントサイドナビゲーション
<Link href="/training">トレーニング一覧</Link>

// ❌ Bad: aタグは避ける
<a href="/training">トレーニング一覧</a>
```

### 4. ルートグループで整理

```
app/
├── (auth)/      # 認証関連
├── (dashboard)/ # ダッシュボード関連
└── (public)/    # 公開ページ
```

---

## トラブルシューティング

### ページが表示されない

- `page.tsx`が存在するか確認
- ファイル名が正しいか確認（`page.tsx`、`layout.tsx`）

### ナビゲーションが動かない

```typescript
// ❌ Bad: useRouter from 'next/router'（Pages Router用）
import { useRouter } from 'next/router'

// ✅ Good: useRouter from 'next/navigation'（App Router用）
import { useRouter } from 'next/navigation'
```

### メタデータが反映されない

- Server Componentで定義しているか確認
- `'use client'`がある場合は削除

---

## 参考リンク

### 内部ドキュメント

- [プロジェクト構造](../02-architecture/01-project-structure.md)
- [状態管理](./02-state-management.md)

### 外部リンク

- [Next.js App Router](https://nextjs.org/docs/app)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
- [Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
