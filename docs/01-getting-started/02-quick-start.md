# クイックスタート

アプリを最速で起動するためのガイドです。環境構築が完了している前提で、プロジェクトのクローンから開発サーバー起動までを説明します。

## 目次

1. [前提条件](#前提条件)
2. [インストール](#インストール)
3. [開発サーバー起動](#開発サーバー起動)
4. [主要コマンド](#主要コマンド)
5. [トラブルシューティング](#トラブルシューティング)
6. [次のステップ](#次のステップ)

---

## 前提条件

```bash
node --version  # v24.0.0 以上（推奨: v24.2.0）
pnpm --version  # 10.19.0 以上
git --version
```

---

## インストール

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd CAMP_front
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を編集:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

---

## 開発サーバー起動

```bash
pnpm dev
```

→ <http://localhost:3000> にアクセス

---

## 主要コマンド

### 開発

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm start` | ビルド済みアプリを起動 |
| `pnpm typecheck` | TypeScript型チェック |

### コード品質

| コマンド | 説明 |
|---------|------|
| `pnpm lint` | ESLintチェック |
| `pnpm lint:fix` | ESLint自動修正 |
| `pnpm format` | Prettierで整形 |

### テスト

| コマンド | 説明 |
|---------|------|
| `pnpm test` | ユニットテスト実行 |
| `pnpm e2e` | E2Eテスト実行 |
| `pnpm storybook` | Storybook起動 (port 6006) |

---

## トラブルシューティング

### ポート3000が使用中

```bash
# 別のポートで起動
pnpm dev -- -p 3001
```

### ビルドエラー

```bash
rm -rf .next
pnpm build
```

### 依存関係エラー

```bash
rm -rf node_modules
pnpm install
```

---

## 次のステップ

### サンプル実装を確認

開発サーバーを起動すると、以下のサンプル実装を確認できます：

- **フォームサンプル** (`/sample-form`) - React Hook Form + Zod を使った各種フォーム要素
- **ログイン** (`/sample-login`) - 認証フォームの実装例
- **ユーザー管理** (`/sample-users`) - CRUD操作の実装例
- **ファイル操作** (`/sample-file`) - ファイルアップロード・ダウンロードの実装例
- **チャットボット** (`/sample-chat`) - チャットインターフェースの実装例

### ドキュメントを読む

- [プロジェクト構造](../02-architecture/01-project-structure.md) - アーキテクチャを理解
- [技術スタック](../03-core-concepts/01-tech-stack.md) - 使用ライブラリを確認
- [コンポーネント設計](../04-development/03-component-design.md) - 設計原則を学ぶ
