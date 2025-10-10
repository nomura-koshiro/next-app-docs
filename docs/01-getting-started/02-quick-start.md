# クイックスタート

アプリを最速で起動するためのガイドです。詳細な環境構築は[セットアップガイド](./01-setup.md)を参照してください。

## 目次

1. [前提条件](#前提条件)
2. [インストール](#インストール)
3. [開発サーバー起動](#開発サーバー起動)
4. [主要コマンド](#主要コマンド)
5. [次のステップ](#次のステップ)

---

## 前提条件

以下がインストールされていることを確認してください：

```bash
# Node.js 20以上
node --version  # v20.x.x以上

# pnpm 9以上
pnpm --version  # 9.x.x以上

# Git
git --version
```

---

## インストール

### 1. リポジトリのクローン

```bash
# HTTPSでクローン
git clone https://CMO203934-PJ925@dev.azure.com/CMO203934-PJ925/PJ925/_git/CAMP_front
cd CAMP_front

# または SSHでクローン
git clone git@ssh.dev.azure.com:v3/CMO203934-PJ925/PJ925/CAMP_front
cd CAMP_front
```

### 2. 依存関係のインストール

```bash
# すべての依存関係をインストール
pnpm install
```

### 3. 環境変数の設定

```bash
# フロントエンド用の環境変数ファイルをコピー
cd CAMP_front
cp .env.example .env.local
```

`.env.local`を編集：

```bash
# API設定
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# MSW (Mock Service Worker) 設定
# 開発環境でMSWを有効にする場合は'true'に設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# アプリケーション設定
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_API_PORT=8080
```

---

## 開発サーバー起動

### フロントエンドのみ起動

```bash
# プロジェクトルートから
pnpm dev

# または CAMP_front から
cd CAMP_front
pnpm dev
```

ブラウザで http://localhost:3000 を開く

### ビルドとプレビュー

```bash
# 本番ビルド
pnpm build

# ビルド済みアプリを起動
pnpm start
```

---

## 主要コマンド

### 開発

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（HMR有効） |
| `pnpm build` | 本番ビルド |
| `pnpm start` | ビルド済みアプリを起動 |
| `pnpm typecheck` | TypeScript型チェック |

### コード品質

| コマンド | 説明 |
|---------|------|
| `pnpm lint` | ESLintチェック |
| `pnpm lint:fix` | ESLint自動修正 |
| `pnpm format` | Prettierで整形 |
| `pnpm format:check` | Prettier整形チェック |

### テスト

| コマンド | 説明 |
|---------|------|
| `pnpm test` | ユニットテスト実行 |
| `pnpm test:ui` | Vitest UI起動 |
| `pnpm e2e` | E2Eテスト実行 |

### CI

| コマンド | 説明 |
|---------|------|
| `pnpm ci` | 型チェック + lint + format + build |

---

## ディレクトリ構造

```
CAMP_front/
├── apps/
│   └── frontend/          # Next.js フロントエンド
│       ├── src/
│       │   ├── app/       # App Router
│       │   ├── features/  # 機能モジュール
│       │   ├── components/# 共通コンポーネント
│       │   ├── lib/       # ライブラリ設定
│       │   └── stores/    # グローバルストア
│       └── public/        # 静的ファイル
│
└── docs/                 # 開発者ドキュメント
```

詳細は[プロジェクト構造](../02-architecture/01-project-structure.md)を参照

---

## トラブルシューティング

### ポート3000が使用中

```bash
# Windowsの場合
netstat -ano | findstr :3000
taskkill /PID <プロセスID> /F

# 別のポートで起動
PORT=3001 pnpm dev
```

### ビルドエラー

```bash
# .nextディレクトリを削除して再ビルド
rm -rf CAMP_front/.next
pnpm build
```

### 依存関係エラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules CAMP_front/node_modules
pnpm install --frozen-lockfile
```

### 型エラー

```bash
# 型チェック実行
pnpm typecheck

# 特定ファイルの型チェック
npx tsc --noEmit src/path/to/file.ts
```

---

## 次のステップ

### 1. プロジェクト構造を理解する

[プロジェクト構造](../02-architecture/01-project-structure.md)でbulletproof-reactアーキテクチャを学ぶ

### 2. コーディング規約を確認する

[コーディング規約](../05-development/01-coding-standards.md)でESLint・Prettierルールを確認

### 3. 技術スタックを理解する

[技術スタック](../03-core-concepts/01-tech-stack.md)で使用ライブラリを確認

### 4. コンポーネントを作成する

[コンポーネント設計](../04-implementation/01-component-design.md)で設計原則を学ぶ

---

## よくある質問

### Q: バックエンドはどこ？

A: このドキュメントはフロントエンド専用です。バックエンド（FastAPI）は別途セットアップが必要です。

### Q: Storybookを起動したい

```bash
cd CAMP_front
pnpm storybook
```

ブラウザで http://localhost:6006 を開く

### Q: VSCode拡張機能は？

必須拡張機能：
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

詳細は[セットアップガイド](./01-setup.md#vscode設定)を参照

---

## 参考リンク

### 内部ドキュメント

- [セットアップガイド](./01-setup.md) - 詳細な環境構築手順
- [プロジェクト構造](../02-architecture/01-project-structure.md) - ディレクトリ構成
- [コーディング規約](../05-development/01-coding-standards.md) - コード品質管理

### 外部リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Documentation](https://pnpm.io/)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
