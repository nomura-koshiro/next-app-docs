# 使用ライブラリ一覧

このドキュメントでは、プロジェクトで使用している主要なライブラリとその役割について説明します。

## 目次

1. [フレームワーク](#フレームワーク)
2. [UI・スタイリング](#uiスタイリング)
3. [状態管理](#状態管理)
4. [フォーム管理](#フォーム管理)
5. [データ取得・API通信](#データ取得api通信)
6. [Excel・CSV処理](#excelcsv処理)
7. [エラーハンドリング](#エラーハンドリング)
8. [開発ツール](#開発ツール)
9. [コード品質管理](#コード品質管理)

---

## フレームワーク

### Next.js (v15.5.4)

**公式サイト:** https://nextjs.org/

**用途:** Reactベースのフルスタックフレームワーク

**主な機能:**

- App Router（最新のルーティングシステム）
- Server Components（サーバーサイドレンダリング）
- Turbopack（高速ビルドツール）
- ファイルベースルーティング
- API Routes

**選定理由:**

- React 19との互換性
- 優れたパフォーマンス
- SEO対策が容易
- サーバーサイドとクライアントサイドの統合開発が可能

---

### React (v19.1.0)

**公式サイト:** https://react.dev/

**用途:** UIライブラリ

**主な機能:**

- 宣言的なUI構築
- コンポーネントベースのアーキテクチャ
- Hooks（useState, useEffect, etc.）
- 新しいJSX変換（React importなしで動作）

---

### TypeScript (v5.9.3)

**公式サイト:** https://www.typescriptlang.org/

**用途:** 型安全なJavaScript

**主な機能:**

- 静的型チェック
- IntelliSense（コード補完）
- コンパイル時エラー検出
- 最新ECMAScript機能のサポート

**設定:**

- `target: ESNext` - 最新のJavaScript機能を使用
- `strict: true` - 厳格な型チェック
- `noUncheckedIndexedAccess: true` - 配列・オブジェクトアクセスの安全性向上

---

## UI・スタイリング

### Material-UI (MUI) (v7.3.4)

**公式サイト:** https://mui.com/

**用途:** UIコンポーネントライブラリ

**主な機能:**

- Google Material Designベースのコンポーネント
- カスタマイズ可能なテーマシステム
- レスポンシブデザイン対応
- アクセシビリティ対応

**インストール済みパッケージ:**

- `@mui/material` - コアコンポーネント
- `@mui/material-nextjs` - Next.js統合
- `@mui/system` - スタイリングユーティリティ

---

### Emotion (v11.14.0)

**公式サイト:** https://emotion.sh/

**用途:** CSS-in-JSライブラリ（MUIの内部で使用）

**主な機能:**

- JavaScriptでCSSを記述
- 動的スタイリング
- サーバーサイドレンダリング対応

**インストール済みパッケージ:**

- `@emotion/react` - Reactバインディング
- `@emotion/styled` - styled-components API
- `@emotion/cache` - スタイルキャッシュ

---

### Tailwind CSS (v4.1.14)

**公式サイト:** https://tailwindcss.com/

**用途:** ユーティリティファーストCSSフレームワーク

**主な機能:**

- クラスベースのスタイリング
- カスタマイズ可能なデザインシステム
- JITモード（必要なCSSのみ生成）
- レスポンシブデザイン対応

**設定:**

- PostCSSと統合
- @tailwindcss/postcss使用

---

## 状態管理

### Zustand (v5.0.8)

**公式サイト:** https://zustand-demo.pmnd.rs/

**用途:** 軽量な状態管理ライブラリ

**主な機能:**

- シンプルなAPI
- TypeScript完全サポート
- React Hooksベース
- DevTools対応

**使用例:**

```typescript
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
```

**選定理由:**

- ReduxやMobXより軽量
- ボイラープレートが少ない
- グローバル状態管理に最適

---

## フォーム管理

### React Hook Form (v7.64.0)

**公式サイト:** https://react-hook-form.com/

**用途:** フォーム管理ライブラリ

**主な機能:**

- パフォーマンスに優れた（再レンダリングが少ない）
- バリデーション機能
- TypeScript完全サポート
- 非制御コンポーネントベース

**使用例:**

```typescript
import { useForm } from 'react-hook-form'

const { register, handleSubmit, formState: { errors } } = useForm()
```

---

### Zod (v4.1.12)

**公式サイト:** https://zod.dev/

**用途:** TypeScript-firstなスキーマバリデーション

**主な機能:**

- 型安全なバリデーション
- React Hook Formとの統合
- 推論された型定義
- ランタイムバリデーション

**使用例:**

```typescript
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上必要です'),
})

type FormData = z.infer<typeof schema>

const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

---

### @hookform/resolvers (v5.2.2)

**公式サイト:** https://github.com/react-hook-form/resolvers

**用途:** React Hook FormとZodの統合

**主な機能:**

- zodResolverでZodスキーマをReact Hook Formに接続
- 他のバリデーションライブラリもサポート（Yup, Joi等）

---

## データ取得・API通信

### TanStack Query (React Query) (v5.90.2)

**公式サイト:** https://tanstack.com/query/latest

**用途:** サーバー状態管理ライブラリ

**主な機能:**

- データフェッチング
- キャッシング
- バックグラウンド更新
- 楽観的更新
- ページネーション・無限スクロール

**使用例:**

```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

**選定理由:**

- サーバー状態とクライアント状態の分離
- 自動的なキャッシュ管理
- DevTools対応で開発が容易

---

### Axios (v1.12.2)

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

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
})
```

---

## Excel・CSV処理

### ExcelJS (v4.4.0)

**公式サイト:** https://github.com/exceljs/exceljs

**用途:** Excelファイルの読み書き

**主な機能:**

- XLSXファイルの作成・編集
- セルのスタイリング
- 数式のサポート
- 大規模ファイル対応

---

### SheetJS (xlsx) (v0.20.2)

**公式サイト:** https://sheetjs.com/

**用途:** スプレッドシート処理

**主な機能:**

- 多様なフォーマット対応（Excel, CSV, etc.）
- ブラウザとNode.js両対応
- データのインポート・エクスポート

**注意:** CDN版を使用（`https://cdn.sheetjs.com/xlsx-0.20.2/xlsx-0.20.2.tgz`）

---

### PapaParse (v5.5.3)

**公式サイト:** https://www.papaparse.com/

**用途:** CSVパーサー

**主な機能:**

- 高速なCSV解析
- ストリーミング対応
- エラーハンドリング
- ヘッダー行の自動検出

---

### file-saver (v2.0.5)

**公式サイト:** https://github.com/eligrey/FileSaver.js

**用途:** ファイルダウンロード

**主な機能:**

- クライアントサイドでのファイル保存
- Blob/File APIのラッパー
- クロスブラウザ対応

---

## エラーハンドリング

### React Error Boundary (v6.0.0)

**公式サイト:** https://github.com/bvaughn/react-error-boundary

**用途:** Reactコンポーネントのエラーハンドリング

**主な機能:**

- コンポーネントツリーのエラーキャッチ
- フォールバックUI表示
- エラーリセット機能

**使用例:**

```typescript
import { ErrorBoundary } from 'react-error-boundary'

<ErrorBoundary
  FallbackComponent={ErrorFallback}
  onReset={() => window.location.reload()}
>
  <App />
</ErrorBoundary>
```

---

## 開発ツール

### Mock Service Worker (MSW) (v2.11.3)

**公式サイト:** https://mswjs.io/

**用途:** APIモックツール

**主な機能:**

- Service Workerベースのモック
- ブラウザとNode.js両対応
- REST API・GraphQLサポート
- 開発環境でのAPIモック

**使用例:**

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ])
  }),
]
```

---

### @hookform/devtools (v4.4.0)

**公式サイト:** https://react-hook-form.com/dev-tools

**用途:** React Hook Formのデバッグツール

**主な機能:**

- フォーム状態の可視化
- バリデーションエラーの確認
- リアルタイム監視

---

### @tanstack/react-query-devtools (v5.90.2)

**公式サイト:** https://tanstack.com/query/latest/docs/framework/react/devtools

**用途:** React Queryのデバッグツール

**主な機能:**

- クエリ状態の可視化
- キャッシュの確認
- クエリの無効化・再フェッチ

---

## コード品質管理

### ESLint (v9.37.0)

**公式サイト:** https://eslint.org/

**用途:** JavaScriptリンター

**主な機能:**

- コードの静的解析
- コーディング規約の強制
- 自動修正機能

**プラグイン:**

- `@typescript-eslint/eslint-plugin` - TypeScript対応
- `@typescript-eslint/parser` - TypeScriptパーサー
- `eslint-config-next` - Next.js推奨設定
- `eslint-config-prettier` - Prettierとの競合回避

---

### Prettier (v3.6.2)

**公式サイト:** https://prettier.io/

**用途:** コードフォーマッター

**主な機能:**

- 自動コード整形
- 一貫したコードスタイル
- 保存時の自動フォーマット

**設定:**

```json
{
  "printWidth": 140,
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## パッケージ管理

### pnpm (v10.18.1)

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

## その他のツール

### @svgr/webpack (v8.1.0)

**公式サイト:** https://react-svgr.com/

**用途:** SVGをReactコンポーネントに変換

**主な機能:**

- SVGのインポート・使用が容易
- TypeScript型定義生成
- 最適化されたSVGコンポーネント

**使用例:**

```typescript
import Logo from '@/assets/logo.svg'

<Logo width={100} height={100} />
```

---

## ライブラリ選定基準

このプロジェクトでは、以下の基準でライブラリを選定しています：

1. **TypeScript対応** - 型安全性の確保
2. **アクティブなメンテナンス** - 定期的な更新とバグ修正
3. **ドキュメントの充実** - 学習コストの低減
4. **コミュニティの規模** - 問題解決が容易
5. **パフォーマンス** - アプリケーションの高速化
6. **React 19対応** - 最新バージョンとの互換性

---

## 参考リンク

### プロジェクト内ドキュメント

- **[ドキュメント目次](./README.md)** - すべてのドキュメント一覧
- **[環境構築ガイド](./01-setup.md)** - 開発環境のセットアップ
- **[プロジェクト構成](./02-project-structure.md)** - ディレクトリ構造とアーキテクチャ
- **[状態管理戦略](./04-state-management.md)** - Zustand, TanStack Queryの使い方
- [package.json](../package.json) - インストール済みパッケージの詳細

### 外部リンク

- [Next.jsドキュメント](https://nextjs.org/docs)
- [Reactドキュメント](https://react.dev/)
- [TypeScriptハンドブック](https://www.typescriptlang.org/docs/)
