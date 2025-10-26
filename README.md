# アプリケーション

Next.js 15 + React 19 + TypeScriptをベースにした、スケーラブルで保守性の高いWebアプリケーションです。bulletproof-reactアーキテクチャを採用しています。

## ✨ 特徴

- 🏗️ **bulletproof-react** - 機能ベースの設計
- ⚡ **Next.js 15** - App Router
- 🎨 **Tailwind CSS v4** - スタイリング
- 📝 **React Hook Form + Zod** - フォーム・バリデーション
- 🔄 **Zustand + TanStack Query** - 状態管理
- 🧪 **Vitest + Playwright** - テスト
- 📚 **Storybook** - コンポーネント開発
- 🎭 **MSW** - APIモック
- 🔧 **Plop** - コード生成

## 🚀 クイックスタート

### 前提条件

- Node.js v24.0.0 以上（推奨: v24.2.0）
- pnpm v10.19.0 以上

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local

# 開発サーバーの起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### サンプル実装

以下のサンプル実装を確認できます：

- [フォームサンプル](http://localhost:3000/sample-form) - React Hook Form + Zod を使った各種フォーム要素
- [ログイン](http://localhost:3000/sample-login) - 認証フォームの実装例
- [ユーザー管理](http://localhost:3000/sample-users) - CRUD操作の実装例
- [ファイル操作](http://localhost:3000/sample-file) - ファイルアップロード・ダウンロードの実装例
- [チャットボット](http://localhost:3000/sample-chat) - チャットインターフェースの実装例

### Storybookの起動

```bash
# Storybook起動
pnpm storybook
```

ブラウザで [http://localhost:6006](http://localhost:6006) を開いてStorybookを確認できます。

## 📁 ディレクトリ構成

```text
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ルート
│   ├── (main)/            # メイン機能ルート
│   └── layout.tsx         # ルートレイアウト
│
├── features/              # 機能モジュール（Feature-Based Organization）
│   ├── {feature}/
│   │   ├── api/           # API通信
│   │   ├── components/    # UIコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── routes/        # ルート（ページ）
│   │   ├── schemas/       # バリデーションスキーマ
│   │   └── stores/        # ローカルストア
│
├── components/            # 共通コンポーネント
│   ├── ui/                # 基本UIコンポーネント (shadcn/ui)
│   ├── errors/            # エラー表示
│   └── layouts/           # レイアウト
│
├── lib/                   # 外部ライブラリ設定
├── schemas/               # 共通バリデーションスキーマ
├── mocks/                 # MSWモックハンドラー
├── config/                # 設定ファイル
├── hooks/                 # 共通カスタムフック
├── types/                 # 共通型定義
└── utils/                 # ユーティリティ関数
```

詳細は [プロジェクト構造](./docs/02-architecture/01-project-structure.md) を参照してください。

## 📜 よく使うコマンド

```bash
# 開発
pnpm dev                  # 開発サーバー起動 (http://localhost:3000)
pnpm build                # 本番ビルド

# Storybook
pnpm storybook            # Storybook起動 (http://localhost:6006)
pnpm build-storybook      # Storybookビルド

# コード品質
pnpm lint                 # リント実行
pnpm format               # フォーマット実行
pnpm typecheck            # 型チェック
pnpm ci                   # すべてのチェック + ビルド

# テスト
pnpm test                 # ユニットテスト
pnpm e2e                  # E2Eテスト

# コード生成
pnpm generate:feature     # Feature生成
pnpm generate:component   # Component生成
```

## 📖 ドキュメント

詳細なドキュメントは `docs/` ディレクトリを参照してください。

| ドキュメント | 内容 |
|------------|------|
| [📚 ドキュメント目次](./docs/README.md) | 全ドキュメントの一覧 |
| [🚀 セットアップガイド](./docs/01-getting-started/01-setup.md) | 環境構築手順 |
| [🏗️ プロジェクト構造](./docs/02-architecture/01-project-structure.md) | ディレクトリ構成 |
| [💻 技術スタック](./docs/03-core-concepts/01-tech-stack.md) | 使用技術 |
| [📝 コーディング規約](./docs/04-development/01-coding-standards/) | 規約とベストプラクティス |
| [🧪 テスト戦略](./docs/05-testing/01-testing-strategy.md) | テストの書き方 |

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| **フレームワーク** | Next.js 15, React 19, TypeScript 5.5+ |
| **スタイリング** | Tailwind CSS v4, CVA (Class Variance Authority) |
| **状態管理** | Zustand (クライアント), TanStack Query (サーバー) |
| **フォーム** | React Hook Form, Zod |
| **テスト** | Vitest, React Testing Library, Playwright, Storybook |
| **開発ツール** | ESLint, Prettier, Stylelint, MSW, Plop |

詳細は [技術スタック](./docs/03-core-concepts/01-tech-stack.md) を参照してください。

## 🏗️ アーキテクチャ

このプロジェクトは [bulletproof-react](https://github.com/alan2207/bulletproof-react) アーキテクチャを採用しています。

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

詳細は [bulletproof-react適用指針](./docs/02-architecture/02-bulletproof-react.md) を参照してください。

## 🔗 関連リンク

- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
