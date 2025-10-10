# アプリ 開発者ドキュメント

本プロジェクトの開発者向けドキュメントです。bulletproof-reactアーキテクチャに基づいて設計されています。

## 📚 ドキュメント構成

### 01. Getting Started

プロジェクトを始めるための基本情報

- [01. セットアップガイド](./01-getting-started/01-setup.md) - 開発環境の構築手順
- [02. クイックスタート](./01-getting-started/02-quick-start.md) - 最速で起動するガイド

### 02. Architecture

プロジェクトのアーキテクチャと設計原則

- [01. プロジェクト構造](./02-architecture/01-project-structure.md) - ディレクトリ構成とbulletproof-react原則
- [02. bulletproof-react適用指針](./02-architecture/02-bulletproof-react.md) - アーキテクチャの実践ガイド

### 03. Core Concepts

技術スタックと主要概念

- [01. 技術スタック](./03-core-concepts/01-tech-stack.md) - 使用技術とライブラリ
- [02. 状態管理](./03-core-concepts/02-state-management.md) - Zustand + TanStack Query
- [03. API統合](./03-core-concepts/03-api-integration.md) - Axios + TanStack Query
- [04. ルーティング](./03-core-concepts/04-routing.md) - Next.js App Router
- [05. スタイリング](./03-core-concepts/05-styling.md) - Tailwind CSS v4 + CVA

### 04. Implementation

実装ガイドとベストプラクティス

- [01. コンポーネント設計](./04-implementation/01-component-design.md) - コンポーネント設計原則
- [02. フォーム・バリデーション](./04-implementation/02-forms-validation.md) - React Hook Form + Zod

### 05. Development

開発プロセスとツール

- [01. コーディング規約](./05-development/01-coding-standards.md) - ESLint + Prettier設定
- [02. Storybook](./05-development/02-storybook.md) - UIコンポーネント開発
- [03. MSW](./05-development/03-msw.md) - Mock Service Worker
- [04. テスト](./05-development/04-testing.md) - Vitest + Playwright

### 06. Reference

参考資料とリンク集

- [01. リソース](./06-reference/01-resources.md) - 外部リンク・学習リソース

---

## 🚀 クイックスタート

### 1. 環境構築

```bash
# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev
```

詳細は [セットアップガイド](./01-getting-started/01-setup.md) を参照

### 2. コード品質管理

```bash
# リント + フォーマット
pnpm lint
pnpm format

# 型チェック
pnpm typecheck

# すべてのチェック実行
pnpm ci
```

詳細は [コーディング規約](./05-development/01-coding-standards.md) を参照

---

## 🏗️ アーキテクチャ原則

アプリは[bulletproof-react](https://github.com/alan2207/bulletproof-react)アーキテクチャを採用しています。

### 主要原則

1. **Feature-Based Organization** - 機能ごとにコードを分離
2. **Unidirectional Codebase Flow** - 単一方向のコードフロー
3. **Separation of Concerns** - 関心の分離
4. **No Cross-Feature Imports** - Feature間の直接インポート禁止

### コードフローの方向性

```
共通コード (components, hooks, lib, utils)
    ↓
features (各機能モジュール)
    ↓
app (Next.js App Router)
```

詳細は [プロジェクト構造](./02-architecture/01-project-structure.md) を参照

---

## 🛠️ 技術スタック

### フロントエンド

| カテゴリ | 技術 |
|---------|------|
| **フレームワーク** | Next.js 15, React 19, TypeScript 5.5+ |
| **スタイリング** | Tailwind CSS v4, CVA |
| **状態管理** | Zustand (クライアント), TanStack Query (サーバー) |
| **フォーム** | React Hook Form, Zod |
| **テスト** | Vitest, Playwright |
| **開発ツール** | ESLint, Prettier, Storybook, MSW |

詳細は [技術スタック](./03-core-concepts/01-tech-stack.md) を参照

---

## 📁 プロジェクト構造

> **📝 注意:** 以下は目標とするプロジェクト構造です。`features/`、`stores/`、`hooks/`、`utils/`などは現在空のディレクトリとして存在し、実装は進行中です。

```
CAMP_front/src/
├── app/                    # Next.js App Router
│   ├── (group-a)/          # ルートグループA
│   └── (group-b)/          # ルートグループB
│
├── features/              # 機能モジュール（将来実装予定）
│   ├── {feature-a}/       # 機能A
│   ├── {feature-b}/       # 機能B
│   ├── {feature-c}/       # 機能C
│   └── {feature-d}/       # 機能D
│
├── components/            # 共通コンポーネント
│   ├── ui/                # 基本UIコンポーネント (shadcn/ui)
│   ├── errors/            # エラー表示コンポーネント
│   └── layouts/           # レイアウト
│
├── lib/                   # 外部ライブラリ設定
│   ├── api-client.ts      # Axios APIクライアント
│   ├── tanstack-query.ts  # TanStack Query設定
│   ├── msw.tsx            # Mock Service Worker設定
│   └── utils.ts           # ユーティリティ関数
│
├── mocks/                 # MSWモックハンドラー
├── config/                # 設定ファイル (env.ts, paths.ts, constants.ts)
├── hooks/                 # 共通カスタムフック（将来実装予定）
├── types/                 # 共通型定義
└── utils/                 # ユーティリティ（将来実装予定）
```

詳細は [プロジェクト構造](./02-architecture/01-project-structure.md) を参照

---

## 📝 コーディング規約

### 命名規則

| タイプ | 形式 | 例 |
|--------|------|------|
| **コンポーネント** | kebab-case | `{feature}-form.tsx` |
| **フック** | kebab-case, `use-`プレフィックス | `use-{feature}.ts` |
| **ストア** | kebab-case, `-store`サフィックス | `{feature}-store.ts` |

### インポートルール

```typescript
// ✅ Good: 正しい依存方向
// app からfeaturesをインポート
import { FeatureList } from '@/features/{feature-name}'

// featuresから共通コードをインポート
import { Button } from '@/components/ui/button'

// ❌ Bad: 逆方向のインポート
// 共通コードからfeaturesをインポート
import { FeatureForm } from '@/features/{feature-name}'
```

詳細は [コーディング規約](./05-development/01-coding-standards.md) を参照

---

## 🔗 関連リンク

### 外部ドキュメント

- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
