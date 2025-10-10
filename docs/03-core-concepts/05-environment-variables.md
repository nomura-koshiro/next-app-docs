# 環境変数管理 (env.ts)

このドキュメントでは、プロジェクトにおける環境変数の管理方法を説明します。

## 目次

1. [概要](#概要)
2. [env.tsの実装](#envtsの実装)
3. [環境変数の定義](#環境変数の定義)
4. [使用方法](#使用方法)
5. [エラーハンドリング](#エラーハンドリング)
6. [ベストプラクティス](#ベストプラクティス)

---

## 概要

### なぜenv.tsが必要か？

通常、Next.jsでは `process.env.NEXT_PUBLIC_*` で環境変数にアクセスしますが、以下の問題があります:

| 問題 | 説明 |
|------|------|
| **型安全性の欠如** | `process.env.*` は `string \| undefined` 型 |
| **必須チェックがない** | 環境変数が未定義でも実行時まで気づかない |
| **型変換が必要** | boolean や number への変換を毎回手動で行う必要がある |
| **バリデーションがない** | 不正な値が設定されていてもエラーにならない |

### env.tsの利点

✅ **型安全** - 環境変数の型を明示的に定義
✅ **必須チェック** - アプリ起動時に必須変数をチェック
✅ **自動変換** - 文字列からboolean/numberへ自動変換
✅ **バリデーション** - Zodによる値の検証
✅ **デフォルト値** - オプション変数にデフォルト値を設定

---

## env.tsの実装

### 完全な実装

```typescript
// src/config/env.ts
import * as z from 'zod';

/**
 * 環境変数を検証して型安全に取得する
 *
 * @returns 検証済みの環境変数オブジェクト
 * @throws {Error} 必須の環境変数が不足している、または不正な値が設定されている場合
 */
const createEnv = () => {
  // 環境変数のスキーマ定義
  const EnvSchema = z.object({
    // APIエンドポイントURL（必須）
    API_URL: z.string(),

    // MSWモックAPIの有効/無効フラグ（オプション）
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === 'true' || s === 'false')
      .transform((s) => s === 'true')
      .optional(),

    // アプリケーションURL（オプション、デフォルト: http://localhost:3000）
    APP_URL: z.string().optional().default('http://localhost:3000'),

    // モックAPIポート番号（オプション、デフォルト: 8080）
    APP_MOCK_API_PORT: z.string().optional().default('8080'),
  });

  // Next.jsの環境変数から値を取得
  const envVars = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
    APP_URL: process.env.NEXT_PUBLIC_URL,
    APP_MOCK_API_PORT: process.env.NEXT_PUBLIC_MOCK_API_PORT,
  };

  // スキーマで検証
  const parsedEnv = EnvSchema.safeParse(envVars);

  // 検証失敗時はエラーメッセージを出力
  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

/**
 * 型安全な環境変数オブジェクト
 *
 * @example
 * import { env } from '@/config/env';
 *
 * const apiUrl = env.API_URL;
 * const isMocking = env.ENABLE_API_MOCKING;
 */
export const env = createEnv();
```

### スキーマ定義の詳細

#### 1. 必須の文字列

```typescript
API_URL: z.string()
```

- 環境変数が未定義の場合、エラーをスロー
- 空文字列もエラー

#### 2. オプションのboolean

```typescript
ENABLE_API_MOCKING: z
  .string()
  .refine((s) => s === 'true' || s === 'false')  // 'true' か 'false' のみ許可
  .transform((s) => s === 'true')                 // boolean に変換
  .optional()                                     // 未定義でもOK
```

#### 3. デフォルト値付きのオプション

```typescript
APP_URL: z.string().optional().default('http://localhost:3000')
```

- 環境変数が未定義の場合、デフォルト値を使用

---

## 環境変数の定義

### .env.localファイル

```bash
# .env.local

# API設定
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# MSW (Mock Service Worker) 設定
# 開発環境でMSWを有効にする場合は'true'に設定
NEXT_PUBLIC_ENABLE_API_MOCKING=true

# アプリケーション設定
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_MOCK_API_PORT=8080
```

### 環境別のファイル

| ファイル | 用途 | Git管理 |
|---------|------|---------|
| `.env` | すべての環境で共通のデフォルト値 | ✅ コミット |
| `.env.local` | ローカル開発環境の設定 | ❌ `.gitignore` |
| `.env.development` | 開発環境専用の設定 | ✅ コミット |
| `.env.production` | 本番環境専用の設定 | ✅ コミット |

### Next.jsの環境変数読み込み順序

1. `.env.production.local` / `.env.development.local`
2. `.env.local`
3. `.env.production` / `.env.development`
4. `.env`

---

## 使用方法

### 基本的な使い方

```typescript
// APIクライアントで使用
import { env } from '@/config/env';

export const api = Axios.create({
  baseURL: env.API_URL,  // 型安全: string
});
```

### boolean値の使用

```typescript
import { env } from '@/config/env';

// MSWの初期化
if (env.ENABLE_API_MOCKING) {  // 型安全: boolean | undefined
  const { worker } = await import('@/mocks/browser');
  await worker.start();
}
```

### デフォルト値の使用

```typescript
import { env } from '@/config/env';

// デフォルト値が適用される
console.log(env.APP_URL);  // 'http://localhost:3000'（未定義の場合）
```

---

## エラーハンドリング

### 必須変数が未定義の場合

```bash
# .env.local に NEXT_PUBLIC_API_URL がない場合

npm run dev
```

**エラー出力:**

```
Error: Invalid env provided.
  The following variables are missing or invalid:
  - API_URL: Required
```

### 不正な値が設定されている場合

```bash
# .env.local
NEXT_PUBLIC_API_MOCKING=yes  # 'true' か 'false' のみ許可
```

**エラー出力:**

```
Error: Invalid env provided.
  The following variables are missing or invalid:
  - ENABLE_API_MOCKING: Invalid input
```

---

## ベストプラクティス

### 1. 環境変数の命名規則

```typescript
// ✅ Good: 明確でわかりやすい名前
API_URL: z.string()
ENABLE_API_MOCKING: z.boolean()
DATABASE_URL: z.string()

// ❌ Bad: 略語や曖昧な名前
URL: z.string()
MOCK: z.boolean()
DB: z.string()
```

### 2. スキーマの分類

```typescript
const EnvSchema = z.object({
  // === API関連 ===
  API_URL: z.string(),
  API_TIMEOUT: z.string().transform(Number).default('10000'),

  // === 認証関連 ===
  AUTH_SECRET: z.string(),
  AUTH_COOKIE_NAME: z.string().default('auth-token'),

  // === 機能フラグ ===
  ENABLE_API_MOCKING: z.boolean().optional(),
  ENABLE_ANALYTICS: z.boolean().optional(),
});
```

### 3. 型の明示

```typescript
// ✅ Good: 変換後の型を明示
const EnvSchema = z.object({
  API_TIMEOUT: z
    .string()
    .transform((s) => parseInt(s, 10))  // number に変換
    .pipe(z.number().positive()),        // 正の数のみ許可
});

// 使用時
const timeout: number = env.API_TIMEOUT;
```

### 4. 環境ごとのバリデーション

```typescript
const EnvSchema = z.object({
  API_URL: z.string().url(),  // URL形式をチェック

  // 本番環境では必須、開発環境ではオプション
  SENTRY_DSN: process.env.NODE_ENV === 'production'
    ? z.string()
    : z.string().optional(),
});
```

### 5. 機密情報の扱い

```typescript
// ✅ Good: サーバーサイド専用の環境変数（NEXT_PUBLIC_ なし）
const ServerEnvSchema = z.object({
  DATABASE_URL: z.string(),        // サーバーのみ
  API_SECRET_KEY: z.string(),      // サーバーのみ
});

// ❌ Bad: 機密情報を NEXT_PUBLIC_ で公開
const EnvSchema = z.object({
  NEXT_PUBLIC_API_SECRET: z.string(),  // クライアントに露出！
});
```

### 6. 型推論の活用

```typescript
// env の型を推論
type Env = z.infer<typeof EnvSchema>;

// 使用例
const logEnv = (env: Env) => {
  console.log('API URL:', env.API_URL);
  console.log('Mocking:', env.ENABLE_API_MOCKING);
};
```

---

## 新しい環境変数の追加方法

### 1. スキーマに追加

```typescript
// src/config/env.ts
const EnvSchema = z.object({
  // 既存の変数
  API_URL: z.string(),

  // 新規追加
  NEW_FEATURE_ENABLED: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .optional()
    .default('false'),
});
```

### 2. .env.localに追加

```bash
# .env.local

# 新機能フラグ
NEXT_PUBLIC_NEW_FEATURE_ENABLED=true
```

### 3. envVarsオブジェクトに追加

```typescript
const envVars = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEW_FEATURE_ENABLED: process.env.NEXT_PUBLIC_NEW_FEATURE_ENABLED,  // 追加
};
```

### 4. 使用

```typescript
import { env } from '@/config/env';

if (env.NEW_FEATURE_ENABLED) {
  // 新機能を有効化
}
```

---

## トラブルシューティング

### 環境変数が undefined になる

**原因:** `NEXT_PUBLIC_` プレフィックスがない

```bash
# ❌ Bad
API_URL=http://localhost:3000/api

# ✅ Good
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 開発サーバーを再起動しても反映されない

**解決策:** `.env.local` を変更したら、開発サーバーを再起動

```bash
# サーバーを停止（Ctrl+C）
npm run dev
```

### 型エラーが出る

```typescript
// Error: Property 'NEW_VAR' does not exist on type 'Env'
const value = env.NEW_VAR;
```

**解決策:** `env.ts` のスキーマと `envVars` オブジェクトに追加

---

## 参考リンク

### プロジェクト内ドキュメント

- [API統合](./03-api-integration.md) - env.ts の使用例
- [プロジェクト構成](../02-architecture/01-project-structure.md) - env.ts の配置場所

### 外部リンク

- [Next.js - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Zod - Schema Validation](https://zod.dev/)
- [bulletproof-react - env.ts](https://github.com/alan2207/bulletproof-react)
