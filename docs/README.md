# 開発者ドキュメント

本プロジェクトの開発者向けドキュメント目次です。

## 📚 ドキュメント構成

### 01. Getting Started

プロジェクトを始めるための基本情報

- [01. セットアップガイド](./01-getting-started/01-setup.md) - 開発環境の構築手順
- [02. クイックスタート](./01-getting-started/02-quick-start.md) - 最速で起動するガイド
- [03. コードリーディングガイド](./01-getting-started/03-code-reading-guide.md) - コードベースの効率的な読み方

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

#### [01. コーディング規約](./04-development/01-coding-standards/)

コーディング規約とベストプラクティス

- [基本原則](./04-development/01-coding-standards/01-basic-principles.md) - 型安全性、単一責任の原則
- [設計原則](./04-development/01-coding-standards/02-design-principles.md) - SOLID、DRY、KISS、YAGNI
- [リーダブルコード](./04-development/01-coding-standards/03-readable-code.md) - 14章まとめ
- [Next.jsベストプラクティス](./04-development/01-coding-standards/04-nextjs-best-practices.md) - 10のベストプラクティス
- [命名規則](./04-development/01-coding-standards/05-naming-conventions.md) - ファイル・変数・関数の命名
- [TypeScript規約](./04-development/01-coding-standards/06-typescript-rules.md) - 型定義、interface禁止
- [React/Next.js規約](./04-development/01-coding-standards/07-react-nextjs-rules.md) - コンポーネント、フック
- [ツール設定](./04-development/01-coding-standards/08-tools-setup.md) - ESLint、Prettier、VSCode
- [エラーハンドリング規約](./04-development/01-coding-standards/09-error-handling-rules.md) - try-catch、エラー処理

#### [02. Linter・Formatter設定](./04-development/02-linter-formatter/)

ESLint・Prettier・Stylelint詳細

- [ESLint設定](./04-development/02-linter-formatter/01-eslint.md) - ルール、プラグイン、TypeScript
- [Prettier設定](./04-development/02-linter-formatter/02-prettier.md) - 8つの設定項目詳細
- [Stylelint設定](./04-development/02-linter-formatter/03-stylelint.md) - Tailwind CSS対応
- [コマンド・IDE統合](./04-development/02-linter-formatter/04-commands-ide.md) - 実行コマンド、VSCode設定

#### [03. コンポーネント設計](./04-development/03-component-design/)

Container/Presentationalパターンとコンポーネント設計原則

- [コンポーネント設計原則](./04-development/03-component-design/index.md) - 単一責任、Container/Presentational分離

#### [04. Storybook](./04-development/04-storybook/)

UIコンポーネント開発とドキュメント化

- [概要とセットアップ](./04-development/04-storybook/01-overview.md) - Storybookの基本とセットアップ
- [ストーリー作成](./04-development/04-storybook/02-creating-stories.md) - ストーリーの書き方
- [アドオン](./04-development/04-storybook/03-addons.md) - アドオンの活用
- [Storybookテンプレート](./04-development/04-storybook/04-templates.md) - ストーリーテンプレート
- [Plop統合](./04-development/04-storybook/05-plop-integration.md) - 自動コード生成
- [Next.js機能](./04-development/04-storybook/06-nextjs-features.md) - Next.js統合
- [ベストプラクティス](./04-development/04-storybook/07-best-practices.md) - 効果的なStorybook活用

#### [05. カスタムフック](./04-development/05-custom-hooks/)

カスタムフックの実装パターンとベストプラクティス

**🎯 ガイド型（すぐに実装したい方）:**

- [React 19機能の使い分けガイド](./04-development/05-custom-hooks/guides/01-decision-guide/) - **まずここから！** useOptimistic、use()、useTransition の使い分け
- [全体像・判断フロー](./04-development/05-custom-hooks/guides/02-overview/) - どのフックを使うべきか
- [実装パターン](./04-development/05-custom-hooks/guides/03-patterns/) - プロジェクト全体の統一ルール
- [ユースケース集](./04-development/05-custom-hooks/guides/04-use-cases/) - 認証、CRUD、検索などの実装例
- [React 19機能詳細](./04-development/05-custom-hooks/guides/05-react19-features/) - useOptimistic、use()の詳細
- [ベストプラクティス](./04-development/05-custom-hooks/guides/06-best-practices/) - エラーハンドリング、パフォーマンス
- [リファレンス](./04-development/05-custom-hooks/guides/07-reference/) - クイックリファレンス

**📘 学習型（体系的に学びたい方）:**

- [イントロダクション](./04-development/05-custom-hooks/learning/01-introduction.md) - カスタムフックの基本から学ぶ
- [基礎編：カスタムフックの基本](./04-development/05-custom-hooks/learning/02-basics.md) - 基本パターンと命名規則
- [フォーム管理フック](./04-development/05-custom-hooks/learning/03-forms.md) - フォーム処理パターン
- [データ取得フック](./04-development/05-custom-hooks/learning/04-data.md) - API通信パターン
- [統合パターン](./04-development/05-custom-hooks/learning/05-integration.md) - 複数フックの組み合わせ
- [React 19機能](./04-development/05-custom-hooks/learning/06-react19.md) - React 19新機能の活用
- [高度なパターン](./04-development/05-custom-hooks/learning/07-advanced-patterns.md) - 応用テクニック
- [リファレンス](./04-development/05-custom-hooks/learning/08-reference.md) - クイックリファレンス

#### [06. フォーム・バリデーション](./04-development/06-forms-validation/)

React Hook Form + Zodによるフォーム実装

- [基本パターン](./04-development/06-forms-validation/01-basic-patterns.md) - useForm、zodResolver
- [バリデーションルール](./04-development/06-forms-validation/02-validation-rules.md) - Zodスキーマ、カスタムバリデーション
- [スキーマ管理](./04-development/06-forms-validation/03-schema-management.md) - 共通スキーマの管理方法
- [再利用可能なコンポーネント](./04-development/06-forms-validation/04-reusable-components.md) - ControlledFormField
- [複雑なフォーム](./04-development/06-forms-validation/05-complex-forms.md) - ネスト、配列フィールド
- [動的バリデーション](./04-development/06-forms-validation/06-dynamic-validation.md) - 条件付きバリデーション
- [サーバーエラーハンドリング](./04-development/06-forms-validation/07-server-errors.md) - APIエラー処理
- [ベストプラクティス](./04-development/06-forms-validation/08-best-practices.md) - フォーム開発のまとめ

#### [07. API統合](./04-development/07-api-integration/)

TanStack QueryによるAPI統合の実装パターン

- [API統合](./04-development/07-api-integration/index.md) - Query、Mutation、ベストプラクティス

#### [08. MSW (Mock Service Worker)](./04-development/08-msw/)

APIモックによる開発・テスト環境の構築

- [MSWの紹介](./04-development/08-msw/01-introduction.md) - MSWとは、導入メリット
- [インストール](./04-development/08-msw/02-installation.md) - セットアップ手順
- [基本設定](./04-development/08-msw/03-basic-configuration.md) - ディレクトリ構造、ハンドラー作成
- [ハンドラーの作成](./04-development/08-msw/04-creating-handlers.md) - REST API、GraphQL、動的レスポンス
- [MSWProviderの実装](./04-development/08-msw/05-msw-provider.md) - アプリケーションへの統合
- [Storybookとの統合](./04-development/08-msw/06-storybook-integration.md) - Storybookでの使用
- [テストとの統合](./04-development/08-msw/07-testing-integration.md) - Vitest、Playwright
- [ベストプラクティス](./04-development/08-msw/08-best-practices.md) - ハンドラー整理、データ共有
- [トラブルシューティング](./04-development/08-msw/09-troubleshooting.md) - よくある問題と解決策

### 05. Testing

テスト戦略と実装方法

- [01. テスト戦略](./05-testing/01-testing-strategy.md) - テストピラミッドとカバレッジ目標
- [02. ユニットテスト](./05-testing/02-unit-testing.md) - Vitestによる関数・フックのテスト
- [03. コンポーネントテスト](./05-testing/03-component-testing.md) - React Testing Libraryの使い方
- [04. Storybookインタラクション](./05-testing/04-storybook-interaction.md) - play関数によるUIテスト
- [05. E2Eテスト](./05-testing/05-e2e-testing.md) - Playwrightによるエンドツーエンドテスト
- [06. ベストプラクティス](./05-testing/06-best-practices.md) - 効果的なテストの書き方

### 06. Guides

実装ガイド

- [01. コード生成](./06-guides/01-code-generator.md) - Plopによるコード生成
- [02. コンポーネント作成](./06-guides/02-create-component.md) - コンポーネント作成手順
- [03. API作成](./06-guides/03-create-api.md) - API統合手順
- [04. Feature作成](./06-guides/04-create-feature.md) - 機能モジュール作成
- [05. ページ追加](./06-guides/05-create-page.md) - 新規ページ追加
- [06. フォーム追加](./06-guides/06-create-form.md) - フォーム実装手順
- [07. トラブルシューティング](./06-guides/07-troubleshooting.md) - よくある問題と解決方法

### 07. Reference

参考資料とリンク集

- [01. リソース](./07-reference/01-resources.md) - 外部リンク・学習リソース
- [02. ユーティリティ関数](./07-reference/02-utils.md) - 日付操作・フォーマット・バリデーション関数
