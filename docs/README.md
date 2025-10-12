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
- [03. ルーティング](./03-core-concepts/03-routing.md) - Next.js App Router
- [04. スタイリング](./03-core-concepts/04-styling.md) - Tailwind CSS v4 + CVA
- [05. 環境変数](./03-core-concepts/05-environment-variables.md) - 環境変数管理
- [06. APIクライアント](./03-core-concepts/06-api-client.md) - Axios設定
- [07. TanStack Query](./03-core-concepts/07-tanstack-query.md) - サーバーステート管理

### 04. Development

開発ガイドとツール

- [01. コーディング規約](./04-development/01-coding-standards.md) - コーディング規約とベストプラクティス
- [02. Linter・Formatter設定](./04-development/02-linter-formatter.md) - ESLint・Prettier・Stylelint詳細
- [03. コンポーネント設計](./04-development/03-component-design.md) - コンポーネント設計原則
- [04. フォーム・バリデーション](./04-development/04-forms-validation.md) - React Hook Form + Zod
- [05. API統合](./04-development/05-api-integration.md) - API統合の実装パターン
- [06. Storybook](./04-development/06-storybook.md) - UIコンポーネント開発
- [07. MSW](./04-development/07-msw.md) - Mock Service Worker

### 05. Testing

テスト戦略と実装方法

テストピラミッド、カバレッジ目標、ユニット・コンポーネント・E2Eテストの実践ガイド

- [01. テスト戦略](./05-testing/01-testing-strategy.md) - テストピラミッドとカバレッジ目標
- [02. ユニットテスト](./05-testing/02-unit-testing.md) - Vitestによる関数・フックのテスト
- [03. コンポーネントテスト](./05-testing/03-component-testing.md) - React Testing Libraryの使い方
- [04. Storybookインタラクション](./05-testing/04-storybook-interaction.md) - play関数によるUIテスト
- [05. E2Eテスト](./05-testing/05-e2e-testing.md) - Playwrightによるエンドツーエンドテスト
- [06. ベストプラクティス](./05-testing/06-best-practices.md) - 効果的なテストの書き方

### 06. Guides

実装ガイド

コンポーネント、API、機能の作成方法とトラブルシューティング

- [01. コンポーネント作成](./06-guides/01-create-component.md) - コンポーネント作成手順
- [02. API作成](./06-guides/02-create-api.md) - API統合手順
- [03. Feature作成](./06-guides/03-create-feature.md) - 機能モジュール作成
- [04. ページ追加](./06-guides/04-add-page.md) - 新規ページ追加
- [05. フォーム追加](./06-guides/05-add-form.md) - フォーム実装手順
- [06. トラブルシューティング](./06-guides/06-troubleshooting.md) - よくある問題と解決方法

### 07. Reference

参考資料とリンク集

外部ドキュメント、公式リソース、学習教材へのリンク集

- [01. リソース](./07-reference/01-resources.md) - 外部リンク・学習リソース
- [02. ユーティリティ関数](./07-reference/02-utils.md) - 日付操作・フォーマット・バリデーション関数

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

# テスト実行
pnpm test
pnpm test:ui

# E2Eテスト
pnpm e2e

# すべてのチェック実行
pnpm ci
```

詳細は [コーディング規約](./04-development/01-coding-standards.md) と [テスト戦略](./05-testing/01-testing-strategy.md) を参照

---

## 🏗️ アーキテクチャ原則

アプリは[bulletproof-react](https://github.com/alan2207/bulletproof-react)アーキテクチャを採用しています。

### 主要原則

1. **Feature-Based Organization** - 機能ごとにコードを分離
2. **Unidirectional Codebase Flow** - 単一方向のコードフロー
3. **Separation of Concerns** - 関心の分離
4. **No Cross-Feature Imports** - Feature間の直接インポート禁止

### コードフローの方向性

```text
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
| **テスト** | Vitest (ユニット), React Testing Library (コンポーネント), Playwright (E2E), Storybook (インタラクション) |
| **開発ツール** | ESLint, Prettier, Storybook, MSW |

詳細は [技術スタック](./03-core-concepts/01-tech-stack.md) を参照

---

## 📁 プロジェクト構造

> **📝 注意:** 以下はプロジェクトの標準構造です。`features/`には現在`auth`と`users`が実装されています。新しい機能は同様の構造で追加してください。

```text
CAMP_front/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ルート
│   └── (main)/            # メイン機能ルート
│
├── features/              # 機能モジュール
│   ├── auth/              # 認証機能
│   ├── users/             # ユーザー管理機能
│   └── {new-feature}/     # 新規機能（このパターンで追加）
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
└── utils/                 # ユーティリティ (date, format, validation)
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

詳細は [コーディング規約](./04-development/01-coding-standards.md) を参照

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
