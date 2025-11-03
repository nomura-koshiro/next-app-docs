# コードリーディングガイド

このガイドは、Next.js Appプロジェクトに新規参加したメンバーが効率的にコードベースを理解できるよう、推奨される読み方と重要なポイントをまとめたものです。

## このガイドの目的

- プロジェクトの全体像を素早く把握する
- 重要なコンポーネントと実装パターンを理解する
- コードを読む順序と注目すべきポイントを提示する
- bulletproof-reactアーキテクチャの実践例を学ぶ

## コードリーディングの推奨順序

### ステップ1: プロジェクト概要の把握

まず、プロジェクトの全体像を理解しましょう。

1. **README.md** - プロジェクト概要と主要機能
   - 位置: `C:\developments\next-app-docs\README.md`
   - 内容: プロジェクトの目的、技術スタック、クイックスタート

2. **package.json** - 依存関係とスクリプト
   - 位置: `C:\developments\next-app-docs\package.json`
   - 内容: npm dependencies、開発スクリプト、メタデータ

3. **ドキュメント目次**
   - 位置: `docs/README.md`
   - 内容: 全ドキュメントの一覧と構成

### ステップ2: 設定とエントリーポイント

次に、アプリケーションがどのように起動し、設定されるかを理解します。

1. **config/env.ts** - 環境変数の検証と型定義
   - 位置: `src/config/env.ts`
   - 重要ポイント:
     - Zodによる環境変数の型安全な読み込み
     - `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ENABLE_API_MOCKING`

2. **config/paths.ts** - ルーティングパス定義
   - 位置: `src/config/paths.ts`
   - 重要ポイント:
     - アプリケーション全体で使用するパス定数
     - 一元管理されたルート定義

3. **app/layout.tsx** - ルートレイアウト
   - 位置: `src/app/layout.tsx`
   - 重要ポイント:
     - HTMLのルート構造
     - グローバルスタイルの読み込み
     - メタデータ設定

4. **app/provider.tsx** - アプリケーションプロバイダー
   - 位置: `src/app/provider.tsx`
   - 重要ポイント:
     - MSWProvider（APIモック）
     - ErrorBoundary（エラーハンドリング）
     - TanStack Query Provider（サーバーステート管理）

### ステップ3: アーキテクチャの理解

bulletproof-reactアーキテクチャの実装を理解します。

#### コードフローの方向性

```text
共通コード (components, hooks, lib, utils)
    ↓
features (機能モジュール)
    ↓
app (Next.js App Router)
```

#### 重要な原則

1. **Feature-Based Organization** - 機能ごとにコードを分離
2. **Unidirectional Codebase Flow** - 単一方向のコードフロー
3. **No Cross-Feature Imports** - Feature間の直接インポート禁止

**インポートルール:**

| レイヤー | インポート可能 | インポート不可 |
|---------|--------------|--------------|
| **app** | features, 共通コード | - |
| **features** | 共通コード, 同じfeature内 | 他のfeatures |
| **共通コード** | - | features, app |

### ステップ4: UIコンポーネント層

UIコンポーネントライブラリを理解します。

1. **components/sample-ui/** - 基本UIコンポーネント
   - 推奨読み順:
     1. `button/` - Buttonコンポーネント
        - CVA（Class Variance Authority）によるvariant管理
        - Tailwind CSSスタイリング
     2. `input/` - Inputコンポーネント
     3. `form-field/` - FormFieldコンポーネント
        - React Hook Formとの統合
        - ControlledFormField（制御されたフォームフィールド）
     4. `error-message/` - ErrorMessageコンポーネント

   - 重要ポイント:
     - shadcn/ui風の実装
     - `forwardRef`による参照の転送
     - TypeScript型定義の活用
     - CVAによるvariant管理

2. **components/layout/** - レイアウトコンポーネント
   - `page-header.tsx` - ページヘッダー
   - `page-layout.tsx` - ページレイアウト

3. **components/errors/** - エラー表示
   - `main.tsx` - MainErrorFallback（エラー境界のフォールバック）

### ステップ5: Feature層のビジネスロジック

Feature層は、ビジネスロジックの中核です。

#### 推奨読み順: sample-auth feature

1. **features/sample-auth/** - 認証機能（最小構成の例）

   ```text
   features/sample-auth/
   ├── api/                    # API通信
   │   ├── login.ts
   │   ├── logout.ts
   │   ├── get-user.ts
   │   └── index.ts
   ├── routes/                 # ルート（ページ）コンポーネント
   │   └── sample-login/
   │       ├── login.tsx       # ページコンポーネント
   │       ├── login.hook.ts   # カスタムフック
   │       ├── components/     # ページ固有コンポーネント
   │       └── index.ts
   ├── stores/                 # Zustandストア
   │   └── auth-store.ts
   ├── types/                  # 型定義
   │   ├── index.ts            # 型のre-export
   │   ├── api.ts              # APIレスポンススキーマ
   │   └── forms.ts            # フォームバリデーションスキーマ
   └── index.ts
   ```

   - 読み方:
     1. `routes/sample-login/login.tsx` - ページコンポーネント
     2. `routes/sample-login/login.hook.ts` - ビジネスロジック
     3. `types/forms.ts` - バリデーション定義
     4. `api/login.ts` - API通信
     5. `stores/auth-store.ts` - クライアントステート管理

#### 推奨読み順: sample-users feature

1. **features/sample-users/** - ユーザー管理機能（フル構成の例）

   ```text
   features/sample-users/
   ├── api/                    # API通信
   │   ├── get-users.ts        # 一覧取得
   │   ├── get-user.ts         # 詳細取得
   │   ├── create-user.ts      # 作成
   │   ├── update-user.ts      # 更新
   │   ├── delete-user.ts      # 削除
   │   └── index.ts
   ├── routes/                 # ルート（ページ）コンポーネント
   │   ├── sample-users/       # 一覧ページ
   │   ├── sample-new-user/    # 作成ページ
   │   ├── sample-edit-user/   # 編集ページ
   │   └── sample-delete-user/ # 削除ページ
   ├── components/             # 共有コンポーネント
   │   └── user-form.tsx
   ├── types/                  # 型定義
   │   ├── index.ts            # 型のre-export
   │   ├── api.ts              # APIレスポンススキーマ
   │   └── forms.ts            # フォームバリデーションスキーマ
   └── index.ts
   ```

   - 読み方:
     1. `routes/sample-users/users.tsx` - 一覧ページ
     2. `routes/sample-users/users.hook.ts` - 一覧のビジネスロジック
     3. `api/get-users.ts` - API通信
     4. `routes/sample-new-user/` - 作成ページ（フォーム実装の参考）
     5. `components/user-form.tsx` - 共有フォームコンポーネント

### ステップ6: API通信層

API通信の実装パターンを理解します。

1. **lib/api-client.ts** - Axios設定
   - 重要ポイント:
     - ベースURL設定（環境変数から取得）
     - リクエスト/レスポンスインターセプター
     - エラーハンドリング

2. **API関数の実装パターン**

   例: `features/sample-users/api/get-users.ts`

   ```typescript
   import { apiClient } from '@/lib/api-client'
   import type { User } from '../types'

   export const getUsers = async (): Promise<User[]> => {
     const response = await apiClient.get<User[]>('/users')
     return response.data
   }
   ```

   - パターン:
     - `apiClient`を使用してHTTPリクエスト
     - 型安全なレスポンス
     - エラーはインターセプターで処理

### ステップ7: 状態管理

状態管理の実装パターンを理解します。

#### 1. サーバーステート（TanStack Query）

**lib/tanstack-query.ts** - TanStack Query設定

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})
```

**使用例（カスタムフック）:**

```typescript
// features/sample-users/routes/sample-users/users.hook.ts
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../api'

export const useUsersPage = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  return { users, isLoading, error }
}
```

#### 2. クライアントステート（Zustand）

**使用例（認証ストア）:**

```typescript
// features/sample-auth/stores/auth-store.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
```

- 使い分け:
  - **サーバーステート** → TanStack Query（API取得データ）
  - **クライアントステート** → Zustand（認証状態、UIステート）

### ステップ8: モックとテスト

モック実装とテスト戦略を理解します。

1. **mocks/** - MSW設定
   - `browser.ts` - ブラウザ用MSWワーカー
   - `handlers.ts` - ハンドラー統合
   - `handlers/api/v1/sample/` - エンドポイントごとのモックハンドラー

2. **MSWハンドラーの実装パターン**

   例: `mocks/handlers/api/v1/sample/user-handlers.ts`

   ```typescript
   import { http, HttpResponse } from 'msw'

   export const userHandlers = [
     http.get('/api/v1/users', () => {
       return HttpResponse.json([
         { id: 1, name: 'John Doe', email: 'john@example.com' },
       ])
     }),
   ]
   ```

3. **テストファイルの構成**
   - コンポーネントと同じディレクトリに配置
   - `.test.tsx`, `.stories.tsx` サフィックス

## 主要コンポーネントの詳細解説

### 1. アプリケーション起動フロー

```text
app/layout.tsx
  └─ AppProvider (app/provider.tsx)
      ├─ MSWProvider             # APIモック（開発時のみ）
      │   └─ browser.start()
      ├─ ErrorBoundary           # エラー境界
      │   └─ MainErrorFallback
      └─ QueryClientProvider     # TanStack Query
          └─ children
```

### 2. ページレンダリングフロー（例: ユーザー一覧）

```text
1. ユーザーがアクセス
   ↓ /sample-users
2. app/(sample)/sample-users/page.tsx
   ↓ import { SampleUsersPage }
3. features/sample-users/routes/sample-users/users.tsx
   ↓ useUsersPage() hook
4. features/sample-users/routes/sample-users/users.hook.ts
   ↓ useQuery({ queryFn: getUsers })
5. features/sample-users/api/get-users.ts
   ↓ apiClient.get('/users')
6. lib/api-client.ts
   ↓ Axios request
7. MSW (開発時) or バックエンドAPI
```

### 3. フォーム送信フロー（例: ユーザー作成）

```text
1. ユーザーがフォーム入力
   ↓
2. React Hook Form（制御されたフォーム）
   ↓
3. Zodバリデーション（types/forms.ts）
   ↓ validation success
4. onSubmit handler
   ↓ useMutation
5. API関数（api/create-user.ts）
   ↓
6. バックエンドAPI
   ↓ response
7. TanStack Query キャッシュ更新
   ↓
8. UI更新（楽観的更新 or リフェッチ）
```

### 4. エラーハンドリングフロー

```text
# API エラー
apiClient (lib/api-client.ts)
  ↓ interceptor
Axiosエラー処理
  ↓
TanStack Query error state
  ↓
UIにエラー表示（ErrorMessageコンポーネント）

# レンダリングエラー
コンポーネントでエラー発生
  ↓
ErrorBoundary (app/provider.tsx)
  ↓
MainErrorFallback表示
```

## 実装パターンのベストプラクティス

### 1. ページコンポーネントパターン

```typescript
// features/sample-users/routes/sample-users/users.tsx
import { useUsersPage } from './users.hook'

export const SampleUsersPage = () => {
  const { users, isLoading, error } = useUsersPage()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error.message} />

  return (
    <PageLayout>
      <PageHeader title="Users" />
      <UsersList users={users} />
    </PageLayout>
  )
}
```

**ポイント:**

- ビジネスロジックはカスタムフックに分離
- UI構造はシンプルに保つ
- ローディング、エラーハンドリングを明示的に

### 2. カスタムフックパターン

```typescript
// features/sample-users/routes/sample-users/users.hook.ts
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../api'

export const useUsersPage = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  return {
    users: users ?? [],
    isLoading,
    error,
  }
}
```

**ポイント:**

- TanStack Queryを活用
- データの変換処理をフックで実施
- 返り値は必要最小限に

### 3. API関数パターン

```typescript
// features/sample-users/api/create-user.ts
import { apiClient } from '@/lib/api-client'
import type { User, CreateUserInput } from '../types'

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const response = await apiClient.post<User>('/users', input)
  return response.data
}
```

**ポイント:**

- 型安全な引数とレスポンス
- エラーハンドリングはインターセプターに任せる
- シンプルなAPI呼び出しのみ

### 4. Zodバリデーションパターン

```typescript
// features/sample-users/types/forms.ts
import { z } from 'zod'
import { emailSchema, nameSchema } from '@/lib/validations/fields'

export const userFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  age: z.number().min(0).max(150),
})

export type UserFormValues = z.infer<typeof userFormSchema>
```

**ポイント:**

- 共通フィールドスキーマを再利用
- `z.infer`で型を自動生成
- スキーマと型定義を一元管理

### 5. Mutationパターン（作成、更新、削除）

```typescript
// features/sample-users/routes/sample-new-user/new-user.hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '../../api'
import { useRouter } from 'next/navigation'

export const useNewUserPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      router.push('/sample-users')
    },
  })

  return {
    onSubmit: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
```

**ポイント:**

- `useMutation`でAPI呼び出し
- `onSuccess`でキャッシュ更新とナビゲーション
- エラーとローディング状態を返す

## 主要な設定ファイル

### package.json

主要な依存関係:

- **フレームワーク**: next, react, react-dom
- **スタイリング**: tailwindcss, cva, clsx
- **状態管理**: zustand, @tanstack/react-query
- **フォーム**: react-hook-form, zod
- **テスト**: vitest, @playwright/test, @storybook/react
- **モック**: msw
- **HTTP**: axios

### tsconfig.json

重要な設定:

- Path Alias: `@/*` → `src/*`
- Strict mode有効
- incremental build

### next.config.ts

重要な設定:

- Turbopack有効
- 環境変数の型検証

## 次に読むべきドキュメント

コードリーディングを進めながら、以下のドキュメントを参照してください:

1. **アーキテクチャ理解**
   - [プロジェクト構造](../02-architecture/01-project-structure.md)
   - [bulletproof-react適用指針](../02-architecture/02-bulletproof-react.md)

2. **技術詳細**
   - [技術スタック](../03-core-concepts/01-tech-stack.md)
   - [状態管理](../03-core-concepts/02-state-management.md)
   - [ルーティング](../03-core-concepts/03-routing.md)
   - [スタイリング](../03-core-concepts/04-styling.md)

3. **開発ガイド**
   - [コンポーネント作成ガイド](../06-guides/02-create-component.md)
   - [Feature作成ガイド](../06-guides/04-create-feature.md)
   - [フォーム作成ガイド](../06-guides/06-create-form.md)

4. **テスト**
   - [テスト戦略](../05-testing/01-testing-strategy.md)
   - [ユニットテスト](../05-testing/02-unit-testing.md)
   - [コンポーネントテスト](../05-testing/03-component-testing.md)

## よくある質問

### Q1: どのファイルから読み始めるべきですか？

**A**: 以下の順序がおすすめです:

1. `src/app/layout.tsx` - アプリケーションの起点
2. `src/app/provider.tsx` - プロバイダー設定
3. `src/features/sample-auth/routes/sample-login/login.tsx` - 最小構成のページ例
4. `src/features/sample-users/` - フル構成のfeature例

### Q2: ビジネスロジックはどこにありますか？

**A**: `src/features/*/routes/*/**.hook.ts` ファイルにあります。各ページのカスタムフックがビジネスロジックを実装しています。

### Q3: APIエンドポイントはどこで定義されていますか？

**A**: `src/features/*/api/` ディレクトリにAPI関数として定義されています。実際のAPIコールは`lib/api-client.ts`のAxiosインスタンスを使用します。

### Q4: モックデータはどこで定義されていますか？

**A**: `src/mocks/handlers/` ディレクトリにMSWハンドラーとして定義されています。開発時は`NEXT_PUBLIC_ENABLE_API_MOCKING=true`で有効化されます。

### Q5: バリデーションスキーマはどこにありますか？

**A**:

- 共通フィールド: `src/lib/validations/fields/`
- Feature固有: `src/features/*/types`

### Q6: テストコードはどこにありますか？

**A**: 各コンポーネントと同じディレクトリに配置されています:

- ユニットテスト: `*.test.tsx`
- Storybook: `*.stories.tsx`
- E2Eテスト: 現在は未実装（Playwrightのパッケージと`pnpm e2e`コマンドは準備済み）

### Q7: 新しいfeatureを追加するにはどうすればいいですか？

**A**: コード生成ツールを使用します:

```bash
pnpm generate:feature
```

詳細は[Feature作成ガイド](../06-guides/04-create-feature.md)を参照してください。

## まとめ

このガイドに沿ってコードを読み進めることで、Next.js Appの全体像と実装の詳細を効率的に理解できます。

重要なポイント:

1. **bulletproof-reactアーキテクチャ** - Feature-Based Organization、単一方向のコードフロー
2. **状態管理の使い分け** - サーバーステート（TanStack Query）、クライアントステート（Zustand）
3. **ページパターン** - ページコンポーネント + カスタムフック
4. **型安全性** - TypeScript + Zod
5. **モック駆動開発** - MSWによるAPIモック

不明点があれば、各ドキュメントを参照するか、チームメンバーに質問してください。
