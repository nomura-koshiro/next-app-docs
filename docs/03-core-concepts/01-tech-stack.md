# 技術スタック

このドキュメントでは、プロジェクトで使用している主要な技術スタックとライブラリについて説明します。フレームワーク、UIライブラリ、状態管理、開発ツールなど、プロジェクトの基盤となる技術選定とその理由を理解できます。

## 目次

1. [フレームワーク](#フレームワーク)
2. [UIスタイリング](#uiスタイリング)
3. [状態管理](#状態管理)
4. [フォーム管理](#フォーム管理)
5. [データ取得](#データ取得)
6. [開発ツール](#開発ツール)
7. [ライブラリ選定基準](#ライブラリ選定基準)

---

## フレームワーク

### Next.js 15.5.4 + React 19.1.0

- **App Router**: ファイルベースのルーティング
- **Client Components**: FastAPI バックエンドとの連携のため Client Component のみ使用
- **TypeScript 5**: 型安全な開発
- **Turbopack**: 高速なビルドツール
- **React 19 機能**: `useOptimistic` を活用した楽観的UI更新

```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "^5"
}
```

**React 19の新機能について:**

- [React 19機能の使い分けガイド](../04-development/05-custom-hooks/guides/01-decision-guide/) - useOptimistic、use()、useTransition の実践的な使い方

**公式**: [Next.js](https://nextjs.org/) | [React](https://react.dev/)

---

## UI・スタイリング

### Tailwind CSS v4

- **CSS-only設定**: JavaScriptの設定ファイル不要
- **@theme**: globals.cssでカスタムカラーを定義

```css
/* globals.css */
@import 'tailwindcss';

@theme {
  --color-brand-primary: hsl(220 91% 63%);
}
```

**公式**: [Tailwind CSS](https://tailwindcss.com/)

### shadcn/ui

- Radix UIベースのアクセシブルなコンポーネント
- コピー&ペーストで追加（npmパッケージではない）
- Tailwind CSSでスタイリング

**公式**: [shadcn/ui](https://ui.shadcn.com/)

### CVA (Class Variance Authority)

バリアント管理ライブラリ。shadcn/uiで使用。

```typescript
const buttonVariants = cva('rounded font-semibold', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  },
});
```

**公式**: [CVA](https://cva.style/)

---

## 状態管理

### TanStack Query v5.90.2

**サーバー状態**の管理（APIから取得するデータ）

- データフェッチング
- キャッシング
- バックグラウンド更新
- DevTools対応

```json
{
  "@tanstack/react-query": "^5.90.2",
  "@tanstack/react-query-devtools": "^5.90.2",
  "@tanstack/eslint-plugin-query": "^5.91.0"
}
```

**公式**: [TanStack Query](https://tanstack.com/query/latest)

### Zustand v5.0.8

**グローバル状態**の管理（クライアント側）

- 認証ユーザー情報
- テーマ設定
- サイドバーの開閉状態

```json
{
  "zustand": "^5.0.8"
}
```

**公式**: [Zustand](https://zustand-demo.pmnd.rs/)

### useState

**ローカル状態**の管理

- モーダルの開閉
- フォーム入力中の値
- タブの選択状態

---

## フォーム管理

### React Hook Form v7.64.0 + Zod v4.1.12

- **React Hook Form**: パフォーマンスに優れたフォーム管理
- **Zod**: スキーマバリデーション
- **@hookform/resolvers**: ZodとReact Hook Formの統合
- **@hookform/devtools**: 開発ツール

```typescript
const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('正しいメールアドレスを入力してください'),
});
```

```json
{
  "react-hook-form": "^7.64.0",
  "zod": "^4.1.12",
  "@hookform/resolvers": "^5.2.2",
  "@hookform/devtools": "^4.4.0"
}
```

**公式**: [React Hook Form](https://react-hook-form.com/) | [Zod](https://zod.dev/)

---

## データ取得

### Axios v1.12.2

HTTPクライアント

- リクエスト/レスポンスインターセプター
- 自動JSONデータ変換
- Cookie認証対応

```json
{
  "axios": "^1.12.2"
}
```

**公式**: [Axios](https://axios-http.com/)

---

## 開発ツール

| ツール         | バージョン | 用途                                 |
| -------------- | ---------- | ------------------------------------ |
| **Vitest**     | v3.2.4     | ユニットテスト・コンポーネントテスト |
| **Playwright** | v1.56.0    | E2Eテスト                            |
| **Storybook**  | v9.1.10    | UIコンポーネント開発                 |
| **MSW**        | v2.11.5    | APIモック                            |
| **ESLint**     | v9         | コードの静的解析                     |
| **Prettier**   | v3.6.2     | コードフォーマット                   |
| **Stylelint**  | v16.25.0   | CSSリント                            |
| **plop**       | v4.0.4     | コード生成                           |
| **pnpm**       | -          | パッケージマネージャー               |

```json
{
  "vitest": "^3.2.4",
  "@vitest/browser": "3.2.4",
  "@vitest/coverage-v8": "3.2.4",
  "@playwright/test": "^1.56.0",
  "storybook": "9.1.10",
  "msw": "^2.11.5",
  "eslint": "^9",
  "prettier": "^3.6.2",
  "stylelint": "^16.25.0",
  "plop": "^4.0.4"
}
```

---

## その他のライブラリ

### UI関連

| ライブラリ              | バージョン | 用途                   |
| ----------------------- | ---------- | ---------------------- |
| **lucide-react**        | v0.545.0   | アイコン               |
| **tailwind-merge**      | v3.3.1     | Tailwindクラスのマージ |
| **tailwindcss-animate** | v1.0.7     | アニメーション         |
| **clsx**                | v2.1.1     | クラス名の条件付き結合 |

### ユーティリティ

| ライブラリ               | バージョン | 用途             |
| ------------------------ | ---------- | ---------------- |
| **date-fns**             | v4.1.0     | 日付操作         |
| **react-error-boundary** | v6.0.0     | エラーバウンダリ |
| **exceljs**              | v4.4.0     | Excel操作        |

### Radix UI（shadcn/uiベース）

```json
{
  "@radix-ui/react-checkbox": "^1.3.3",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-radio-group": "^1.3.8",
  "@radix-ui/react-select": "^2.2.6",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.6"
}
```

---

## ライブラリ選定基準

1. **TypeScript対応** - 型安全性
2. **アクティブなメンテナンス** - 定期的な更新
3. **ドキュメントの充実** - 学習コストの低減
4. **コミュニティの規模** - 問題解決が容易
5. **bulletproof-react準拠** - アーキテクチャとの親和性

---

## 参考リンク

### 内部ドキュメント

- [状態管理戦略](./02-state-management.md)
- [API統合](../04-development/07-api-integration/)
- [カスタムフック実装ガイド](../04-development/05-custom-hooks/)
- [React 19機能の使い分けガイド](../04-development/05-custom-hooks/guides/01-decision-guide/)

### 外部リンク

- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
- [React 19公式ブログ](https://react.dev/blog/2025/01/09/react-19)
