# プロジェクト構成

## ディレクトリ構成

```
src/
├── app/                    # App Router (Next.js 15+)
│   ├── (sample)/           # ルートグループ（サンプル実装）
│   │   ├── login/          # ログインページ
│   │   └── users/          # ユーザー管理ページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   ├── not-found.tsx       # 404ページ
│   ├── provider.tsx        # AppProvider（MSW, ErrorBoundary, ReactQuery）
│   └── globals.css         # グローバルスタイル
│
├── features/              # 機能モジュール（bulletproof-react）
│   ├── auth/               # 認証機能
│   └── users/              # ユーザー管理機能
│
├── components/            # 共通コンポーネント
│   ├── ui/                # 基本UI（shadcn/ui風）
│   │   ├── button/         # Button
│   │   ├── input/          # Input
│   │   ├── select/         # Select
│   │   ├── alert/          # Alert
│   │   ├── card/           # Card
│   │   ├── label/          # Label
│   │   ├── form-field/     # FormField
│   │   ├── error-message/  # ErrorMessage
│   │   ├── loading-spinner/ # LoadingSpinner
│   │   └── index.ts        # バレルエクスポート
│   ├── layout/            # レイアウトコンポーネント
│   │   ├── page-header.tsx
│   │   └── page-layout.tsx
│   └── errors/            # エラー表示
│       └── main.tsx        # MainErrorFallback
│
├── lib/                   # 外部ライブラリ設定
│   ├── api-client.ts      # Axios設定（インターセプター含む）
│   ├── tanstack-query.ts  # TanStack Query設定
│   └── msw.tsx            # MSWProvider
│
├── utils/                 # ユーティリティ関数
│   └── cn.ts              # clsx + tailwind-merge
│
├── config/                # 設定
│   ├── env.ts             # 環境変数（Zod検証）
│   ├── paths.ts           # ルーティングパス定義
│   └── constants.ts       # 定数定義
│
├── types/                 # 共通型定義
│   └── global.d.ts        # グローバル型定義
│
└── mocks/                 # MSW設定
    ├── browser.ts          # ブラウザ用worker
    ├── handlers.ts         # ハンドラー統合
    └── handlers/           # 機能別ハンドラー
        └── api/v1/
            ├── auth-handlers.ts
            └── user-handlers.ts
```

---

## bulletproof-reactアーキテクチャ

### コードフローの方向性

```
共通コード (components, hooks, lib, utils)
    ↓
features (機能モジュール)
    ↓
app (Next.js App Router)
```

### インポートルール

| レイヤー | インポート可能 | インポート不可 |
|---------|--------------|--------------|
| **app** | features, 共通コード | - |
| **features** | 共通コード, 同じfeature内 | 他のfeatures |
| **共通コード** | - | features, app |

**例:**

```typescript
// ✅ Good
import { Button } from '@/components/ui/button'
import { useFeature } from './hooks/use-feature'

// ❌ Bad: feature間でインポート
import { FeatureBCard } from '@/features/feature-b/components/card'
```

---

## Feature構成

### 実際の構成例（users feature）

```
features/users/
├── api/                        # API通信
│   ├── get-users.ts            # GET /api/v1/users
│   ├── get-user.ts             # GET /api/v1/users/:id
│   ├── create-user.ts          # POST /api/v1/users
│   ├── update-user.ts          # PATCH /api/v1/users/:id
│   ├── delete-user.ts          # DELETE /api/v1/users/:id
│   └── index.ts                # エクスポート
│
├── components/                 # コンポーネント
│   ├── users-page/             # 一覧ページ
│   │   ├── users-page.tsx
│   │   ├── users-page.stories.tsx
│   │   └── index.ts
│   ├── new-user-page/          # 作成ページ
│   │   ├── new-user-page.tsx
│   │   ├── new-user-page.stories.tsx
│   │   └── index.ts
│   ├── edit-user-page/         # 編集ページ
│   │   ├── edit-user-page.tsx
│   │   ├── edit-user-page.stories.tsx
│   │   └── index.ts
│   └── delete-user-page/       # 削除ページ
│       ├── delete-user-page.tsx
│       ├── delete-user-page.stories.tsx
│       └── index.ts
│
├── types/                      # 型定義
│   └── index.ts
│
└── index.ts                    # エクスポート
```

### 最小構成（auth feature）

```
features/auth/
├── api/                        # API通信
│   ├── login.ts
│   ├── logout.ts
│   ├── get-user.ts
│   └── index.ts
│
├── components/                 # コンポーネント
│   └── login-page.tsx
│
├── stores/                     # Zustandストア
│   └── auth-store.ts
│
├── types/                      # 型定義
│   └── index.ts
│
└── index.ts
```

### ディレクトリ作成の方針

- **必要なディレクトリのみ作成** - hooksやschemasは必要になったら追加
- **コンポーネントは用途ごとにディレクトリ化** - Storybookファイルも一緒に管理
- **storesは認証など必要な場合のみ** - サーバーステートはTanStack Queryで管理

---

## ファイル命名規則

| タイプ | 形式 | 例 |
|--------|------|---|
| **コンポーネント** | kebab-case | `user-form.tsx` |
| **フック** | kebab-case, `use-`プレフィックス | `use-users.ts` |
| **ストア** | kebab-case, `-store`サフィックス | `user-store.ts` |
| **ユーティリティ** | kebab-case | `format-date.ts` |

**コンポーネント命名例:**

```typescript
// ファイル名: user-form.tsx
export const UserForm = () => { ... }

// ファイル名: use-users.ts
export const useUsers = () => { ... }
```

---

## ベストプラクティス

### 1. Path Aliasを活用

```typescript
// ✅ Good
import { Button } from '@/components/ui/button'

// ❌ Bad
import { Button } from '../../../components/ui/button'
```

### 2. barrel exportsを避ける

```typescript
// ❌ Bad
export * from './user-list'
export * from './user-form'

// ✅ Good: 直接インポート
import { UserList } from '@/features/users/components/user-list'
```

---

## 参考リンク

- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [Next.js App Router](https://nextjs.org/docs/app)
