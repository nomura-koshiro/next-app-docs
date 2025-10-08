# プロジェクト構成

このドキュメントでは、プロジェクトのディレクトリ構成とアーキテクチャについて説明します。

このプロジェクトは、**bulletproof-react**のアーキテクチャをNext.jsに適用した構成を採用しています。

## 目次

1. [アーキテクチャの原則](#アーキテクチャの原則)
2. [ディレクトリ構成の全体像](#ディレクトリ構成の全体像)
3. [各ディレクトリの説明](#各ディレクトリの説明)
4. [Feature構成の詳細](#feature構成の詳細)
5. [コードフローの方向性](#コードフローの方向性)
6. [実装例](#実装例)
7. [ベストプラクティス](#ベストプラクティス)
8. [アンチパターン](#アンチパターン)

---

## アーキテクチャの原則

このプロジェクトは以下の原則に基づいて構成されています：

### 1. Feature-Based Organization（機能ベースの構成）

アプリケーションの機能（Feature）ごとにコードを整理し、スケーラビリティと保守性を向上させます。

### 2. Unidirectional Codebase Flow（単一方向のコードフロー）

```
共通コード（components, hooks, lib, utils） → features → app
```

- **共通コード** - プロジェクト全体で使用される共通コード（components, hooks, lib, utils）
- **features** - 各機能のコード（共通コードのみをインポート可能）
- **app** - アプリケーション層（featuresと共通コードをインポート可能）

### 3. Separation of Concerns（関心の分離）

各機能は独立したモジュールとして、自身のコンポーネント、ロジック、スタイルを持ちます。

### 4. No Cross-Feature Imports（機能間インポートの禁止）

Feature間での直接的なインポートは禁止です。共通化が必要な場合は`src/components`、`src/hooks`、`src/utils`などに移動します。

---

## ディレクトリ構成の全体像

```
CAMP_front/
├── public/                      # 静的ファイル
│   ├── icons/
│   ├── images/
│   └── mockServiceWorker.js
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # ルートグループ: 認証関連
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # ルートグループ: ダッシュボード
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   └── settings/
│   │   ├── api/                 # API Routes
│   │   ├── layout.tsx           # ルートレイアウト
│   │   ├── page.tsx             # トップページ
│   │   ├── error.tsx            # エラーページ
│   │   ├── not-found.tsx        # 404ページ
│   │   └── providers.tsx        # プロバイダー設定
│   │
│   ├── features/                # 機能モジュール（Feature-Based）
│   │   ├── auth/                # 認証機能
│   │   ├── users/               # ユーザー管理機能
│   │   ├── products/            # 商品管理機能
│   │   └── dashboard/           # ダッシュボード機能
│   │
│   ├── components/              # 共通コンポーネント
│   │   ├── ui/                  # 基本UIコンポーネント
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── modal.tsx
│   │   ├── layouts/             # レイアウトコンポーネント
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   └── error-boundary.tsx   # エラーハンドリング
│   │
│   ├── hooks/                   # 共通カスタムHooks
│   │   ├── use-debounce.ts
│   │   ├── use-local-storage.ts
│   │   └── use-media-query.ts
│   │
│   ├── lib/                     # 外部ライブラリ設定
│   │   ├── api-client.ts        # APIクライアント
│   │   ├── react-query.ts       # TanStack Query設定
│   │   └── authorization.tsx    # 認可設定
│   │
│   ├── stores/                  # グローバルストア
│   │   ├── user.ts              # ユーザー認証ストア
│   │   ├── theme.ts             # テーマストア
│   │   └── notifications.ts     # 通知ストア
│   │
│   ├── types/                   # 共通型定義
│   │   ├── api.ts               # API関連の型
│   │   └── index.ts             # 共通型
│   │
│   ├── utils/                   # 共通ユーティリティ
│   │   ├── format.ts            # フォーマット関数
│   │   └── cn.ts                # クラス名結合
│   │
│   ├── config/                  # アプリケーション設定
│   │   ├── env.ts               # 環境変数
│   │   └── constants.ts         # 定数
│   │
│   └── testing/                 # テストユーティリティ
│       ├── mocks/               # MSWハンドラー
│       └── test-utils.tsx       # テストユーティリティ
│
├── .vscode/                     # VSCode設定
├── docs/                        # ドキュメント
├── .env.local                   # 環境変数（ローカル）
├── .eslintrc.json              # ESLint設定
├── .prettierrc                  # Prettier設定
├── next.config.ts               # Next.js設定
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts           # Tailwind CSS設定
└── tsconfig.json                # TypeScript設定
```

---

## 各ディレクトリの説明

### 1. `src/app/` - アプリケーション層

**役割:** Next.js App Routerのルーティングとページコンポーネント

```
src/app/
├── (auth)/                    # 認証関連のルートグループ
│   ├── login/
│   │   └── page.tsx           # /login
│   └── register/
│       └── page.tsx           # /register
│
├── (dashboard)/               # ダッシュボード関連のルートグループ
│   ├── layout.tsx             # ダッシュボード共通レイアウト
│   ├── users/
│   │   ├── page.tsx           # /users
│   │   └── [id]/
│   │       └── page.tsx       # /users/:id
│   └── products/
│       └── page.tsx           # /products
│
├── layout.tsx                 # ルートレイアウト（全ページ共通）
├── page.tsx                   # トップページ（/）
├── error.tsx                  # エラーハンドリング
├── not-found.tsx              # 404ページ
└── providers.tsx              # グローバルプロバイダー
```

**特徴:**

- **ルートグループ** - `(auth)`や`(dashboard)`でURLに影響しないグルーピング
- **薄いレイヤー** - ページコンポーネントはFeatureのコンポーネントを組み合わせるのみ
- **Server Components優先** - デフォルトでサーバーコンポーネント

**例:**

```typescript
// src/app/(dashboard)/users/page.tsx
import { UserList } from '@/features/users/components/UserList'
import { PageHeader } from '@/shared/components/PageHeader'

export default function UsersPage() {
  return (
    <>
      <PageHeader title="ユーザー管理" />
      <UserList />
    </>
  )
}
```

---

### 2. `src/features/` - 機能モジュール

**役割:** アプリケーションの各機能を独立したモジュールとして管理

```
src/features/
├── auth/                      # 認証機能
├── users/                     # ユーザー管理機能
├── products/                  # 商品管理機能
└── dashboard/                 # ダッシュボード機能
```

**特徴:**

- 各機能は独立したディレクトリ
- 機能間の依存を避ける
- 共通化が必要な場合は`src/shared`に移動

詳細は[Feature構成の詳細](#feature構成の詳細)を参照。

---

### 3. `src/components/` - 共通コンポーネント

**役割:** プロジェクト全体で使用される共通コンポーネント

```
src/components/
├── ui/                        # 基本UIコンポーネント
│   ├── button.tsx
│   ├── input.tsx
│   ├── modal.tsx
│   └── table.tsx
├── layouts/                   # レイアウトコンポーネント
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── error-boundary.tsx         # エラーハンドリング
```

**特徴:**

- 複数の機能で使用されるコンポーネント
- ビジネスロジックを持たない
- 再利用性が高い

---

### 4. `src/hooks/` - 共通カスタムHooks

```
src/hooks/
├── use-debounce.ts            # デバウンス処理
├── use-local-storage.ts       # LocalStorage管理
├── use-media-query.ts         # メディアクエリ判定
└── use-pagination.ts          # ページネーション
```

---

### 5. `src/lib/` - 外部ライブラリ設定

```
src/lib/
├── api-client.ts              # APIクライアント設定
├── react-query.ts             # TanStack Query設定
├── authorization.tsx          # 認可設定
└── zod.ts                     # Zodカスタムエラーメッセージ
```

**例:**

```typescript
// src/lib/api-client.ts
import axios from 'axios'
import { env } from '@/config/env'

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

---

### 6. `src/stores/` - グローバルストア

```
src/stores/
├── user.ts                    # ユーザー認証ストア
├── theme.ts                   # テーマストア
├── notifications.ts           # 通知ストア
└── sidebar.ts                 # サイドバー状態
```

**特徴:**

- Zustandでグローバルステートを管理
- アプリケーション全体で共有する状態のみ

---

### 7. `src/types/` - 共通型定義

```
src/types/
├── api.ts                     # API関連の型
└── index.ts                   # 共通型
```

---

### 8. `src/utils/` - 共通ユーティリティ

```
src/utils/
├── format.ts                  # フォーマット関数（日付、金額など）
├── cn.ts                      # クラス名結合（clsx）
└── storage.ts                 # ストレージ操作
```

---

### 9. `src/config/` - アプリケーション設定

```
src/config/
├── env.ts                     # 環境変数の型定義と検証
└── constants.ts               # アプリケーション定数
```

**例:**

```typescript
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
})
```

---

### 10. `src/testing/` - テストユーティリティ

```
src/testing/
├── mocks/                     # MSWモックハンドラー
│   ├── handlers/
│   │   ├── auth.ts
│   │   └── users.ts
│   └── browser.ts             # MSWブラウザ設定
└── test-utils.tsx             # テストユーティリティ
```

---

## Feature構成の詳細

各Featureは以下の構造を持ちます：

```
src/features/users/
├── api/                       # API通信
│   ├── queries.ts             # TanStack Query（取得）
│   ├── mutations.ts           # TanStack Query（更新）
│   └── client.ts              # APIクライアント
│
├── components/                # Featureのコンポーネント
│   ├── UserList.tsx           # ユーザー一覧
│   ├── UserDetail.tsx         # ユーザー詳細
│   ├── UserForm.tsx           # ユーザーフォーム
│   └── UserCard.tsx           # ユーザーカード
│
├── hooks/                     # FeatureのカスタムHooks
│   └── useUserFilter.ts       # ユーザーフィルター
│
├── stores/                    # Featureのローカルストア
│   └── userFilterStore.ts     # フィルター状態管理
│
├── types/                     # Featureの型定義
│   └── index.ts               # User型など
│
├── utils/                     # Featureのユーティリティ
│   └── userHelpers.ts         # ユーザー関連ヘルパー
│
└── index.ts                   # エクスポート（必要に応じて）
```

### Feature構成の原則

#### 1. 必要なディレクトリのみ作成

すべてのFeatureが全ディレクトリを持つ必要はありません。必要なものだけ作成します。

```
// シンプルなFeatureの例
src/features/dashboard/
├── components/
│   └── DashboardStats.tsx
└── types/
    └── index.ts
```

#### 2. Feature内でのインポート

```typescript
// ✅ Good: 同じFeature内でのインポート
import { UserCard } from '@/features/users/components/UserCard'
import { User } from '@/features/users/types'

// ✅ Good: 共通コードからのインポート
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api-client'

// ❌ Bad: 他のFeatureからのインポート
import { ProductCard } from '@/features/products/components/product-card'
```

---

## コードフローの方向性

```
┌─────────────────────────────────────────────┐
│              src/app/                       │
│         (Application Layer)                 │
│  - ルーティング                              │
│  - ページコンポーネント                       │
└─────────────────────────────────────────────┘
              ↑
              │ インポート可能
              │
┌─────────────────────────────────────────────┐
│           src/features/                     │
│         (Feature Layer)                     │
│  - 機能ごとのモジュール                       │
│  - ビジネスロジック                          │
└─────────────────────────────────────────────┘
              ↑
              │ インポート可能
              │
┌─────────────────────────────────────────────┐
│  src/components, hooks, lib, utils, etc.   │
│         (Shared Layer)                      │
│  - 共通コンポーネント                         │
│  - 共通ユーティリティ                         │
│  - ライブラリ設定                            │
└─────────────────────────────────────────────┘
```

### インポートルール

| レイヤー | インポート可能 | インポート不可 |
|---------|--------------|--------------|
| **app** | features, 共通コード | - |
| **features** | 共通コード, 同じfeature内 | 他のfeatures |
| **共通コード** | - | features, app |

---

## 実装例

### 例1: ユーザー管理機能

#### Feature構成

```
src/features/users/
├── api/
│   ├── queries.ts
│   └── mutations.ts
├── components/
│   ├── UserList.tsx
│   └── UserForm.tsx
└── types/
    └── index.ts
```

#### 1. 型定義

```typescript
// src/features/users/types/index.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
}
```

#### 2. API通信

```typescript
// src/features/users/api/queries.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { User } from '../types'

const fetchUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/users')

  return data
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}
```

```typescript
// src/features/users/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { CreateUserInput, User } from '../types'

const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data } = await apiClient.post('/users', input)

  return data
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

#### 3. コンポーネント

```typescript
// src/features/users/components/user-list.tsx
'use client'

import { useUsers } from '../api/queries'
import { Table } from '@/components/ui/table'

export const UserList = () => {
  const { data: users, isLoading, error } = useUsers()

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラーが発生しました</div>

  return (
    <Table>
      <thead>
        <tr>
          <th>名前</th>
          <th>メール</th>
          <th>役割</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
```

#### 4. ページ

```typescript
// src/app/(dashboard)/users/page.tsx
import { UserList } from '@/features/users/components/user-list'
import { PageHeader } from '@/components/page-header'

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="ユーザー管理" />
      <UserList />
    </div>
  )
}
```

---

## ベストプラクティス

### 1. barrel exportsを避ける

```typescript
// ❌ Bad: index.tsでまとめてエクスポート
// src/features/users/components/index.ts
export * from './user-list'
export * from './user-form'
export * from './user-card'

// インポート時
import { UserList, UserForm } from '@/features/users/components'

// ✅ Good: 直接インポート
import { UserList } from '@/features/users/components/user-list'
import { UserForm } from '@/features/users/components/user-form'
```

**理由:** Tree-shakingが効きやすく、ビルドサイズが削減される

---

### 2. TypeScriptのPath Aliasを活用

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ Good: 絶対パスでインポート
import { Button } from '@/components/ui/button'
import { useUsers } from '@/features/users/api/queries'

// ❌ Bad: 相対パスでインポート
import { Button } from '../../../components/ui/button'
```

---

### 3. ESLintでアーキテクチャを強制

```javascript
// eslint.config.mjs（追加設定例）
{
  rules: {
    // Feature間のインポートを禁止
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@/features/*/*'],
            message: 'Feature間の直接インポートは禁止です。共通化する場合はsharedに移動してください。',
          },
        ],
      },
    ],
  },
}
```

---

### 4. コンポーネントの粒度を適切に

```typescript
// ✅ Good: 適切な粒度
<UserList />                  // Feature Component
  <Table />                   // Shared Component
    <TableRow />              // Shared Component

// ❌ Bad: 巨大なコンポーネント
<UserListWithFilterAndSortAndPagination />
```

---

## アンチパターン

### ❌ 1. Feature間の直接インポート

```typescript
// ❌ Bad
// src/features/products/components/product-card.tsx
import { UserAvatar } from '@/features/users/components/user-avatar'

// ✅ Good: 共通コンポーネントに移動
import { UserAvatar } from '@/components/user-avatar'
```

---

### ❌ 2. ページコンポーネントにビジネスロジックを記述

```typescript
// ❌ Bad
// src/app/(dashboard)/users/page.tsx
export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
  }, [])

  return <div>{/* ... */}</div>
}

// ✅ Good: Featureにロジックを分離
export default function UsersPage() {
  return <UserList />
}
```

---

### ❌ 3. shared配下のコードがfeaturesをインポート

```typescript
// ❌ Bad
// src/components/layouts/header.tsx
import { UserMenu } from '@/features/users/components/user-menu'

// ✅ Good: propsでコンポーネントを受け取る
interface HeaderProps {
  userMenu: React.ReactNode
}

export const Header = ({ userMenu }: HeaderProps) => {
  return (
    <header>
      <Logo />
      {userMenu}
    </header>
  )
}

// 使用側（app層）
<Header userMenu={<UserMenu />} />
```

---

## まとめ

### ディレクトリ構成のメリット

1. **スケーラビリティ** - 機能追加が容易
2. **保守性** - コードの場所が明確
3. **再利用性** - 共通コードの管理が容易
4. **チーム開発** - 並行開発がしやすい
5. **テスト** - モジュールごとにテスト可能

### 重要な原則

- ✅ Feature単位でコードを整理
- ✅ 単一方向のコードフロー（components/hooks/lib/utils → features → app）
- ✅ Feature間の直接インポートを禁止
- ✅ ページコンポーネントは薄く保つ
- ✅ 共通コードは`components/`, `hooks/`, `lib/`, `utils/`に配置
- ✅ ファイル名はkebab-case（例: `user-list.tsx`）

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[環境構築ガイド](./01-setup.md)** - 開発環境のセットアップ
- **[使用ライブラリ一覧](./03-libraries.md)** - 使用している技術スタックの説明
- **[状態管理戦略](./04-state-management.md)** - useState/Zustand/TanStack Queryの使い分け

### 外部リンク

- [bulletproof-react](https://github.com/alan2207/bulletproof-react) - アーキテクチャの参考元
- [Next.js App Router](https://nextjs.org/docs/app) - Next.js公式ドキュメント
- [React Feature-Based Architecture](https://profy.dev/article/react-folder-structure) - Feature-Based構成の解説
