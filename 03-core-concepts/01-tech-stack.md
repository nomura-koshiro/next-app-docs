# 技術スタック

本プロジェクトで使用している主要な技術とライブラリについて説明します。

## 目次

1. [フレームワーク](#フレームワーク)
2. [UI・スタイリング](#uiスタイリング)
3. [状態管理](#状態管理)
4. [フォーム管理](#フォーム管理)
5. [データ取得・API通信](#データ取得api通信)
6. [開発ツール](#開発ツール)
7. [コード品質管理](#コード品質管理)

---

## フレームワーク

### Next.js 15.5

**公式サイト:** https://nextjs.org/

**用途:** Reactベースのフルスタックフレームワーク

**主な機能:**

- App Router（最新のルーティングシステム）
- Server Components（サーバーサイドレンダリング）
- ファイルベースルーティング
- 画像最適化
- フォント最適化

**選定理由:**

- React 19との完全互換性
- 優れたパフォーマンス
- SEO対策が容易
- TypeScript完全サポート

---

### React 19

**公式サイト:** https://react.dev/

**用途:** UIライブラリ

**主な機能:**

- 宣言的なUI構築
- コンポーネントベースのアーキテクチャ
- Hooks（useState, useEffect, etc.）
- 新しいJSX変換（React importなしで動作）

---

### TypeScript 5.5+

**公式サイト:** https://www.typescriptlang.org/

**用途:** 型安全なJavaScript

**主な機能:**

- 静的型チェック
- IntelliSense（コード補完）
- コンパイル時エラー検出
- 最新ECMAScript機能のサポート

**設定:**

- `strict: true` - 厳格な型チェック
- `noUncheckedIndexedAccess: true` - 配列アクセスの安全性向上

---

## UI・スタイリング

### Tailwind CSS v4

**公式サイト:** https://tailwindcss.com/

**用途:** ユーティリティファーストCSSフレームワーク

**主な機能:**

- クラスベースのスタイリング
- CSS-onlyアプローチ（設定ファイル不要）
- JITモード（必要なCSSのみ生成）
- レスポンシブデザイン対応

**設定:**

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-brand-primary: hsl(220 91% 63%);
  --color-brand-secondary: hsl(160 84% 39%);
}
```

---

### CVA (Class Variance Authority)

**公式サイト:** https://cva.style/

**用途:** バリアント管理

**主な機能:**

- Tailwindクラスのバリアント管理
- 型安全なPropsバリアント
- 条件付きクラスの組み合わせ

**使用例:**

```typescript
import { cva } from 'class-variance-authority'

const button = cva('rounded font-semibold', {
  variants: {
    intent: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-gray-900',
    },
    size: {
      sm: 'px-3 py-1',
      md: 'px-4 py-2',
      lg: 'px-6 py-3',
    },
  },
})
```

---

## 状態管理

### TanStack Query (React Query)

**公式サイト:** https://tanstack.com/query/latest

**用途:** サーバー状態管理

**主な機能:**

- データフェッチング
- キャッシング
- バックグラウンド更新
- 楽観的更新
- 無限スクロール

**選定理由:**

- サーバー状態とクライアント状態の分離
- 自動的なキャッシュ管理
- DevTools対応

---

### Zustand

**公式サイト:** https://zustand-demo.pmnd.rs/

**用途:** クライアント状態管理

**主な機能:**

- シンプルなAPI
- TypeScript完全サポート
- React Hooksベース
- ミドルウェア対応（persist等）

**選定理由:**

- ReduxやMobXより軽量
- ボイラープレートが少ない
- グローバル状態管理に最適

---

## フォーム管理

### React Hook Form

**公式サイト:** https://react-hook-form.com/

**用途:** フォーム管理

**主な機能:**

- パフォーマンスに優れた（再レンダリングが少ない）
- バリデーション機能
- TypeScript完全サポート
- 非制御コンポーネントベース

---

### Zod

**公式サイト:** https://zod.dev/

**用途:** スキーマバリデーション

**主な機能:**

- TypeScript-firstなバリデーション
- React Hook Formとの統合
- 推論された型定義
- ランタイムバリデーション

**使用例:**

```typescript
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  age: z.number().min(0).max(150),
})

type User = z.infer<typeof userSchema>
```

---

## データ取得・API通信

### Axios

**公式サイト:** https://axios-http.com/

**用途:** HTTPクライアント

**主な機能:**

- PromiseベースのAPI
- リクエスト/レスポンスインターセプター
- 自動JSONデータ変換
- タイムアウト設定

**使用例:**

```typescript
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 開発ツール

### Vitest

**公式サイト:** https://vitest.dev/

**用途:** ユニットテスト

**主な機能:**

- 高速な実行速度
- Vite統合
- TypeScript/JSX対応
- Jestと互換性のあるAPI

---

### Playwright

**公式サイト:** https://playwright.dev/

**用途:** E2Eテスト

**主な機能:**

- クロスブラウザテスト
- 自動待機
- スクリーンショット・動画記録
- TypeScript対応

---

### Storybook

**公式サイト:** https://storybook.js.org/

**用途:** UIコンポーネント開発

**主な機能:**

- コンポーネントカタログ
- インタラクティブな開発環境
- Addons拡張
- ドキュメント自動生成

---

## コード品質管理

### ESLint

**公式サイト:** https://eslint.org/

**用途:** JavaScriptリンター

**主な機能:**

- コードの静的解析
- コーディング規約の強制
- 自動修正機能

**プラグイン:**

- `@typescript-eslint/eslint-plugin`
- `eslint-config-next`
- `eslint-config-prettier`

---

### Prettier

**公式サイト:** https://prettier.io/

**用途:** コードフォーマッター

**主な機能:**

- 自動コード整形
- 一貫したコードスタイル
- 保存時の自動フォーマット

---

## パッケージ管理

### pnpm

**公式サイト:** https://pnpm.io/

**用途:** パッケージマネージャー

**主な機能:**

- 高速インストール
- ディスク容量の節約（シンボリックリンク使用）
- 厳密な依存関係管理

**選定理由:**

- npmやyarnより高速
- モノレポサポート
- セキュリティが高い

---

## ライブラリ選定基準

アプリでは、以下の基準でライブラリを選定しています：

1. **TypeScript対応** - 型安全性の確保
2. **アクティブなメンテナンス** - 定期的な更新とバグ修正
3. **ドキュメントの充実** - 学習コストの低減
4. **コミュニティの規模** - 問題解決が容易
5. **パフォーマンス** - アプリケーションの高速化
6. **bulletproof-react準拠** - アーキテクチャとの親和性

---

## 参考リンク

### 内部ドキュメント

- [状態管理戦略](./02-state-management.md)
- [API統合](./03-api-integration.md)
- [コンポーネント設計](../04-implementation/01-component-design.md)

### 外部リンク

- [Next.jsドキュメント](https://nextjs.org/docs)
- [Reactドキュメント](https://react.dev/)
- [TypeScriptハンドブック](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [bulletproof-react](https://github.com/alan2207/bulletproof-react)
