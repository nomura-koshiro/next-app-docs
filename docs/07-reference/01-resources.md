# 参考リソース

アプリ開発に役立つ外部リソースとリンク集です。公式ドキュメント、アーキテクチャパターン、学習リソース、開発ツール、コミュニティ情報など、Next.js/React開発に必要な情報を一箇所に集約しています。

## 目次

1. [公式ドキュメント](#公式ドキュメント)
2. [アーキテクチャ・設計](#アーキテクチャ設計)
3. [学習リソース](#学習リソース)
4. [ツール・ライブラリ](#ツールライブラリ)
5. [コミュニティ](#コミュニティ)
6. [問題解決](#問題解決)
7. [Newsletter](#newsletter)
8. [YouTube チャンネル](#youtube-チャンネル)
9. [内部ドキュメント](#内部ドキュメント)

---

## 公式ドキュメント

### フレームワーク

| 名前 | URL | 説明 |
|------|-----|------|
| **Next.js** | <https://nextjs.org/docs> | Next.js 15公式ドキュメント |
| **React** | <https://react.dev/> | React 19公式ドキュメント |
| **TypeScript** | <https://www.typescriptlang.org/docs/> | TypeScript公式ハンドブック |

### UI・スタイリング

| 名前 | URL | 説明 |
|------|-----|------|
| **Tailwind CSS** | <https://tailwindcss.com/> | Tailwind CSS v4公式ドキュメント |
| **CVA** | <https://cva.style/> | Class Variance Authority |
| **Radix UI** | <https://www.radix-ui.com/> | アクセシブルなUIプリミティブ |

### 状態管理・データ取得

| 名前 | URL | 説明 |
|------|-----|------|
| **TanStack Query** | <https://tanstack.com/query/latest> | サーバー状態管理 |
| **Zustand** | <https://zustand-demo.pmnd.rs/> | クライアント状態管理 |

### フォーム・バリデーション

| 名前 | URL | 説明 |
|------|-----|------|
| **React Hook Form** | <https://react-hook-form.com/> | フォーム管理 |
| **Zod** | <https://zod.dev/> | スキーマバリデーション |

### テスト

| 名前 | URL | 説明 |
|------|-----|------|
| **Vitest** | <https://vitest.dev/> | ユニットテストフレームワーク |
| **Playwright** | <https://playwright.dev/> | E2Eテストフレームワーク |
| **Testing Library** | <https://testing-library.com/react> | Reactコンポーネントテスト |

---

## アーキテクチャ・設計

### bulletproof-react

**URL:** <https://github.com/alan2207/bulletproof-react>

**概要:** スケーラブルなReactアプリケーションのアーキテクチャパターン

**主要な原則:**

- Feature-Based Organization
- Unidirectional Codebase Flow
- Separation of Concerns
- No Cross-Feature Imports

### Feature-Sliced Design

**URL:** <https://feature-sliced.design/>

**概要:** 前述のbulletproof-reactと類似のアーキテクチャ手法

### React Architecture Best Practices

**URL:** <https://react.dev/learn/thinking-in-react>

**概要:** React公式の設計思想ガイド

---

## 学習リソース

### Next.js

| リソース | URL | 内容 |
|---------|-----|------|
| **Next.js Learn** | <https://nextjs.org/learn> | 公式チュートリアル |
| **App Router Migration** | <https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration-guide> | Pages → App Router移行ガイド |

### TypeScript

| リソース | URL | 内容 |
|---------|-----|------|
| **TypeScript Handbook** | <https://www.typescriptlang.org/docs/handbook/intro.html> | 公式ハンドブック |
| **TypeScript Deep Dive** | <https://basarat.gitbook.io/typescript> | 詳細な解説書 |
| **Type Challenges** | <https://github.com/type-challenges/type-challenges> | 型の練習問題 |

### React

| リソース | URL | 内容 |
|---------|-----|------|
| **React Docs** | <https://react.dev/learn> | 公式チュートリアル |
| **React Patterns** | <https://reactpatterns.com/> | デザインパターン集 |
| **React TypeScript Cheatsheet** | <https://react-typescript-cheatsheet.netlify.app/> | TypeScript + Reactチートシート |

### Tailwind CSS

| リソース | URL | 内容 |
|---------|-----|------|
| **Tailwind v4 Docs** | <https://tailwindcss.com/docs> | 公式ドキュメント |
| **Tailwind UI** | <https://tailwindui.com/> | プレミアムコンポーネント集 |
| **Headless UI** | <https://headlessui.com/> | アクセシブルなUIコンポーネント |

---

## ツール・ライブラリ

### 開発ツール

| ツール | URL | 用途 |
|--------|-----|------|
| **pnpm** | <https://pnpm.io/> | 高速なパッケージマネージャー |
| **ESLint** | <https://eslint.org/> | コード品質チェック |
| **Prettier** | <https://prettier.io/> | コードフォーマッター |
| **Storybook** | <https://storybook.js.org/> | UIコンポーネント開発 |

### VSCode拡張機能

| 拡張機能 | ID | 用途 |
|---------|---|------|
| **ESLint** | `dbaeumer.vscode-eslint` | リアルタイムlint |
| **Prettier** | `esbenp.prettier-vscode` | 自動フォーマット |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Tailwindクラス補完 |
| **Error Lens** | `usernamehw.errorlens` | インラインエラー表示 |
| **Pretty TypeScript Errors** | `yoavbls.pretty-ts-errors` | TypeScriptエラー見やすく |

### デバッグツール

| ツール | URL | 用途 |
|--------|-----|------|
| **React DevTools** | <https://react.dev/learn/react-developer-tools> | React デバッグ |
| **TanStack Query DevTools** | <https://tanstack.com/query/latest/docs/react/devtools> | クエリデバッグ |
| **Zustand DevTools** | <https://github.com/pmndrs/zustand#devtools> | ストアデバッグ |

---

## コミュニティ

### Discord・Slack

| コミュニティ | URL | 説明 |
|------------|-----|------|
| **Next.js Discord** | <https://nextjs.org/discord> | Next.js公式Discord |
| **Reactiflux** | <https://www.reactiflux.com/> | React開発者コミュニティ |
| **TailwindCSS Discord** | <https://tailwindcss.com/discord> | Tailwind CSS公式Discord |

### GitHub

| リポジトリ | URL | 説明 |
|-----------|-----|------|
| **Next.js** | <https://github.com/vercel/next.js> | Next.jsソースコード |
| **React** | <https://github.com/facebook/react> | Reactソースコード |
| **bulletproof-react** | <https://github.com/alan2207/bulletproof-react> | アーキテクチャリファレンス |

### ブログ・記事

| サイト | URL | 内容 |
|--------|-----|------|
| **Vercel Blog** | <https://vercel.com/blog> | Next.js最新情報 |
| **React Blog** | <https://react.dev/blog> | React公式ブログ |
| **Kent C. Dodds** | <https://kentcdodds.com/blog> | React/Testing専門家のブログ |
| **Josh W. Comeau** | <https://www.joshwcomeau.com/> | CSS/Reactの深掘り記事 |

---

## 問題解決

### Stack Overflow

**タグ:**

- [next.js](<https://stackoverflow.com/questions/tagged/next.js>)
- [reactjs](<https://stackoverflow.com/questions/tagged/reactjs>)
- [typescript](<https://stackoverflow.com/questions/tagged/typescript>)
- [tailwind-css](<https://stackoverflow.com/questions/tagged/tailwind-css>)

### GitHub Issues

各ライブラリの公式リポジトリのIssueを検索：

- [Next.js Issues](<https://github.com/vercel/next.js/issues>)
- [React Issues](<https://github.com/facebook/react/issues>)
- [TanStack Query Issues](<https://github.com/TanStack/query/issues>)

---

## Newsletter

| Newsletter | URL | 内容 |
|-----------|-----|------|
| **React Newsletter** | <https://reactnewsletter.com/> | React週刊ニュース |
| **TypeScript Weekly** | <https://typescript-weekly.com/> | TypeScript週刊ニュース |
| **Tailwind Weekly** | <https://tailwindweekly.com/> | Tailwind週刊ニュース |

---

## YouTube チャンネル

| チャンネル | URL | 内容 |
|-----------|-----|------|
| **Vercel** | <https://www.youtube.com/@VercelHQ> | Next.js公式チャンネル |
| **Jack Herrington** | <https://www.youtube.com/@jherr> | TypeScript/React解説 |
| **Theo - t3.gg** | <https://www.youtube.com/@t3dotgg> | Next.js実践的な内容 |
| **Web Dev Simplified** | <https://www.youtube.com/@WebDevSimplified> | 初心者向けチュートリアル |

---

## 内部ドキュメント

### Getting Started

- [セットアップガイド](../01-getting-started/01-setup.md)
- [クイックスタート](../01-getting-started/02-quick-start.md)

### Architecture

- [プロジェクト構造](../02-architecture/01-project-structure.md)
- [bulletproof-react適用指針](../02-architecture/02-bulletproof-react.md)

### Core Concepts

- [技術スタック](../03-core-concepts/01-tech-stack.md)
- [状態管理](../03-core-concepts/02-state-management.md)
- [ルーティング](../03-core-concepts/03-routing.md)
- [スタイリング](../03-core-concepts/04-styling.md)
- [環境変数](../03-core-concepts/05-environment-variables.md)
- [APIクライアント](../03-core-concepts/06-api-client.md)
- [TanStack Query](../03-core-concepts/07-tanstack-query.md)

### Guides

- [UIコンポーネント作成](../06-guides/01-create-component.md)
- [API関数作成](../06-guides/02-create-api.md)
- [新しいFeature作成](../06-guides/03-create-feature.md)
- [ページ追加](../06-guides/04-add-page.md)
- [フォーム作成](../06-guides/05-add-form.md)
- [トラブルシューティング](../06-guides/06-troubleshooting.md)

### Development

- [コーディング規約](../04-development/01-coding-standards.md)
- [Linter/Formatter](../04-development/02-linter-formatter.md)
- [コンポーネント設計](../04-development/03-component-design.md)
- [フォーム・バリデーション](../04-development/04-forms-validation.md)
- [API統合](../04-development/05-api-integration.md)
- [Storybook](../04-development/06-storybook.md)
- [MSW](../04-development/07-msw.md)
