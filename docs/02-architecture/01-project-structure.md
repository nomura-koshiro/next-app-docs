# プロジェクト構成

プロジェクトのディレクトリ構造とbulletproof-reactアーキテクチャの適用方法を説明します。feature-basedな構成とコードフローの方向性について解説します。

## 目次

1. [ディレクトリ構成](#ディレクトリ構成)
2. [bulletproof-reactアーキテクチャ](#bulletproof-reactアーキテクチャ)
3. [Feature構成](#feature構成)
4. [ファイル命名規則](#ファイル命名規則)
5. [ベストプラクティス](#ベストプラクティス)
6. [参考リンク](#参考リンク)

---

## ディレクトリ構成

```text
src/
├── app/                    # App Router (Next.js 15+)
│   ├── (sample)/           # ルートグループ（サンプル実装）
│   │   ├── sample-login/   # ログインページ
│   │   ├── sample-users/   # ユーザー管理ページ
│   │   ├── sample-form/    # フォームサンプル
│   │   ├── sample-file/    # ファイルアップロード・ダウンロード
│   │   └── sample-chat/    # チャットボット
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   ├── not-found.tsx       # 404ページ
│   └── provider.tsx        # AppProvider（MSW, ErrorBoundary, ReactQuery）
│
├── styles/                # スタイル
│   └── globals.css         # グローバルスタイル（Tailwind CSS）
│
├── features/              # 機能モジュール（bulletproof-react）
│   ├── sample-auth/        # 認証機能（サンプル）
│   ├── sample-users/       # ユーザー管理機能（サンプル）
│   ├── sample-form/        # フォーム機能（サンプル）
│   ├── sample-file/        # ファイル操作機能（サンプル）
│   ├── sample-chat/        # チャット機能（サンプル）
│   └── sample-page-list/   # サンプルページ一覧
│
├── components/            # 共通コンポーネント
│   ├── ui/                # 基本UI（shadcn/ui風）
│   │   ├── button/         # Button
│   │   ├── input/          # Input
│   │   ├── textarea/       # Textarea
│   │   ├── select/         # Select
│   │   ├── checkbox/       # Checkbox
│   │   ├── radio-group/    # RadioGroup
│   │   ├── switch/         # Switch
│   │   ├── alert/          # Alert
│   │   ├── card/           # Card
│   │   ├── label/          # Label
│   │   ├── form-field/     # FormField, ControlledFormField
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
│   ├── csrf.ts            # CSRFトークン管理
│   ├── tanstack-query.ts  # TanStack Query設定
│   └── msw.tsx            # MSWProvider
│
├── utils/                 # ユーティリティ関数
│   ├── index.ts            # バレルエクスポート
│   ├── cn.ts               # clsx + tailwind-merge
│   ├── date.ts             # 日付関連ユーティリティ
│   ├── error-handling.ts   # エラーハンドリングユーティリティ
│   ├── format.ts           # フォーマット関連ユーティリティ
│   └── logger.ts           # ログ出力ユーティリティ
│
├── config/                # 設定
│   ├── env.ts             # 環境変数（Zod検証）
│   ├── paths.ts           # ルーティングパス定義
│   └── constants.ts       # 定数定義
│
├── types/                 # 共通型定義
│   ├── env.d.ts            # 環境変数の型定義
│   ├── global.d.ts         # グローバル型定義
│   └── models/             # モデル型定義
│       └── user.ts         # ユーザー型定義
│
├── hooks/                 # 共通カスタムフック
│   └── use-devtools.tsx    # React Query Devtools表示制御
│
├── schemas/               # 共通バリデーションスキーマ
│   ├── index.ts            # バレルエクスポート
│   └── fields/             # フィールド単位のスキーマ
│       ├── index.ts
│       ├── email.schema.ts
│       ├── password.schema.ts
│       └── ...
│
└── mocks/                 # MSW設定
    ├── browser.ts          # ブラウザ用worker
    ├── handlers.ts         # ハンドラー統合
    └── handlers/           # 機能別ハンドラー
        └── api/v1/sample/
            ├── auth-handlers.ts
            └── user-handlers.ts
```

---

## bulletproof-reactアーキテクチャ

### コードフローの方向性

```text
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
import { SampleAuthForm } from '@/features/sample-auth/components/login-form'
```

---

## Feature構成

### 実際の構成例（sample-users feature）

```text
features/sample-users/
├── api/                        # API通信
│   ├── get-users.ts            # GET /api/v1/users
│   ├── get-user.ts             # GET /api/v1/users/:id
│   ├── create-user.ts          # POST /api/v1/users
│   ├── update-user.ts          # PATCH /api/v1/users/:id
│   ├── delete-user.ts          # DELETE /api/v1/users/:id
│   └── index.ts                # エクスポート
│
├── routes/                     # ルート（ページ）コンポーネント
│   ├── sample-users/           # 一覧ページ
│   │   ├── users.tsx           # ページコンポーネント
│   │   ├── users.hook.ts       # カスタムフック
│   │   ├── users.stories.tsx   # Storybook
│   │   ├── components/         # ページ固有コンポーネント
│   │   │   └── users-list.tsx
│   │   └── index.ts
│   ├── sample-new-user/        # 作成ページ
│   │   ├── new-user.tsx
│   │   ├── new-user.hook.ts
│   │   ├── new-user.stories.tsx
│   │   └── index.ts
│   ├── sample-edit-user/       # 編集ページ
│   │   ├── edit-user.tsx
│   │   ├── edit-user.hook.ts
│   │   ├── edit-user.stories.tsx
│   │   └── index.ts
│   └── sample-delete-user/     # 削除ページ
│       ├── delete-user.tsx
│       ├── delete-user.hook.ts
│       ├── delete-user.stories.tsx
│       ├── components/         # ページ固有コンポーネント
│       │   ├── delete-user-confirmation.tsx
│       │   └── delete-user-confirmation.stories.tsx
│       └── index.ts
│
├── components/                 # 共有コンポーネント
│   ├── user-form.tsx           # ユーザーフォーム
│   └── user-form.stories.tsx
│
├── schemas/                    # Zodバリデーションスキーマ
│   └── user-form.schema.ts     # ユーザーフォームスキーマ
│
├── types/                      # 型定義
│   └── index.ts
│
└── index.ts                    # エクスポート
```

### 最小構成（sample-auth feature）

```text
features/sample-auth/
├── api/                        # API通信
│   ├── login.ts
│   ├── logout.ts
│   ├── get-user.ts
│   └── index.ts
│
├── routes/                     # ルート（ページ）コンポーネント
│   └── sample-login/
│       ├── login.tsx           # ページコンポーネント
│       ├── login.hook.ts       # カスタムフック
│       ├── components/         # ページ固有コンポーネント
│       │   ├── login.tsx       # ログインフォーム
│       │   └── login.stories.tsx
│       └── index.ts
│
├── schemas/                    # Zodバリデーションスキーマ
│   └── login-form.schema.ts    # ログインフォームスキーマ
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
- **routesディレクトリ** - 各ルート（ページ）ごとにディレクトリを作成し、ページコンポーネント、フック、Storybookを一緒に管理
- **ページ固有コンポーネント** - ルート内でのみ使用するコンポーネントは`routes/*/components/`に配置
- **共有コンポーネント** - 複数のルートで使用するコンポーネントは`components/`に配置
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
import { UsersList } from '@/features/sample-users/routes/sample-users/components/users-list'
```

---

## 参考リンク

- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [Next.js App Router](https://nextjs.org/docs/app)
