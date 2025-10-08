# CAMP プロジェクトドキュメント

このドキュメントは、CAMP（キャンプ管理システム）プロジェクトの開発者向けガイドです。

## 📚 ドキュメント構成

### 🚀 1. はじめに

プロジェクトを始める方はこちらから！

- **[環境構築ガイド](./01-getting-started/01-setup.md)**
  開発環境のセットアップ手順（Windows対応）

- **[クイックスタート](./01-getting-started/02-quick-start.md)**
  5分で始めるCAMPプロジェクト

---

### 📚 2. 基本概念

プロジェクトの全体像を理解する

- **[プロジェクト構成](./02-core-concepts/01-project-structure.md)**
  ディレクトリ構造とアーキテクチャの詳細

- **[使用ライブラリ一覧](./02-core-concepts/02-libraries.md)**
  採用している技術スタックの解説

- **[設定管理](./02-core-concepts/03-config.md)**
  環境変数と定数の管理方法

---

### 📝 3. 実装ガイド

日々の開発作業で参照するガイド

- **[状態管理戦略](./03-guides/01-state-management.md)**
  useState / Zustand / TanStack Query の使い分け

- **[REST API通信](./03-guides/02-api-client.md)**
  Axios + TanStack Query によるデータ取得

- **[フォーム実装](./03-guides/03-forms.md)**
  React Hook Form + Zod によるバリデーション

- **[コンポーネント設計原則](./03-guides/04-component-design.md)**
  Presentational/Container パターンの実践

- **[スタイリングガイド](./03-guides/05-styling.md)**
  MUI + Tailwind CSS の使い方

---

### ✨ 4. ベストプラクティス

コード品質を高めるための指針

- **[コード品質管理](./04-best-practices/01-code-quality.md)**
  ESLint + Prettier の設定と使用方法

---

### 📖 5. リファレンス

困ったときに参照する情報

- **[トラブルシューティング](./07-reference/01-troubleshooting.md)**
  よくあるエラーと解決方法

---

## 🎯 レベル別おすすめ読み順

### 🔰 初心者向け

1. **[環境構築ガイド](./01-getting-started/01-setup.md)** - 開発環境を準備
2. **[クイックスタート](./01-getting-started/02-quick-start.md)** - 実際に動かしてみる
3. **[プロジェクト構成](./02-core-concepts/01-project-structure.md)** - ディレクトリ構造を理解
4. **[使用ライブラリ一覧](./02-core-concepts/02-libraries.md)** - 使っている技術を把握
5. **[トラブルシューティング](./07-reference/01-troubleshooting.md)** - エラーが出たら参照

### 💪 中級者向け

1. **[状態管理戦略](./03-guides/01-state-management.md)** - 状態管理の使い分けを理解
2. **[コンポーネント設計原則](./03-guides/04-component-design.md)** - 良いコンポーネントの書き方
3. **[REST API通信](./03-guides/02-api-client.md)** - API通信の実装パターン
4. **[フォーム実装](./03-guides/03-forms.md)** - フォームのベストプラクティス
5. **[コード品質管理](./04-best-practices/01-code-quality.md)** - ESLint/Prettierの設定

### 🚀 上級者向け

すべてのドキュメントを読んで、プロジェクトのアーキテクチャを深く理解しましょう。

---

## 🔍 キーワード検索

### 技術スタックで探す

| 技術 | ドキュメント |
|-----|------------|
| **Next.js 15** | [プロジェクト構成](./02-core-concepts/01-project-structure.md) |
| **React 19** | [コンポーネント設計](./03-guides/04-component-design.md) |
| **TypeScript** | [コード品質管理](./04-best-practices/01-code-quality.md) |
| **TanStack Query** | [REST API通信](./03-guides/02-api-client.md), [状態管理](./03-guides/01-state-management.md) |
| **Zustand** | [状態管理戦略](./03-guides/01-state-management.md) |
| **React Hook Form + Zod** | [フォーム実装](./03-guides/03-forms.md) |
| **Material-UI** | [スタイリング](./03-guides/05-styling.md) |
| **Tailwind CSS** | [スタイリング](./03-guides/05-styling.md) |
| **ESLint + Prettier** | [コード品質管理](./04-best-practices/01-code-quality.md) |

### 目的で探す

| やりたいこと | ドキュメント |
|------------|------------|
| 開発環境をセットアップしたい | [環境構築ガイド](./01-getting-started/01-setup.md) |
| すぐに動かしてみたい | [クイックスタート](./01-getting-started/02-quick-start.md) |
| ディレクトリ構造を知りたい | [プロジェクト構成](./02-core-concepts/01-project-structure.md) |
| 状態管理の使い分けを知りたい | [状態管理戦略](./03-guides/01-state-management.md) |
| APIからデータを取得したい | [REST API通信](./03-guides/02-api-client.md) |
| フォームを実装したい | [フォーム実装](./03-guides/03-forms.md) |
| コンポーネントを作りたい | [コンポーネント設計](./03-guides/04-component-design.md) |
| スタイルを適用したい | [スタイリング](./03-guides/05-styling.md) |
| エラーを解決したい | [トラブルシューティング](./07-reference/01-troubleshooting.md) |

---

## 📌 よく使うコマンド

```bash
# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build

# 型チェック
pnpm run typecheck

# Lintチェック
pnpm run lint

# Lint自動修正
pnpm run lint:fix

# コード整形
pnpm run format

# CI（型・lint・format・build）
pnpm run ci
```

---

## 🤝 コントリビューション

ドキュメントに不足や誤りを見つけた場合は、プルリクエストを送ってください。

---

## 📞 サポート

質問や問題がある場合は、以下を参照してください：

1. **[トラブルシューティング](./07-reference/01-troubleshooting.md)** - よくあるエラー集
2. チーム内のSlackチャンネルで質問
3. GitHub Issuesで報告

---

## 📝 ドキュメント更新履歴

- 2025-01-XX: ドキュメント構成を初心者向けに再構築
- 2025-01-XX: 初版作成
